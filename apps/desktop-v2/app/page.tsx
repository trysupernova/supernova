"use client";

import { withAuth } from "@/hocs/withAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SupernovaTaskComponent, createBlankTask } from "./supernova-task";
import Mousetrap from "mousetrap";
import { TaskBuilderDialog } from "./task-builder-dialog";
import { ISupernovaTask } from "@supernova/types";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { settingsRoute } from "./settings/meta";
import Image from "next/image";
import { SupernovaCommandCenter } from "./command-center";
import { SupernovaCommand } from "../types/command";
import { AlertDialog } from "./alert-dialog";
import { useRouter } from "next/navigation";
import { Kbd } from "../components/kbd";
import { supernovaAPI } from "@/services/supernova-api";
import { useSupernovaToast } from "@/hooks/useSupernovaToast";
import { Toaster } from "sonner";

function Home() {
  // get today's date in this format: Tue, 26th Aug
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const router = useRouter();

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
  const { makeToast } = useSupernovaToast();

  const handleCheckTask = useCallback(
    (taskId: string) => async (value: boolean) => {
      const foundTask = tasks.find((task) => task.id === taskId);
      if (foundTask === undefined) {
        makeToast("Task not found", "error", {
          description: `This is something on our side. The task you were trying to mark done was not found.`,
        });
        return;
      }
      try {
        console.log("updating task in backend...");
        const res = await supernovaAPI.toggleCompleteTask(taskId);
        if (res.type === "error") {
          throw new Error(res.message);
        }
        if (value === true) {
          makeToast("Well done!", "success", {
            description: `Task "${foundTask.title}" marked as done.`,
            icon: "🎊",
          });
        }
        console.log("updated successfully");
        setRefetchTasks(true); // refetch the tasks
      } catch (e: any) {
        console.error(e);
        // TODO: show error toast
      }
    },
    [tasks]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      setTasks(tasks.filter((task) => task.id !== taskId));
      // delete task in backend
      try {
        console.log("deleting task in backend...");
        const res = await supernovaAPI.deleteTask(taskId);
        if (res.type === "error") {
          throw new Error(res.message);
        }
        console.log("deleted successfully");
        setRefetchTasks(true); // refetch the tasks
      } catch (e: any) {
        console.error(e);
        // TODO: show error toast
      }
    },
    [tasks]
  );

  const handleCreateOrUpdateTask = useCallback(
    async (task: ISupernovaTask) => {
      if (chosenTaskIndex !== -1) {
        // update task in backend
        try {
          console.log("updating task in backend...");
          const oldTask = tasks[chosenTaskIndex];
          // if a field is defined on oldTask but undefined on task, it means we're deleting it i.e setting to null
          const res = await supernovaAPI.updateTask({
            body: {
              title: task.title,
              originalBuildText: task.originalBuildText,
              description: task.description,
              startAt:
                oldTask.startTime !== undefined && task.startTime === undefined
                  ? null
                  : task.startTime?.toISOString(),
              expectedDurationSeconds:
                oldTask.expectedDurationSeconds !== undefined &&
                task.expectedDurationSeconds === undefined
                  ? null
                  : task.expectedDurationSeconds,
            },
            params: {
              id: task.id,
            },
          });
          if (res.type === "error") {
            throw new Error(res.message);
          }
          console.log("updated successfully");
          makeToast("Task updated successfully", "success");
          setRefetchTasks(true); // refetch the tasks
        } catch (e: any) {
          console.error(e);
        }
      } else {
        try {
          console.log("inserting task to backend...");
          await supernovaAPI.addTask({
            body: {
              title: task.title,
              originalBuildText: task.originalBuildText,
              description: task.description,
              startAt: task.startTime?.toISOString(),
              expectedDurationSeconds: task.expectedDurationSeconds,
            },
          });
          console.log("inserted successfully");
          makeToast("Task created successfully", "success");
          setRefetchTasks(true); // refetch the tasks
        } catch (e: any) {
          console.error(e);
          // TODO: show error toast
        }
      }
    },
    [chosenTaskIndex, tasks]
  );

  const commands: SupernovaCommand[] = useMemo(
    () => [
      {
        label: "Create a task",
        shortcut: ["c", "ctrl+space"],
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
    if (chosenTaskIndex !== -1) {
      handleDeleteTask(tasks[chosenTaskIndex].id);
    }
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

  // fetch the task in the beginning
  useEffect(() => {
    // save to db
    (async () => {
      try {
        const res = await supernovaAPI.getTasks();
        if (res.type === "error") {
          setTaskFetchState({ status: "error", error: res.message });
        } else {
          setTasks(res.data);
          setTaskFetchState({ status: "success" });
        }
      } catch (e: any) {
        setTaskFetchState({ status: "error", error: e.message });
      }
    })();
  }, []);

  // refetch the tasks whenever there's a task update
  useEffect(() => {
    if (!refetchTasks) {
      return;
    }
    (async () => {
      try {
        console.log("refetching tasks...");
        const res = await supernovaAPI.getTasks();
        if (res.type === "error") {
          throw new Error(res.message);
        }
        console.log("refetched successfully");
        setTasks(res.data);
        setTaskFetchState({ status: "success" });
        setRefetchTasks(false);
      } catch (e: any) {
        console.error(e);
      }
    })();
  }, [refetchTasks]);

  const handleClickTask = (taskIndex: number) => () => {
    // select task
    setChosenTaskIndex(taskIndex);
    setIsOpen(true);
  };

  return (
    <main className="flex max-h-screen flex-col items-center pt-5 mb-10 px-5 gap-[10px]">
      <Toaster richColors position="top-center" />
      {showAreYouSureDialog && (
        <AlertDialog
          description={
            <p>
              Are you sure? Task
              <span className="px-1 font-bold text-red-600">
                {chosenTaskIndex !== -1 && tasks[chosenTaskIndex].title}
              </span>
              will be deleted
            </p>
          }
          open={showAreYouSureDialog}
          setOpen={setShowAreYouSureDialog}
          handleSubmit={handleSubmitAreYouSure}
        />
      )}
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
      {taskFetchState.status === "loading" ? (
        <div className="flex items-center gap-[10px]">
          <div className="text-slate-400 text-[16px]">Loading...</div>
        </div>
      ) : taskFetchState.status === "success" ? (
        <div className="flex flex-col items-center w-full max-h-full gap-2 overflow-clip max-w-3xl">
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
      ) : (
        <div className="flex items-center gap-[10px]">
          <div className="text-red-600 text-[16px]">{taskFetchState.error}</div>
        </div>
      )}
    </main>
  );
}

export default withAuth(Home);
