import { NextResponse } from "next/server";
import { PatientModel } from "@/models/patientModel";
import dbconnect from "@/connectDb";

export async function GET(req: Request,{params}:{params:{id:string}}) {
    await dbconnect();

    try {
        // Extract the patient ID from the request URL's query parameters
      
        const {id} = params
        // console.log(id)

        if (!id) {
            return NextResponse.json({ message: "Patient ID is required" }, { status: 400 });
        }

        // Find the patient by ID
        const patient = await PatientModel.find({userId:id});

        // console.log("from patient route",id)

        if (!patient) {
            return NextResponse.json({ message: "Patient not found" }, { status: 404 });
        }

        // Return the patient data
        return NextResponse.json({message:"Patient fetched successfull",data:patient}, { status: 200 });
    } catch (error) {
        console.error("Error fetching patient:", error);
        // Return an error response
        return NextResponse.json({ message: "Error fetching patient" }, { status: 500 });
    }
}
