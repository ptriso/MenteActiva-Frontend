export interface VideoProgressRequestDTO {
  clientId: number;
  videoId: number;
  percentage: number;
  current_time?: number;
  completed?: boolean;
  views_count?: number;
}

export interface VideoProgressDTO {
  id: number;
  clientId: number;
  videoId: number;
  percentage: number;
  current_time: number;
  completed: boolean;
  views_count: number;
  videoTitle: string;
  professionalName: string;
  duration: string;
}
