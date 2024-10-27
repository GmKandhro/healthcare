"use client"
import Image from "next/image";
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation';

import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";
import { useEffect, useState } from "react";

// eslint-disable-next-line @next/next/no-async-client-component
const Register =  ({ params: { userId } }: SearchParamProps) => {
  const [user, setUser] = useState<User>();
  const router =  useRouter()
  useEffect(() => {
    // Function to call getUser and update the state
    const fetchUser = async () => {
      if (userId) {
        const userData = await getUser(userId);
        setUser(userData); // Set user data to state
      }

      const patient:any = await getPatient(userId);
      // console.log("patient",patient)
    
      if (patient.length > 0) router.push(`/patients/${userId}/new-appointment`);
    };

    fetchUser();
    
   
  }, [userId,router]);

  // console.log("this is username id",user)
 

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;