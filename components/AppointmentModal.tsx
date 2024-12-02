"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppointmentForm from './forms/AppointmentForm';
import { Appointment } from '@/types/appwrite.types';

const AppointmentModal = ( { 
    type,
    patientId,
    userId,
    appointment} : {
    type : 'schedule' | 'cancel',
    patientId: string,
    userId: string,
    appointment?: Appointment
}) => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open = {isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger> {/*button acts as a trigger*/}
        <Button variant="ghost" className={`capitalize ${type === 'schedule' && 'text-green-500'}`}>
            {type} 
        </Button>
    </DialogTrigger>
    <DialogContent className='shad-dialog sm:max-w-md'>
        <DialogHeader className='mb-4 space-y-3'>
        <DialogTitle className='captialize'>{type} Appointment</DialogTitle>
        <DialogDescription>
            Please fill in the following details to {type} an appointment.
        </DialogDescription>
        </DialogHeader>

        <AppointmentForm 
        userId={userId}
        patientId={patientId}
        type={type}
        appointment={appointment}
        setOpen={setIsOpen}
        />
    </DialogContent>
    </Dialog>
  )
}

export default AppointmentModal