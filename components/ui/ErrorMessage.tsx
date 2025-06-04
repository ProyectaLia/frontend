import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import React from "react";

interface ErrorMessageProps {
  title?: string;
  description: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title = "Error", description, className }) => (
  <Alert variant="destructive" className={className}>
    <AlertCircle className="h-5 w-5 text-red-500" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
  </Alert>
);

export default ErrorMessage; 