"use client"



import axios from 'axios';
import { useAppointments } from '../../context/AppointmentsContext';
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';

import { formatDateTime } from '@/lib/utils';
import { sendSMSNotification } from '@/lib/actions/appointment.actions';

interface UpdateAppointmentParams {
  appointmentId: string;
  phone: string;
  userId: string;
  timeZone: string;
  appointment: any; // Define a specific type if available
  type: 'schedule' | 'cancel';
}

export const UpdateAppointment = async ({
  appointmentId,
  phone,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  const { setAppointments } = useAppointments();

  try {
    const smsMessage = `Greetings from CarePulse. ${
      type === "schedule"
        ? `Your appointment is confirmed for ${formatDateTime(
            appointment.schedule!,
            timeZone
          ).dateTime} with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform that your appointment for ${formatDateTime(
            appointment.schedule!,
            timeZone
          ).dateTime} is cancelled. Reason: ${appointment.cancellationReason}`
    }`;

    // Update appointment in the backend
    const res = await axios.patch(
      `/api/appointment/UpdateAppointment/${appointmentId}`,
      appointment
    );

    // Send SMS notification
    await sendSMSNotification(phone, smsMessage);

    // Fetch the updated list of appointments
    const updatedAppointments = await getRecentAppointmentList();
    setAppointments(updatedAppointments);

    return {
      updatedAppointment: res.data,
      ...updatedAppointments,
    };
  } catch (error) {
    console.error("An error occurred while updating an appointment:", error);
    throw new Error("Failed to update appointment");
  }

  return (<></>)
};
