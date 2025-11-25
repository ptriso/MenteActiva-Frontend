export interface RegisterUserDTO {
  username: string;
  password: string;
  authorities?: string; // Es opcional
}
