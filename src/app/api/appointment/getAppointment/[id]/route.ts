import { NextResponse } from "next/server";
import { AppointmentModel } from "@/models/appointmentModel";
import dbconnect from "@/connectDb";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await dbconnect();

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Appointment ID is required" },
      { status: 400 }
    );
  }

  try {
    // Find the appointment by ID
    const appointment = await AppointmentModel.findById(id);

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Return the appointment data
    return NextResponse.json(
      {
        message: "Patient fetched successfully",
        data: appointment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching appointment:", error);
    // Return an error response
    return NextResponse.json(
      { message: "Error fetching appointment" },
      { status: 500 }
    );
  }
}
