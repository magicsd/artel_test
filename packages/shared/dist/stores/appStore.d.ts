interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}
interface AppState {
    user: User | null;
    isAuthenticated: boolean;
    sidebarOpen: boolean;
    setUser: (user: User | null) => void;
    login: (user: User) => void;
    logout: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}
export declare const useAppStore: import('zustand').UseBoundStore<Omit<import('zustand').StoreApi<AppState>, "setState" | "persist"> & {
    setState(partial: AppState | Partial<AppState> | ((state: AppState) => AppState | Partial<AppState>), replace?: false | undefined): unknown;
    setState(state: AppState | ((state: AppState) => AppState), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import('zustand/middleware').PersistOptions<AppState, {
            user: User | null;
            isAuthenticated: boolean;
        }, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AppState) => void) => () => void;
        onFinishHydration: (fn: (state: AppState) => void) => () => void;
        getOptions: () => Partial<import('zustand/middleware').PersistOptions<AppState, {
            user: User | null;
            isAuthenticated: boolean;
        }, unknown>>;
    };
}>;
export {};
//# sourceMappingURL=appStore.d.ts.map