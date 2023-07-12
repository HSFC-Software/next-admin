import { IWorker } from "@/lib/bit";

export type Actions = {
  handleAddNewConsolidatorFromVip: (
    vipId: string,
    consolidatorQ: string
  ) => void;
};

const Worker: IWorker<Actions> = ({ useActions, setState }) => {
  return useActions({
    handleAddNewConsolidatorFromVip(id: string, q: string) {
      setState("consolidation.vip.selectedId", id);
      setState("consolidation.vip.consolidatorQ", q);
    },
  });
};

export default Worker;
