export interface FirebaseUser {
  id: string; // document ID
  createdAt: Date; // Firestore timestamp converted to JS Date
  email: string;
  firstName: string;
  lastName: string;
  isOnboarded: boolean;
}
