import { create } from 'zustand';
import type { PointsState, PointsDetail } from '../types';

interface PointsStore extends PointsState {
  // Actions
  updateTotalPoints: (points: number) => void;
  updateBasePoints: (points: number) => void;
  updateBonusPoints: (points: number) => void;
  updatePointsDetail: (detail: PointsDetail[]) => void;
  reset: () => void;
}

const initialState: PointsState = {
  totalPoints: 0,
  basePoints: 0,
  bonusPoints: 0,
  pointsDetail: [],
};

export const usePointsStore = create<PointsStore>((set) => ({
  ...initialState,

  updateTotalPoints: (points) => {
    set({ totalPoints: points });
  },

  updateBasePoints: (points) => {
    set({ basePoints: points });
  },

  updateBonusPoints: (points) => {
    set({ bonusPoints: points });
  },

  updatePointsDetail: (detail) => {
    set({ pointsDetail: detail });
  },

  reset: () => {
    set(initialState);
  },
}));
