import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingMessageProps {
  message?: string;
  className?: string;
}

export const LoadingMessage: React.FC<LoadingMessageProps> = ({ message = "Cargando...", className }) => (
  <div className={`flex flex-col items-center justify-center py-8 ${className || ""}`}>
    <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-2" />
    <span className="text-lg text-gray-600">{message}</span>
  </div>
);

export default LoadingMessage; 