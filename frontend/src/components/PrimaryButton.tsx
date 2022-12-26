import React from 'react'

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({className, ...otherProps}) => (
  <button
    {...otherProps}
    className={`
      bg-green-500
      p-2 rounded
      text-white
      hover:bg-green-400
      active:bg-green-600
      disabled:bg-gray-300
      ${className}`}
  />
)
