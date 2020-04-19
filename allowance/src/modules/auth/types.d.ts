import { User } from 'firebase';

export type SignInValues = {
  email: string;
  password: string;
};

export type SignUpValues = {
  email: string;
  password: string;
};

export type AuthState = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: User | null;
};

export type AuthContextType = {
  signIn: (values: SignInValues) => Promise<string>;
  signOut: () => void;
  signUp: (values: SignUpValues) => Promise<string>;
  state: AuthState;
};
