import type { Dispatch, SetStateAction } from 'react';

interface ManualOverLayProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const ManualOverlay = ({ setIsOpen }: ManualOverLayProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      onClick={() => setIsOpen((prev) => !prev)}
    ></div>
  );
};

export default ManualOverlay;
