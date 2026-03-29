import React, { createContext, useContext, useState } from "react";
import { Loader2 } from "lucide-react";

interface LoadingContextType {
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ setIsLoading }}>
      {children}

      {/* Overlay Global */}
      {isLoading && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute w-20 h-20 border-4 border-blue-100 rounded-full"></div>
            {/* Spinning Loader */}
            <Loader2
              className="w-10 h-10 text-blue-600 animate-spin"
              strokeWidth={2.5}
            />
          </div>
          <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">
            Mohon Tunggu Sebentar
          </p>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context)
    throw new Error("useLoading must be used within LoadingProvider");
  return context;
};
