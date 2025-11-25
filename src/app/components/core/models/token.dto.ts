export interface TokenDTO {
  jwtToken: string;
  id: number;
  username: string;
  authorities: string; // "ROLE_USER;ROLE_ADMIN" [cite: 252]
  profileId: number;
}
