export interface IBonusPointsResult {
  totalPoints: number;
  details: string[];
  breakdown: {
    base: number;
    specialDay: any;
    combo: any;
    quantity: any;
  };
}
