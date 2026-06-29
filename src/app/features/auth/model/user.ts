export interface User {
  email: string;
  password: string;
  lastSignedInAt?: string;
  data?: {
    name: string;
    jobTitle?: string;
    department?: string;
  };
}
