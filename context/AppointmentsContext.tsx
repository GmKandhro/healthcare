"use client"

// AppointmentsContext.tsx

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Define the structure of an appointment document
interface Appointment {
  id: string;
  status: 'scheduled' | 'pending' | 'cancelled';
  // Add other fields as needed, for example:
  // date: string;
  // physician: string;
}

// Define the structure of the context state
interface AppointmentsState {
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  documents: Appointment[];
}

// Define the context value types, including functions to update the state
interface AppointmentsContextType {
  appointments: AppointmentsState;
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentsState>>;
}

// Initialize the context with a default value of `undefined`
const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

// Define the AppointmentsProvider component props type
interface AppointmentsProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AppointmentsProvider: React.FC<AppointmentsProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<AppointmentsState>({
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    documents: [],
  });

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        setAppointments,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

// Custom hook to use the Appointments context
export const useAppointments = (): AppointmentsContextType => {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentsProvider");
  }
  return context;
};
