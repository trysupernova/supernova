import Mousetrap from "mousetrap";

export interface SupernovaCommand {
  label: string;
  shortcut: string | string[];
  cb: (e?: Mousetrap.ExtendedKeyboardEvent) => void;
}

export enum AllAppCommandsEnum {
  CREATE_TASK = "CREATE_TASK",
  EDIT_TASK = "EDIT_TASK",
  DELETE_TASK = "DELETE_TASK",
  GO_DOWN_TASK_LIST = "GO_DOWN_TASK_LIST",
  GO_UP_TASK_LIST = "GO_UP_TASK_LIST",
  UNSELECT_TASK = "UNSELECT_TASK",
  TOGGLE_DONE_TASK = "TOGGLE_DONE_TASK",
  GO_TO_PREVIOUS_DAY = "GO_TO_PREVIOUS_DAY",
  GO_TO_NEXT_DAY = "GO_TO_NEXT_DAY",
  JUMP_TO_TODAY = "JUMP_TO_TODAY",
  NAVIGATE_TO_INBOX_PAGE = "NAVIGATE_TO_INBOX_PAGE",
  NAVIGATE_TO_SETTINGS_PAGE = "NAVIAGTE_TO_SETTINGS_PAGE",
  NAVIGATE_TO_TODAY_PAGE = "NAVIGATE_TO_TODAY_PAGE",
}
