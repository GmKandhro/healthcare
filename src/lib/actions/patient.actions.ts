

import axios from 'axios';
import { Appointment } from '../../../types/appwrite.types';



// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {

    const response = await axios.post('/api/patient/createUser', user);
    console.log("API Response:", response.data);

    

    return response.data.data; // Return user data from API
  } catch (error: any) {
    console.error("Error while calling createUser API:", error);

    // Return message from the error (if available) or a default error message
    return {
      message: error.response?.data?.message || "Failed to create user. Please try again.",
    };
  }
};


// GET USER
// Todo: Work on it

export const getUser = async (userId: string) => {
  try {
   
    if (!userId) {
      throw new Error("User ID is required to retrieve user details.");
    }

    // Call the backend API to get the user details
    const response = await axios.get(`/api/patient/getuser/${userId}`);

    // Checking data is here or not
    if (response.data && response.data.data) {
      // console.log("User details successfully retrieved:", response.data.data);
      return response.data.data; // Return the user data
    } else {
      throw new Error("User not found.");
    }
  } catch (error: any) {
    // Log the error and return a meaningful message
    console.error("Error while retrieving the user details:", error.message || error);

    // Return an error object/message for further handling
    return {
      message: error.response?.data?.message || "An unexpected error occurred while retrieving the user details.",
    };
  }
};


// REGISTER PATIENT
export const registerPatient = async (patient: RegisterUserParams) => {
  try {
   
  //  console.log("Patient userID",patient.userId)
    const response = await axios.post("/api/patient/registerPatient", patient)

    return response.data
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    // Make the API call to fetch patient details based on the userId (patientId)
    const response = await axios.get(`/api/patient/getPatient/${userId}`);
   
    return response.data.data;  // Assuming the data is in 'data'
  } catch (error: any) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
    throw new Error("Failed to fetch patient details");
  }
};






