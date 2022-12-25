import React from "react";

export const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, ...otherProps }) => (
  <button
    {...otherProps}
    className={`bg-blue-500 p-2 rounded text-white hover:bg-blue-400 active:bg-blue-600 ${className}`}
  />
);
