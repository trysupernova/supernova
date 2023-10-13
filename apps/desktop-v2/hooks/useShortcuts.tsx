import { SupernovaCommand } from "@/types/command";
import Mousetrap from "mousetrap";
import { useEffect } from "react";

export default function useShortcuts(
  keymaps: (Omit<SupernovaCommand, "label"> & { label?: string })[]
) {
  useEffect(() => {
    for (const key of keymaps) {
      Mousetrap.bind(key.shortcut, key.cb);
    }

    return () => {
      for (const key of keymaps) {
        Mousetrap.unbind(key.shortcut);
      }
    };
  }, [keymaps]);
}
