import { NextResponse } from "next/server";
import { PatientModel } from "@/models/patientModel";
import dbconnect from "@/connectDb";

export async function POST(req: Request) {
    await dbconnect();

    try {
       
        const {
            name,
            email,
            userId,
            phone,
            birthDate,
            gender,
            address,
            occupation,
            emergencyContactName,
            emergencyContactNumber,
            primaryPhysician,
            allergies,
            currentMedication,
            familyMedicalHistory,
            pastMedicalHistory,
           
        } = await req.json();

        

        // Create a new patient instance
        const newPatient = new PatientModel({
            name,
            email,
            userId,
            phone,
            birthDate,
            gender,
            address,
            occupation,
            emergencyContactName,
            emergencyContactNumber,
            primaryPhysician,
            allergies,
            currentMedication,
            familyMedicalHistory,
            pastMedicalHistory,
           
        });

        // Save the patient to the database
        const savedPatient = await newPatient.save();

        // Return a success response
        return NextResponse.json(savedPatient, { status: 201 });
    } catch (error) {
        console.error("Error creating patient:", error);
        // Return an error response
        return NextResponse.json({ message: "Error creating patient" }, { status: 500 });
    }
}
