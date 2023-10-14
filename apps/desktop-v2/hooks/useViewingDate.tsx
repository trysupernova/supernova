import { viewingDateGlobal } from "@/store/ui";
import { useAtom } from "jotai";

export default function useViewingDateUI() {
  const [viewingDate, setViewingDate] = useAtom(viewingDateGlobal);
  return {
    viewingDate,
    setViewingDate,
  };
}
