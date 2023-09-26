import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Mousetrap from "mousetrap";
import { ISupernovaTask } from "@supernova/types";
import { settingsRoute } from "../app/settings/meta";
import { SupernovaCommand } from "../types/command";
import { useRouter } from "next/navigation";
import { supernovaAPI } from "@/services/supernova-api";
import useSupernovaToast from "@/hooks/useSupernovaToast";
import { useAtom } from "jotai";
import { chosenTaskIndexGlobal } from "@/store/ui";
import useOutsideClick from "@/hooks/useOutsideClick";
import { reorderTaskList } from "@/utils/supernova-task";

export default function useSupernovaTasksUI() {
  const router = useRouter();
  const [chosenTaskIndex, setChosenTaskIndex] = useAtom(chosenTaskIndexGlobal);
  const [tasks, setTasks] = useState<ISupernovaTask[]>([]);
  const [taskFetchState, setTaskFetchState] = useState<{
    status: "loading" | "error" | "success";
    error?: string;
  }>({ status: "loading" });
  const [showAreYouSureDialog, setShowAreYouSureDialog] =
    useState<boolean>(false);
  const { makeToast } = useSupernovaToast();
  // to optimize rerenders when we refetch this task list in the API
  // (will not rerender if there's no inconsistency b/w backend and frontend states but will rerender otherwise)
  const memoizedTasksView = useMemo(() => tasks, [tasks]);
  const taskListRef = useRef<HTMLDivElement>(null);

  const [taskBuilderIsOpen, setTaskBuilderIsOpen] = useState<boolean>(false);
  const [refetchTasks, setRefetchTasks] = useState<boolean>(false); // refetch the tasks from the backend for consistency and sorting
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );
  const doneAccordionOpened = accordionValue === "supernova-dones";

  const undoneTasks = memoizedTasksView.filter((task) => !task.isComplete);
  const doneTasks = memoizedTasksView.filter((task) => task.isComplete);

  const anyModalOpen = useMemo(() => {
    return taskBuilderIsOpen || showAreYouSureDialog;
  }, [showAreYouSureDialog, taskBuilderIsOpen]);

  const handleCheckTask = useCallback(
    (taskId: string) => async (value: boolean) => {
      const foundTask = tasks.find((task) => task.id === taskId);
      if (foundTask === undefined) {
        makeToast("Task not found", "error", {
          description: `This is something on our side. The task you were trying to mark done was not found.`,
        });
        return;
      }
      // optimistic update
      // reorder the tasks as well on the frontend
      setTasks(
        reorderTaskList(
          tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                isComplete: value,
              };
            }
            return task;
          })
        )
      );
      // update task in backend
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
      } catch (e) {
        // TODO: show error toast
        makeToast("Something went wrong", "error", {
          description: `This is something on our side.`,
        });
      } finally {
        setRefetchTasks(true); // refetch the tasks
      }
    },
    [makeToast, tasks]
  );

  const handleClickTask = (taskIndex: number) => () => {
    // select task
    setChosenTaskIndex(taskIndex);
    setTaskBuilderIsOpen(true);
  };

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      // optimistic update
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
        makeToast("Something went wrong", "error", {
          description: `This is something on our side.`,
        });
      }
    },
    [makeToast, tasks]
  );

  const handleCreateOrUpdateTask = useCallback(
    async (newTask: ISupernovaTask) => {
      if (chosenTaskIndex !== -1) {
        const chosenTask = tasks[chosenTaskIndex];
        const updatePayload = {
          title: newTask.title,
          originalBuildText: newTask.originalBuildText,
          description: newTask.description,
          startAt:
            chosenTask.startTime !== undefined &&
            newTask.startTime === undefined
              ? null
              : newTask.startTime?.toISOString(),
          expectedDurationSeconds:
            chosenTask.expectedDurationSeconds !== undefined &&
            newTask.expectedDurationSeconds === undefined
              ? null
              : newTask.expectedDurationSeconds,
        };
        // optimistically update the task in the frontend
        setTasks(
          reorderTaskList(
            tasks.map((task) => {
              if (task.id === chosenTask.id) {
                return {
                  ...task,
                  title: newTask.title,
                  originalBuildText: newTask.originalBuildText,
                  description: newTask.description,
                  startTime:
                    updatePayload.startAt === null
                      ? undefined
                      : updatePayload.startAt === undefined
                      ? chosenTask.startTime
                      : newTask.startTime, // if it's null, then cleared, else if undefined then don't update
                  expectedDurationSeconds:
                    updatePayload.expectedDurationSeconds === null
                      ? undefined
                      : updatePayload.expectedDurationSeconds === undefined
                      ? chosenTask.expectedDurationSeconds
                      : newTask.expectedDurationSeconds, // if it's null, then cleared, else if undefined then don't update
                };
              }
              return task;
            })
          )
        );
        makeToast("Task updated successfully", "success");

        // update task in backend
        try {
          console.log("updating task in backend...");

          // if a field is defined on oldTask but undefined on task, it means we're deleting it i.e setting to null
          const res = await supernovaAPI.updateTask({
            body: updatePayload,
            params: {
              id: newTask.id,
            },
          });
          if (res.type === "error") {
            throw new Error(res.message);
          }
          console.log("updated successfully");
          setRefetchTasks(true); // refetch the tasks
        } catch (e: any) {
          console.error(e);
        }
      } else {
        // optimistic update
        // reorder the tasks as well on the frontend
        setTasks(reorderTaskList([...tasks, newTask]));
        makeToast("Task created successfully", "success");
        try {
          console.log("inserting task to backend...");
          await supernovaAPI.addTask({
            body: {
              title: newTask.title,
              originalBuildText: newTask.originalBuildText,
              description: newTask.description,
              startAt: newTask.startTime?.toISOString(),
              expectedDurationSeconds: newTask.expectedDurationSeconds,
            },
          });
          console.log("inserted successfully");
          setRefetchTasks(true); // refetch the tasks
        } catch (e: any) {
          console.error(e);
          // TODO: show error toast
        }
      }
    },
    [chosenTaskIndex, makeToast, tasks]
  );

  const openTaskBuilder = useCallback(
    (e?: Mousetrap.ExtendedKeyboardEvent) => {
      e?.preventDefault(); // prevent typing into the task builder
      setTaskBuilderIsOpen(true);
      // deselect task
      setChosenTaskIndex(-1);
    },
    [setChosenTaskIndex]
  );

  const commands: SupernovaCommand[] = useMemo(
    () => [
      {
        label: "Create a task",
        shortcut: ["c"],
        cb: openTaskBuilder,
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
          // if the alert dialog is open, then don't open another one
          if (anyModalOpen) {
            return;
          }

          e?.preventDefault(); // prevent typing into the task builder

          if (chosenTaskIndex !== -1) {
            setTaskBuilderIsOpen(true);
          }
        },
      },
      {
        label: "Mark done/undone",
        shortcut: ["d", "e"],
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
        shortcut: "Cmd+,",
        cb: () => {
          router.push(settingsRoute);
        },
      },
    ],
    [
      openTaskBuilder,
      chosenTaskIndex,
      anyModalOpen,
      handleCheckTask,
      tasks,
      router,
    ]
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
      // if modal isn't opened and it's at the last undone task,
      // then don't go down more (will go into the done tasks)
      if (chosenTaskIndex === undoneTasks.length - 1 && !doneAccordionOpened) {
        return;
      }
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
      // if any modal is open, then don't unselect
      const modalOpen = taskBuilderIsOpen || showAreYouSureDialog;
      if (modalOpen) {
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
    doneAccordionOpened,
    handleCheckTask,
    handleDeleteTask,
    setChosenTaskIndex,
    showAreYouSureDialog,
    taskBuilderIsOpen,
    tasks,
    undoneTasks.length,
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

  // if the user press outside of the task list (i.e the task builder), then unselect the task
  // only unselect if no modal is open since we don't want to unselect when the user clicks into any modal
  useOutsideClick(taskListRef, () => {
    if (anyModalOpen) {
      return;
    }
    setChosenTaskIndex(-1);
  });

  return {
    tasks,
    setTasks,
    taskFetchState,
    chosenTaskIndex,
    openTaskBuilder,
    handleCheckTask,
    handleClickTask,
    handleDeleteTask,
    handleCreateOrUpdateTask,
    taskBuilderIsOpen,
    setTaskBuilderIsOpen,
    commands,
    showAreYouSureDialog,
    setShowAreYouSureDialog,
    handleSubmitAreYouSure,
    taskListRef,
    memoizedTasksView,
    accordionValue,
    setAccordionValue,
    doneAccordionOpened,
    undoneTasks,
    doneTasks,
  };
}
