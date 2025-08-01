import { useState } from 'react';
import { PointState } from '../types/point';

const initialState: PointState = {
  point: 0,
  details: [],
};

export const usePointState = () => {
  const [pointState, setPointState] = useState<PointState>(initialState);

  return {
    pointState,
    setPointState,
  };
};
