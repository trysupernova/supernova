"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SupernovaTaskComponent, createBlankTask } from "./supernova-task";
import Mousetrap from "mousetrap";
import { TaskBuilderDialog } from "./task-builder-dialog";
import { ISupernovaTask } from "../types/supernova-task";
import { LocalDB } from "../services/local-db";
import Database from "tauri-plugin-sql-api";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { settingsRoute } from "./settings/meta";
import Image from "next/image";
import { SupernovaCommandCenter } from "./command-center";
import { SupernovaCommand } from "../types/command";
import { AlertDialog } from "./alert-dialog";
import { useRouter } from "next/navigation";
import { Kbd } from "../components/kbd";
// import { settingsRoute } from "./settings/meta";

export default function Home() {
  // get today's date in this format: Tue, 26th Aug
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const router = useRouter();

  const [db, setDb] = useState<Database | null>(null);
  const [chosenTaskIndex, setChosenTaskIndex] = useState<number>(-1);
  const [tasks, setTasks] = useState<ISupernovaTask[]>([]);
  const [taskFetchState, setTaskFetchState] = useState<{
    status: "loading" | "error" | "success";
    error?: string;
  }>({ status: "loading" });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refetchTasks, setRefetchTasks] = useState<boolean>(false); // refetch the tasks from the backend for consistency and sorting
  const [showAreYouSureDialog, setShowAreYouSureDialog] =
    useState<boolean>(false);

  const handleCheckTask = useCallback(
    (taskId: string) => (value: boolean) => {
      setTasks(
        tasks.map((task) => {
          if (taskId === task.id) {
            return {
              ...task,
              isComplete: value,
            };
          } else {
            return task;
          }
        })
      );
      // mark task complete in backend
      if (db === null) {
        console.error("Database not initialized");
        return;
      }
      try {
        console.log("updating task in backend...");
        LocalDB.markIsCompleteTask(db, taskId, value);
        console.log("updated successfully");
        setRefetchTasks(true); // refetch the tasks
      } catch (e: any) {
        console.error(e);
      }
    },
    [db, tasks]
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => () => {
      setTasks(tasks.filter((task) => task.id !== taskId));
      // delete task in backend
      if (db === null) {
        console.error("Database not initialized");
        return;
      }
      try {
        console.log("deleting task in backend...");
        LocalDB.deleteTask(db, taskId);
        console.log("deleted successfully");
        setRefetchTasks(true); // refetch the tasks
      } catch (e: any) {
        console.error(e);
      }
    },
    [db, tasks]
  );

  const handleCreateOrUpdateTask = useCallback(
    async (task: ISupernovaTask) => {
      if (chosenTaskIndex !== -1) {
        setTasks(
          tasks.map((t, i) => {
            if (i === chosenTaskIndex) {
              return task;
            } else {
              return t;
            }
          })
        );
        // update task in backend
        if (db === null) {
          console.error("Database not initialized");
          return;
        }
        try {
          console.log("updating task in backend...");
          await LocalDB.updateTask(db, task);
          console.log("updated successfully");
          setRefetchTasks(true); // refetch the tasks
        } catch (e: any) {
          console.error(e);
        }
      } else {
        setTasks([...tasks, task]);
        // create task in backend
        if (db === null) {
          console.error("Database not initialized");
          return;
        }
        try {
          console.log("inserting task to backend...");
          await LocalDB.insertTask(db, task);
          console.log("inserted successfully");
          setRefetchTasks(true); // refetch the tasks
        } catch (e: any) {
          console.error(e);
        }
      }
    },
    [chosenTaskIndex, db, tasks]
  );

  const commands: SupernovaCommand[] = useMemo(
    () => [
      {
        label: "Create a task",
        shortcut: "c",
        cb: (e) => {
          e?.preventDefault(); // prevent typing into the task builder
          setIsOpen(true);
          // deselect task
          setChosenTaskIndex(-1);
        },
      },
      {
        label: "Delete task",
        shortcut: "backspace",
        cb: (e) => {
          e?.preventDefault(); // prevent backspace from going back in history
          if (chosenTaskIndex !== -1) {
            setShowAreYouSureDialog(true);
          }
        },
      },
      {
        label: "Edit task",
        shortcut: "enter",
        cb: (e) => {
          e?.preventDefault(); // prevent typing into the task builder
          // if modal is open, then don't open another one
          if (isOpen) {
            return;
          }

          if (chosenTaskIndex !== -1) {
            setIsOpen(true);
          }
        },
      },
      {
        label: "Mark done/undone",
        shortcut: ["e", "x", "d"],
        cb: () => {
          if (chosenTaskIndex !== -1) {
            handleCheckTask(tasks[chosenTaskIndex].id)(
              !tasks[chosenTaskIndex].isComplete
            );
          }
        },
      },
      {
        label: "Go to settings",
        shortcut: "mod+,",
        cb: () => {
          router.push(settingsRoute);
        },
      },
    ],
    [chosenTaskIndex, handleCheckTask, isOpen, router, tasks]
  );

  const handleSubmitAreYouSure = () => {
    handleDeleteTask(tasks[chosenTaskIndex].id)();
    setChosenTaskIndex(-1); // deselect
    setShowAreYouSureDialog(false); // close this alert dialog
  };

  // register mousetraps
  useEffect(() => {
    // go up
    Mousetrap.bind(["k", "up"], () => {
      if (chosenTaskIndex > 0) {
        setChosenTaskIndex(chosenTaskIndex - 1);
      }
    });
    // go down
    Mousetrap.bind(["j", "down"], () => {
      if (chosenTaskIndex < tasks.length - 1) {
        setChosenTaskIndex(chosenTaskIndex + 1);
      }
    });

    // regiser the shortcuts above
    commands.forEach((command) => {
      Mousetrap.bind(command.shortcut, command.cb);
    });

    // unselect task (if task is selected)
    Mousetrap.bind("esc", () => {
      // if modal is open, then don't unselect
      if (isOpen) {
        return;
      }
      if (chosenTaskIndex !== -1) {
        setChosenTaskIndex(-1);
      }
    });

    return () => {
      Mousetrap.unbind(["k", "up"]);
      Mousetrap.unbind(["j", "down"]);
      Mousetrap.unbind("esc");
      commands.forEach((command) => {
        Mousetrap.unbind(command.shortcut);
      });
    };
  }, [
    chosenTaskIndex,
    commands,
    handleCheckTask,
    handleDeleteTask,
    isOpen,
    tasks,
  ]);

  useEffect(() => {
    // save to db
    (async () => {
      try {
        const db = await LocalDB.init();
        setDb(db);
        await LocalDB.createTables(db);
        console.log("created tables");
        const tasks = await LocalDB.getTasks(db);
        setTasks(tasks);
        setTaskFetchState({ status: "success" });
      } catch (e: any) {
        setTaskFetchState({ status: "error", error: e.message });
      }
    })();
  }, []);

  // refetch the tasks whenever there's a task update
  useEffect(() => {
    if (db === null) {
      console.error("Database not initialized");
      return;
    }
    if (!refetchTasks) {
      return;
    }
    (async () => {
      try {
        console.log("refetching tasks...");
        const tasks = await LocalDB.getTasks(db);
        console.log("refetched successfully");
        setTasks(tasks);
        setRefetchTasks(false);
      } catch (e: any) {
        console.error(e);
      }
    })();
  }, [db, refetchTasks]);

  const handleClickTask = (taskIndex: number) => () => {
    // select task
    setChosenTaskIndex(taskIndex);
    setIsOpen(true);
  };

  return (
    <main className="flex max-h-screen flex-col items-center pt-5 mb-10 px-5 gap-[10px]">
      <AlertDialog
        description={
          <p>
            Are you sure? Task
            <span className="pl-1 font-bold text-red-600">
              {chosenTaskIndex !== -1 && tasks[chosenTaskIndex].title}
            </span>
            will be deleted
          </p>
        }
        open={showAreYouSureDialog}
        setOpen={setShowAreYouSureDialog}
        handleSubmit={handleSubmitAreYouSure}
      />
      <SupernovaCommandCenter
        commands={commands}
        context={{
          chosenTask: chosenTaskIndex !== -1 ? tasks[chosenTaskIndex] : null,
        }}
      />
      <div className="flex items-center justify-end w-full">
        <Link href={settingsRoute}>
          <GearIcon width={20} height={20} />
        </Link>
      </div>
      {isOpen && (
        <TaskBuilderDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          editingTask={
            chosenTaskIndex !== -1 ? tasks[chosenTaskIndex] : createBlankTask()
          }
          mode={chosenTaskIndex !== -1 ? "edit" : "create"}
          onSubmit={handleCreateOrUpdateTask}
        />
      )}
      <div>
        <Image
          src="/supernova-globe.svg"
          width={30}
          height={30}
          alt="Supernova's icon"
          priority
        />
      </div>
      <div className="flex items-center gap-[10px]">
        <h4 className="text-[20px] font-semibold">Today</h4>
        <p className="text-slate-400 text-[16px]">{today}</p>
      </div>
      {taskFetchState.status === "loading" && (
        <div className="flex items-center gap-[10px]">
          <div className="w-[25px] h-[25px] relative">
            <Image
              src="/supernova-globe.svg"
              width={25}
              height={25}
              alt="Supernova's icon"
            />
          </div>
          <div className="text-slate-400 text-[16px]">Loading...</div>
        </div>
      )}
      <div className="flex flex-col items-center w-full max-h-full gap-2 overflow-clip">
        <hr className="w-64" />
        {tasks.length === 0 && (
          <div className="w-64">
            <p className="text-slate-400 text-[16px] text-center">
              No tasks yet. Press <Kbd>c</Kbd> to create a task, or go to the
              command center with <Kbd>Cmd+k</Kbd>
            </p>
          </div>
        )}
        {tasks.map((task, index) => (
          <SupernovaTaskComponent
            key={task.id}
            task={task}
            focused={
              chosenTaskIndex !== -1 && tasks[chosenTaskIndex].id === task.id
            }
            onClickCheck={handleCheckTask(task.id)}
            onClick={handleClickTask(index)}
          />
        ))}
      </div>
    </main>
  );
}
