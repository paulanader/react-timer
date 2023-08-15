/* eslint-disable prettier/prettier */

export type Cycle = {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  fineshedDate?: Date;
};

export interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}
