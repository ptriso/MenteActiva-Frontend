export interface ClientResponseDTO {
  id: number;
  name: string;
  lastname: string;
  mail: string;
  phone: string;
  userId: number;
  age: number | null;
  hasConsent: boolean;
  consentAge: number | null;
  consentDocument: string | null;
}
