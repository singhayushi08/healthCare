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
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

// enum is a special class that represents a group of constants
export enum FormFieldType {
    INPUT= 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = "phoneInput",
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT='select',
    SKELETON='skeleton',
}

 const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  // The useForm hook initializes the form with zodResolver and a validation schema UserFormValidation.
  // z.infer<typeof UserFormValidation> tells TypeScript to infer the form data type from the schema named as UserFormValidation.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserFormValidation>) {

    const {name, email, phone} = values;
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("form submittied",values);
    setIsLoading(true);
    try {
      const userData = {
        name, email, phone
      }

      // create new user with details entered by user 
      const user = await createUser(userData);

      // if user created, direct the user to registration page by routing
      if(user) router.push(`/patients/${user.$id}/register`)
    } catch(error) {
      console.log("Error caught!",error);
    }
  }

  return (
    // This component wraps the form fields and applies the form state (form) to the form elements, enabling integration with react-hook-form.
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi there! 👋</h1>
            <p className="text-dark-700">Schedule your first appointment.</p>
        </section>

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="email"
        label="email"
        placeholder="johndoe@gmail.com"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"
        />

        <CustomFormField
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="phone"
        label="phone number"
        placeholder="(91) 1234 5678"
        />
        
        
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>

  )
}


export default PatientForm