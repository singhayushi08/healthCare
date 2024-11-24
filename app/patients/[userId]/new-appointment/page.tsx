// this is our home page
import AppointmentForm from "@/components/forms/AppointmentForm";
import PatientForm, { FormFieldType } from "@/components/forms/PatientForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";

const NewAppointment = async (props : SearchParamProps)  => {
    const params = await Promise.resolve(props.params);
    const userId = params.userId;
    const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen">

      <section className="remove-scrollbar container my-auto">
         <div className="sub-container max-w-[860px] flex-1 justify-between"></div>
         <Image
         src="/assets/icons/logo-full.svg"
         height ={1000}
         width= {1000}
         alt = "patient"
         className="mb-12 h-10 w-fit" //marign bottom, height, width css
         />

         {/* <PatientFo rm/> */}

         <AppointmentForm 
         type="create"
         userId={userId}
         patientId={patient.$id}
         /> 

         <p className="copyright mt-10 py-12">© 2024 CarePulse</p>

      </section>

      <Image 
      src = "/assets/images/appointment-img.png"
      height={1000}
      width={1000}
      alt="appointment"
      className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}

export default NewAppointment;