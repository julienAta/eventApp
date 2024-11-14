// hooks/useAuth.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-service";

interface AuthState {
  email: string;
  password: string;
  name: string;
  error: string;
  isLoading: boolean;
}

interface UseAuthReturn {
  state: AuthState;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setName: (value: string) => void;
  resetError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    email: "",
    password: "",
    name: "",
    error: "",
    isLoading: false,
  });

  const updateState = (updates: Partial<AuthState>) => {
    setState((current) => ({ ...current, ...updates }));
  };

  const resetError = () => updateState({ error: "" });
  const setEmail = (email: string) => updateState({ email });
  const setPassword = (password: string) => updateState({ password });
  const setName = (name: string) => updateState({ name });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();
    updateState({ isLoading: true });

    try {
      await signIn(state.email, state.password);
      router.push("/");
    } catch (err) {
      updateState({
        error: "Failed to sign in. Please check your credentials.",
      });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();
    updateState({ isLoading: true });

    try {
      await signUp(state.name, state.email, state.password);
      await signIn(state.email, state.password);
      router.push("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message || "Failed to sign up. Please try again."
          : "Failed to sign up. Please try again.";
      updateState({ error: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  };

  return {
    state,
    handleSignIn,
    handleSignUp,
    setEmail,
    setPassword,
    setName,
    resetError,
  };
};
