import { ManualColumn } from "./ManualColumn";

interface Props {
  showManual: boolean;
  closeManual: () => void;
}

export const ManualOverlay = ({ showManual, closeManual }: Props) => {
  return (
    <div
      className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
        ${showManual ? "" : "hidden"}
      `}
      onClick={closeManual}
    >
      <ManualColumn showManual={showManual} closeManual={closeManual} />
    </div>
  );
};
