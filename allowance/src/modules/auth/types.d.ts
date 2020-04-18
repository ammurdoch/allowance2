export type AuthContextType = {
  signIn: () => Promise<void>;
  signOut: () => void;
  signUp: () => Promise<void>;
  state: {
    isLoading: boolean;
    isSignout: boolean;
    userToken: string | null,
  };
}