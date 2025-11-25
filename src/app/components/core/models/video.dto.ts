// src/app/core/models/video.dto.ts
export interface VideoResponseDTO {
  id: number;
  title: string;
  descripcion: string;
  url: string;
  duration: string;
  professional_id: number;
}
  // (Podemos añadir más campos si los necesitas)

  export interface VideoRequestDTO {
  title: string;
  descripcion: string;
  url: string;
  duration: string;
  professional_id: number;
}
