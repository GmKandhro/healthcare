import { NextResponse } from "next/server";
import { PatientModel } from "@/models/patientModel";
import dbconnect from "@/connectDb";
import { UserModel } from "@/models/userModel";

export async function GET(req: Request,{params}:{params:{id:string}}) {
    await dbconnect();

    try {
       
      
        const {id} = params

        if (!id) {
            return NextResponse.json({ message: "user ID is required" }, { status: 400 });
        }

       
        const user = await UserModel.findById(id);

        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 });
        }

        // Return the user data
        return NextResponse.json({message:"user fetched successfull",data:user}, { status: 200 });
    } catch (error) {
        console.error("Error fetching patient:", error);
        // Return an error response
        return NextResponse.json({ message: "Error fetching user" }, { status: 500 });
    }
}
