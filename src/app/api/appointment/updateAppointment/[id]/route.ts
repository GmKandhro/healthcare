import { NextResponse } from "next/server";
import { AppointmentModel } from "@/models/appointmentModel";
import dbconnect from "@/connectDb";

export async function PATCH(req: Request,{params}:{params:{id:string}}) {
    await dbconnect();

    try {
      
        const {id } = params
        const  appointmentId = id

        if (!appointmentId) {
            return NextResponse.json({ message: "Appointment ID is required" }, { status: 400 });
        }

        // Extract the data to update from the request body
        const body = await req.json();

        // Update the appointment in the database
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            appointmentId,
            body, // Fields to update
            { new: true } // Return the updated document
        );

        if (!updatedAppointment) {
            return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
        }

        // Return the updated appointment data
        return NextResponse.json({updatedAppointment}, { status: 200 });
    } catch (error) {
        console.error("Error updating appointment:", error);
        // Return an error response
        return NextResponse.json({ message: "Error updating appointment" }, { status: 500 });
    }
}
