import { NextResponse } from "next/server";
import { AppointmentModel } from "@/models/appointmentModel";
import dbconnect from "@/connectDb";

export async function POST(req: Request) {
    await dbconnect();

    try {
        
        const {
            schedule,
            reason,
            note,
            primaryPhysician,
            status,
            userId,
            cancellationReason,
            patient
        } = await req.json();

        // Create a new appointment instance
        const newAppointment = new AppointmentModel({
            schedule,
            reason,
            note,
            primaryPhysician,
            status,
            userId,
            cancellationReason,
            patient
        });

        // Save the appointment to the database
        const savedAppointment = await newAppointment.save();

        // Return a success response
        return NextResponse.json(savedAppointment, { status: 201 });
    } catch (error) {
        console.error("Error creating appointment:", error);
        // Return an error response
        return NextResponse.json({ message: "Error creating appointment" }, { status: 500 });
    }
}
