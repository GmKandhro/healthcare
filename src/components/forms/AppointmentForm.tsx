"use client";
import { revalidatePath } from "next/cache";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getRecentAppointmentList, createAppointment, sendSMSNotification } from "@/lib/actions/appointment.actions";
// import { updateAppointment } from "../updateAppointment";
import { SelectItem } from "@/components/ui/select";
import { Doctors } from "../../../constants";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "../../../types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { getPatient } from "@/lib/actions/patient.actions";
import { useAppointments } from "../../../context/AppointmentsContext";
import { formatDateTime } from "@/lib/utils";
import axios from "axios";

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
  onAppointmentUpdate,
}: {
  userId: string;
  patientId?: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  onAppointmentUpdate?: () => void; // New callback to refresh data
}) => {
  const {appointments, setAppointments} = useAppointments();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment ? new Date(appointment?.schedule!) : new Date(),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  // update appointment
  const updateAppointment = async ({
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
      const res = await axios.patch(`/api/appointment/updateAppointment/${appointmentId}`,
        appointment
      );
  
      // Send SMS notification
      await sendSMSNotification(phone, smsMessage);
  
      // Get updated list of appointments and counts
     const updatedAppointments = await getRecentAppointmentList();
      setAppointments(updatedAppointments)
      "use server"
       revalidatePath('/admin');
     return {
      updatedAppointment: res.data,
      ...updatedAppointments,
    };
    } catch (error) {
      console.error("An error occurred while updating an appointment:", error);
      throw new Error("Failed to update appointment");
    }
  };

  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    try {
      const patient: any = await getPatient(userId);
      let status;
      switch (type) {
        case "schedule":
          status = "scheduled";
          break;
        case "cancel":
          status = "cancelled";
          break;
        default:
          status = "pending";
      }

      if (type === "create" && patient[0]._id) {
        const newAppointmentData = {
          userId,
          patient: patient[0]._id,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason,
          status: status as Status,
          note: values.note,
        };

        const newAppointment = await createAppointment(newAppointmentData);
        
        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment._id}`
          );
        }
      } else if (appointment && patient[0]._id) {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment._id,
          phone: appointment.patient.phone,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        
        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
          onAppointmentUpdate && onAppointmentUpdate(); // Trigger data refresh
        }
      }
    } catch (error) {
      console.error("Error handling the appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual check-up"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
