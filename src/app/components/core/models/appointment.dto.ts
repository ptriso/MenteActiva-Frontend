
export interface AppointmentResponseDTO {
  id: number;
  clientId: number;
  statusId: number;
  scheduleId: number;

  client?: any;
  status?: any;
  schedule?: any;
}

export interface AppointmentRequestDTO {
  clientId: number;
  statusId: number;
  scheduleId: number;
}


