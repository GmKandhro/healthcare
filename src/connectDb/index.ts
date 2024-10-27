import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?:number
}

const connection :ConnectionObject={}

async function dbconnect() {
    if (connection.isConnected) {
        console.log("db already  connected")
        return;
    }
    try {
        const db =await mongoose.connect(process.env.MONGODB_URL! || '')
        connection.isConnected = db.connections[0].readyState;
        // console.log("db.connections " ,db.connections);
        console.log("mongodb connection successfully connected")
    } catch (error) {
        console.log("Error While connecting Db ::> " , error)
        process.exit(1)
    }
}

export default  dbconnect;