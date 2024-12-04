// contexts/AuthContext.tsx

import { createContext } from "react";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType>({ user: null });
