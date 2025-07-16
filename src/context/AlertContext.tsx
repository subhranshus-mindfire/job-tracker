import React, { createContext, useState, useContext, useCallback } from 'react';

interface AlertState {
  message: string;
  visible: boolean;
  showAlert: (msg: string, type: string) => void;
  hideAlert: () => void;
  type: string
}

const AlertContext = createContext<AlertState | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('');


  const showAlert = useCallback((msg: string, type: string) => {
    setMessage(msg);
    setVisible(true);
    setType(type)
    setTimeout(() => setVisible(false), 3000);
  }, []);

  const hideAlert = () => setVisible(false);

  return (
    <AlertContext.Provider value={{ message, visible, showAlert, hideAlert, type }}>
      {children}
    </AlertContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};
