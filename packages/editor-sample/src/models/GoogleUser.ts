export interface GoogleUser {
  uid: string; 
  displayName: string | null; 
  email: string | null; 
  emailVerified: boolean;
  phoneNumber: string | null; 
  photoURL: string | null; 
  providerId: string;
  creationTime: string | null; 
  lastSignInTime: string | null; 
}
