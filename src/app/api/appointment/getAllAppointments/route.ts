import { NextResponse } from "next/server";
import { AppointmentModel } from "@/models/appointmentModel";
import dbconnect from "@/connectDb";
import { revalidatePath } from "next/cache";

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

        const response = NextResponse.json(appointments, { status: 200 });
    // Set cache headers to prevent unnecessary caching
    response.headers.set('Cache-Control', 'no-store'); // Or 'no-store' for stronger prevention
        await revalidatePath("/admin")
    return response;
    } catch (error:any) {
        console.error("Error fetching appointments:", error);
        // Return an error response
        return NextResponse.json({ message: "Error fetching appointments" }, { status: 500 });
    }
}
