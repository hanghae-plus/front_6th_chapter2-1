import { ManualColumn } from "./ManualColumn";

export const ManualOverlay = ({ showManual, closeManual }) => {
  return (
    <div
      className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
        ${showManual ? "" : "hidden"}
      `}
      onClick={closeManual}
    >
      <ManualColumn showManual={showManual} />
    </div>
  );
};
