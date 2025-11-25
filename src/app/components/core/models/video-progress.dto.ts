export interface VideoProgressDTO {
  id: number;
  videoTitle: string;      // Título del video
  professionalName: string; // Quién lo hizo
  duration: string;        // Duración
  percentage: number;      // % de avance
  lastViewed: string;      // Fecha
  // Campos técnicos
  videoId?: number;
  clientId?: number;

}
