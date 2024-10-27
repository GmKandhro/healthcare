import { NextResponse } from "next/server";
import { AppointmentModel } from "@/models/appointmentModel";
import dbconnect from "@/connectDb";

export async function GET() {
    await dbconnect();

    try {
        // Fetch all appointments and populate patient details
        const appointments = await AppointmentModel.aggregate([
            {
                $lookup: {
                    from: "patients", // The name of the `Patient` collection in the database
                    localField: "patient", // The field in `Appointment` model that references `Patient`
                    foreignField: "_id", // The field in `Patient` model which `_id` references
                    as: "patient", // Output the result under `patientDetails`
                },
            },
            {
                $unwind: "$patient", // Unwind the array if you expect a single patient
            },
        ]);

        if (!appointments || appointments.length === 0) {
            return NextResponse.json({ message: "No appointments found" }, { status: 404 });
        }

        // Return the list of appointments
        return NextResponse.json(appointments, { status: 200 });
    } catch (error:any) {
        console.error("Error fetching appointments:", error);
        // Return an error response
        return NextResponse.json({ message: "Error fetching appointments" }, { status: 500 });
    }
}
