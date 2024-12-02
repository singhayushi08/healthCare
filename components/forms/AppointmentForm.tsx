"use client" 

import { zodResolver } from "@hookform/resolvers/zod" //used to integrate Zod-based form validation with React Hook Form
import { useForm } from "react-hook-form" //react hook to manage the form state and validation
import { z } from "zod" //zod is used for form validation
import {
  Form,
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { Doctors } from "@/constants"
import { CreateAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"

/* accepting props in this component and assigning their types */
const AppointmentForm = ({
    userId,
    patientId,
    type,
    appointment,
    setOpen
    }: {
        userId: string,
        patientId: string,
        type: "create" | "cancel" | "schedule",
        appointment?: Appointment,
        setOpen: (open: boolean) => void;
    }
) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  let buttonLabel;

  switch(type) {
    case "create":
        buttonLabel= "Create Appointment"
        break;
    case "cancel":
        buttonLabel = "Cancel Appointment"
        break;
    case "schedule":
        buttonLabel = "Schedule Appointment"
        break;
    default:
        break;
  }

  const AppointmentFormValidation = getAppointmentSchema(type);

  // 1. Define your form.
  // The useForm hook initializes the form with zodResolver and a validation schema AppointmentFormValidation.
  // z.infer<typeof AppointmentFormValidation> tells TypeScript to infer the form data type from the schema named as AppointmentFormValidation.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician || "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
      reason: appointment?.reason || "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status;

    switch(type) {
        case 'schedule':
            status = 'scheduled'
            break;
        case 'cancel':
            status = 'cancelled'
            break;
        default: 
            status = 'pending'
            break;
    }

    // console.log("before type:",type);

    try {
        if(type === 'create' && patientId) {
            console.log("inside create");

            const appointmentData = {
                userId,
                patient: patientId,
                primaryPhysician: values.primaryPhysician,
                schedule: new Date(values.schedule),
                reason: values.reason!,
                note: values.note,
                status: status as Status
            }

            const appointment = await CreateAppointment(appointmentData);

            // console.log("appointment created,",appointment);

            if(appointment) {
                form.reset(); //reset form
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
            }
        } else {
            const appointmentToUpdate = {
                userId,
                appointmentId: appointment?.$id!,
                type,
                appointment: {
                    primaryPhysician: values?.primaryPhysician,
                    schedule: new Date(values?.schedule),
                    status: status as Status,
                    cancellationReason: values?.cancellationReason,
                }
            }

            const updatedAppointment = await updateAppointment(appointmentToUpdate);

            if(updatedAppointment) {
                setOpen && setOpen(false);
                form.reset();
            }
        }

    } catch(error) {
      console.log("Error caught!",error);
    }
  }

 
  return (
    // This component wraps the form fields and applies the form state (form) to the form elements, enabling integration with react-hook-form.
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        { type === 'create' &&
        <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds</p>
        </section>
        }

        {type !== "cancel" && (
            <>
                <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                label="Doctor"
                name="primaryPhysician"
                placeholder="Select a doctor"
                >
                    {Doctors.map((doctor,i) => (
                        <SelectItem key={doctor.name+i} value={doctor.name}>
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image 
                                src={doctor.image}
                                height={32}
                                width={32}
                                alt={doctor.name}
                                className="rounded-full border border-dark-500"
                                />
                                <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="schedule"
                label="Expected Appointment Date"
                showTimeSelect
                dateFormat="MM/dd/yyyy - h:mm aa"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="reason"
                    label="Reason for Appointment"
                    placeholder="Enter reason for appointment"
                    />

                    <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="note"
                    label="Notes"
                    placeholder="Enter notes"
                    />
                </div>
                </>
        )}
        
        {type === "cancel" && (
            <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
            />
        )}
        
        <SubmitButton isLoading={isLoading} className={`${type ==="cancel" ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
        >{buttonLabel}</SubmitButton>
      </form>
    </Form>

  )
}

export default AppointmentForm
