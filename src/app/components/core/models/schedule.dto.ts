
export interface ScheduleResponseDTO {
  id: number;
  date: string; // "YYYY-MM-DD"
  time_start: string; // "HH:MM:SS"
  time_ends: string; // "HH:MM:SS"
  profesional_id: number;
  dateObject?: Date;
  isOccupied?: boolean;
}


export interface ScheduleRequestDTO {
  date: string; // "YYYY-MM-DD"
  time_start: string; // "HH:MM:SS"
  time_ends: string; // "HH:MM:SS"
  profesional_id: number;
}
