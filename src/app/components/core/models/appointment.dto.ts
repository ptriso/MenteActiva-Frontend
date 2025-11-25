
export interface AppointmentResponseDTO {
  id: number;
  clientId: number;
  statusId: number;
  scheduleId: number;

  // Campos opcionales por si en algún momento vuelves a enviar los objetos completos
  client?: any;
  status?: any;
  schedule?: any;
}

// (Esto ya lo tenías)
export interface AppointmentRequestDTO {
  clientId: number;
  statusId: number;
  scheduleId: number;
}


