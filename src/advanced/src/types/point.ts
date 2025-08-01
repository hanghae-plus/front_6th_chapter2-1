export interface PointDetail {
  reason: string;
  amount: number;
}

export interface PointState {
  point: number;
  details: PointDetail[];
}
