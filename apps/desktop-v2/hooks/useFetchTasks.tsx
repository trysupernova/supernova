import { supernovaAPI } from "@/services/supernova-api";
import { FetchState } from "@/types/fetching";
import { ISupernovaTask } from "@supernova/types";
import { useEffect, useState } from "react";

export default function useFetchTasks() {
  const [tasks, setTasks] = useState<ISupernovaTask[]>([]);
  const [taskFetchState, setTaskFetchState] = useState<FetchState>({
    status: "loading",
  });
  const [refetchTasks, setRefetchTasks] = useState<boolean>(false); // refetch the tasks from the backend for consistency and sorting

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
      } catch (e) {
        if (e instanceof Error) {
          setTaskFetchState({ status: "error", error: e.message });
        }
      }
    })();
  }, []);

  // refetch the tasks whenever there's a signal
  useEffect(() => {
    if (!refetchTasks) {
      return;
    }
    (async () => {
      try {
        console.debug("refetching tasks...");
        const res = await supernovaAPI.getTasks();
        if (res.type === "error") {
          throw new Error(res.message);
        }
        console.debug("refetched successfully");
        setTasks(res.data);
        setTaskFetchState({ status: "success" });
        setRefetchTasks(false);
      } catch (e: any) {
        console.error(e);
        // TODO: handle error with something more meaningful to the client
      }
    })();
  }, [refetchTasks]);

  return {
    tasks,
    setTasks,
    taskFetchState,
    setTaskFetchState,
    refetchTasks,
    triggerRefetchTasks: () => setRefetchTasks(true),
  };
}
