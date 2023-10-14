import { FetchState } from "@/types/fetching";
import { ISupernovaTask } from "@supernova/types";
import { atom } from "jotai";

export const chosenTaskIndexGlobal = atom(-1);
export const tasksGlobal = atom<ISupernovaTask[]>([]);
export const taskFetchStateGlobal = atom<FetchState>({ status: "loading" });
export const viewingDateGlobal = atom<Date>(new Date());
