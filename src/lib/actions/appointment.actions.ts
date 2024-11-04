"use client";




import { formatDateTime, parseStringify } from "../utils";
import axios from "axios";

//  CREATE APPOINTMENT
export const createAppointment :any = async (
  appointment: CreateAppointmentParams
) => {

  try {
    // console.log("Appointmenttttt data11 ",appointment)
    const response = await axios.post('/api/appointment/createAppointment', appointment);
    
    return response.data;
   
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};




// GET    APPOINTEMNT
export  const getAppointment = async (appointmentId: string) => {
  try {

    console.log("id geeeeted ", appointmentId)
   
    const appointment = await axios.get(`/api/appointment/getAppointment/${appointmentId}`);

    return appointment.data.data;
  } catch (error) {
    console.error(
      "An error occurred while retrieving the appointment:",
      error
    );
  }
};



//  SEND SMS NOTIFICATION
export const sendSMSNotification = async (phone: string, content: string) => {
  try {
    const response = await axios.post('/api/twilio', {
      to: "+"+phone,
      body:content
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  
    return response.data
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};










export const updateAppointment = async ({
  appointmentId,
  phone,
  userId, 
  // @ts-ignore
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
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
    }.`;

    // Update appointment in the backend
    const res = await axios.patch(
      `/api/appointment/updateAppointment/${appointmentId}`,
      appointment
    );

    // Send SMS notification
    await sendSMSNotification(phone, smsMessage);

    // Get updated list of appointments and counts
    const updatedAppointments = await getRecentAppointmentList();
    return {
      updatedAppointment: res.data,
      ...updatedAppointments,
    };
  } catch (error) {
    console.error("An error occurred while updating an appointment:", error);
    throw new Error("Failed to update appointment");
  }
};

// GET All appointments
export const getRecentAppointmentList = async () => {
  try {
    const response = await axios.get(`/api/appointment/getAllAppointments`);
    const appointments = response.data;

    // Initial counts for the different statuses
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    // Count appointments by status
    const counts = appointments.reduce(
      (acc: any, appointment: any) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    return {
      totalCount: appointments.length,
      ...counts,
      documents: appointments,
    };
  } catch (error) {
    console.error("An error occurred while retrieving the appointments:", error);
    throw new Error("Failed to fetch recent appointments");
  }
};
