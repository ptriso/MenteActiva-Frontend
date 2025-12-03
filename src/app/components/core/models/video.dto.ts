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

export interface MostViewedVideoDTO {
  videoId: number;
  videoTitle: string;
  totalViews: number;
  authorName: string;
  authorLastname: string;
  authorId: number;
}
