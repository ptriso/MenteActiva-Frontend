
export interface ScheduleResponseDTO {
  id: number;
  date: string;
  time_start: string;
  time_ends: string;
  profesionalId: number;
  dateObject?: Date;
  isOccupied?: boolean;
  isPast?: boolean;
}


export interface ScheduleRequestDTO {
  date: string;
  time_start: string;
  time_ends: string;
  profesionalId: number;
}
