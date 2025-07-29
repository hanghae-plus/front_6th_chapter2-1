export const ManualOverlay = () => {
  const manualOverlay = document.createElement("div");
  manualOverlay.className = "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";

  return manualOverlay;
};

export default ManualOverlay;
