import { useState } from 'react';

export function useShowHelp() {
  const [showHelp, setShowHelp] = useState(false);

  const handleShowHelp = () => {
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
  };

  return { showHelp, handleShowHelp, handleCloseHelp };
}
