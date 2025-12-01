// src/app/core/models/video.dto.ts
export interface VideoResponseDTO {
  id: number;
  title: string;
  description: string;
  url: string;
  duration: number;
  professionalId: number;
}
  // (Podemos añadir más campos si los necesitas)

  export interface VideoRequestDTO {
  title: string;
  description: string;
  url: string;
  duration: number;
  professionalId: number;
}
