import { createContext, useState, useContext } from 'react';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay.jsx';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
            {isLoading && <LoadingOverlay />}
        </LoadingContext.Provider>
    );
}

export const useLoading = () => useContext(LoadingContext);