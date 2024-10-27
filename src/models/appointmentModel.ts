import mongoose, { Schema, Document, Model } from "mongoose";
import { IPatient } from "./patientModel";


// Define the interface for the Appointment document
interface IAppointment extends Document {
  patient:mongoose.Schema.Types.ObjectId;
  schedule: Date;
  reason: string;
  note: string;
  primaryPhysician: string;
  status: "scheduled" | "pending" | "cancelled";
  userId: mongoose.Schema.Types.ObjectId;
  cancellationReason: string;
}



// Create the Appointment schema
const appointmentSchema = new Schema<IAppointment>({
  
  schedule: {
    type: Date,
    // required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  primaryPhysician: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "pending", "cancelled"], // Define enum options
    // required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient", 
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there's a User model to reference
    required: true,
  },
  cancellationReason: {
    type: String,
  },
});

// Create the Appointment model with the proper TypeScript type
export const AppointmentModel: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", appointmentSchema);
