import { createContext } from "react";
import type { User } from "./types";

type AppContextType = {
    me: User | null | undefined;
    setMe: React.Dispatch<React.SetStateAction<User | null | undefined>>;
};

export const AppContext = createContext<AppContextType | null>(null);