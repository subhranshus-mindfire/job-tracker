import React from 'react';
import { useAlert } from '../context/AlertContext';

const Alert: React.FC = () => {
  const { message, visible, type } = useAlert();

  if (!visible) return null;

  return (
    <div className={`fixed top-5 px-3 py-2 right-5 z-[99] text-xs lg:px-6 lg:py-3 text-white md:text-base rounded ${type == "success" ? "bg-green-600" : "bg-red-600"}  shadow-md animate-slideDown`}>
      {message}
    </div>
  );
};

export default Alert;
