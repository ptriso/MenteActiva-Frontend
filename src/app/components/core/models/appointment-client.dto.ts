export interface AppointmentClientDTO {
  id: number;
  professionalName: string;
  professionalLastname: string;
  date: string;       // "2025-11-10"
  timeStart: string;  // "11:00:00"
  timeEnds: string;   // "12:00:00"
  status: string;     // "PROGRAMADA", "COMPLETADA", etc.
}
