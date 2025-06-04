import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className }) => (
  <div className={`flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-md ${className || ""}`}>
    {icon && <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">{icon}</div>}
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    {description && <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;

export {}; 