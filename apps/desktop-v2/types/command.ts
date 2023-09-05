import Mousetrap from "mousetrap";

export interface SupernovaCommand {
  label: string;
  shortcut: string | string[];
  cb: (e?: Mousetrap.ExtendedKeyboardEvent) => void;
}
