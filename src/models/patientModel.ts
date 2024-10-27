import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Patient document
export interface IPatient extends Document {
  name: string;
  email: string;
  phone: number;
  birthDate: Date;
  gender: string;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: number;
  primaryPhysician: string;
  allergies: string;
  currentMedication: string;
  familyMedicalHistory: string;
  pastMedicalHistory: string;
  userId:string

}

// Create the Patient schema
const patientSchema = new Schema<IPatient>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
 
  phone: {
    type: Number,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  emergencyContactName: {
    type: String,
    required: true,
  },
  emergencyContactNumber: {
    type: Number,
    required: true,
  },
  primaryPhysician: {
    type: String,
    required: true,
  },
 
  
  allergies: {
    type: String,
    required: true,
  },
  currentMedication: {
    type: String,
    required: true,
  },
  familyMedicalHistory: {
    type: String,
    required: true,
  },
  pastMedicalHistory: {
    type: String,
    required: true,
  },
  userId:{
    type: String,
    required: true
  }
  
  
  
});

// Create the Patient model with proper TypeScript type
export const PatientModel: Model<IPatient> = mongoose.models.Patient || mongoose.model<IPatient>("Patient", patientSchema);
