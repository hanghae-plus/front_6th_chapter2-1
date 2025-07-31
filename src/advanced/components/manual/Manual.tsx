import { useState } from "react";
import { ManualToggle } from "./ManualToggle";
import { ManualOverlay } from "./ManualOverlay";

const useManual = () => {
  const [showManual, setShowManual] = useState(false);
  const closeManual = () => setShowManual(false);
  const toggleManual = () => setShowManual(!showManual);

  return [showManual, closeManual, toggleManual] as const;
};

export const Manual = () => {
  const [showManual, closeManual, toggleManual] = useManual();

  return (
    <>
      {!showManual && <ManualToggle onClick={toggleManual} />}
      <ManualOverlay showManual={showManual} closeManual={closeManual} />
    </>
  );
};
