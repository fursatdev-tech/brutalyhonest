"use client";
import { Dispatch, createContext, SetStateAction, useState } from "react";

export interface AppContextData {
    isHost?: boolean;
    view: HomeView;
}

interface AppDataProps {
    data: AppContextData;
    setData: Dispatch<SetStateAction<AppContextData>>;
}

export enum HomeView {
    Tours = "tours",
}

export const AppContext = createContext<AppDataProps>({} as AppDataProps);

interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [data, setData] = useState<AppContextData>({
        isHost: false,
        view: HomeView.Tours,
    });

    return (
        <AppContext.Provider value={{ data, setData }}>
            {children}
        </AppContext.Provider>
    );
};
