import { useState } from 'react';
import ManualButton from '../components/Button/ManualButton';
import ManualOverlay from '../components/ManualOverlay';
import ManualSideBar from '../components/ManualSideBar';

export const ManualLayout = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <ManualButton onClick={() => setIsOpen((prev) => !prev)} />
      {isOpen && <ManualOverlay setIsOpen={setIsOpen} />}
      <ManualSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default ManualLayout;
