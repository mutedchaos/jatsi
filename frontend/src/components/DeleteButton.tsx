import React from 'react'

export const DeleteButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({className, ...otherProps}) => (
  <button
    {...otherProps}
    className={`
      p-2 rounded
      hover:bg-red-400
      active:bg-red-600
      disabled:bg-gray-300
      ${className}`}
  />
)
