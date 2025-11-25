export interface UserResponseDTO {
  id: number;
  username: string;
  enabled: boolean;
  authorities: string[]; // Tu backend devuelve una lista de strings
}
