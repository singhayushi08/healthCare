"use client" 

import { zodResolver } from "@hookform/resolvers/zod" //used to integrate Zod-based form validation with React Hook Form
import { useForm } from "react-hook-form" //react hook to manage the form state and validation
import { z } from "zod" //zod is used for form validation
import {
  Form,
  FormControl,
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"  //shadcn
import { Doctors, genderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { Select, SelectItem } from "../ui/select" //shadcn
import Image from "next/image"
import FileUploader from "../FileUploader"

 const RegisterForm = ({user} : {user: User}) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  // The useForm hook initializes the form with zodResolver and a validation schema UserFormValidation.
  // z.infer<typeof UserFormValidation> tells TypeScript to infer the form data type from the schema named as UserFormValidation.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
        ...PatientFormDefaultValues,
      fullName: "",
      email: "",
      phone: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {

    console.log("register form submittied",values);
    setIsLoading(true);
    let formData;

    /* extracting the file uploaded by user */
    if(values.identificationDocument && values.identificationDocument.length > 0) {
        const blobFile = new Blob([values.identificationDocument[0]], {
            type: values.identificationDocument[0].type,
        })

        formData = new FormData();
        formData.append('blobFile', blobFile);
        formData.append('fileName', values.identificationDocument[0].name);
    }


    try {
      // append data to the existing user details
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }
        
      // @ts-ignore
      const patient = await registerPatient(patientData);
      
      if(patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch(error) {
      console.log("Error caught!",error);
    }
  }

  return (
    // This component wraps the form fields and applies the form state (form) to the form elements, enabling integration with react-hook-form.
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header">Welcome!</h1>
            <p className="text-dark-700">Let's get to know more about you.</p>
        </section>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Personal Information</h2>
            </div>
        </section>

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            label="Full Name"
            name="fullName"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row"> 
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                label="Email"
                name="email"
                placeholder="johndoe@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
            />

            <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                label="Phone Number"
                name="phone"
                placeholder="(91) 1234 5678"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Date of Birth"
            />

            <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gender"
                renderSkeleton={(field) => {
                    return (
                    <FormControl>
                        <RadioGroup 
                        className="flex h-11 gap-6 xl:justify-between"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        >
                            {genderOptions.map((option) => (
                                <div key={option}
                                className="radio-group">
                                    <RadioGroupItem value={option} id={option}/>
                                    <Label htmlFor={option} className="cursor-pointer">
                                        {option}
                                    </Label>
                                </div>
                            )) }
                        </RadioGroup>
                    </FormControl>
                    )
                }}
            />
        </div>
        
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                label="Address"
                name="address"
                placeholder="Church hill street 9"
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                label="Occupation"
                name="occupation"
                placeholder="Software Engineer"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                label="Emergency Contact Name"
                name="emergencyContactName"
                placeholder="Guardian's Name"
            />

            <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                label="Emergency Contact Number"
                name="emergencyContactNumber"
                placeholder="(91) 1234 5678"
            />

        </div>

         <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Medical Information</h2>
            </div>
        </section>

        <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        label="Primary Physician"
        name="primaryPhysician"
        placeholder="Select a Physician"
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

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                label="Insurance Provider"
                name="insuranceProvider"
                placeholder="BlueSheild"
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                label="Insurance Policy Number"
                name="insurancePolicyNumber"
                placeholder="XYZ123456"
            />

        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                label="Allergies (if any)"
                name="allergies"
                placeholder="Peanuts, Pollen"
            />
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                label="Current Medication (if any)"
                name="currentMedication"
                placeholder="PCM 500"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                label="Family Medical History"
                name="familyMedicalHistory"
                placeholder=""
            />
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                label="Past Medical History"
                name="pastMedicalHistory"
                placeholder=""
            />
        </div>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Identification & Verification</h2>
            </div>
        </section>

        <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        label="Identification Type"
        name="identificationType"
        placeholder="Select an identification type"
        >
            {IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                    {type}
                </SelectItem>
            ))}
        </CustomFormField>

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            label="Identification Number"
            name="identificationNumber"
            placeholder="123456789"
        />

        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => {
                return (
                    <FormControl>
                        <FileUploader
                        files={field.value || []} //not using any state here to store these values, just using react hook
                        onChange={field.onChange}
                        /> 
                    </FormControl>
                )
            }}
        />

        
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Consent & Privacy</h2>
            </div>
        </section>

        <CustomFormField
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="treatmentConsent"
        label="I consent to treatment"
        />

        <CustomFormField
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="disclosureConsent"
        label="I consent to disclosure of information"
        />

        <CustomFormField
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="privacyConsent"
        label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>

  )
}


export default RegisterForm