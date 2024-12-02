"use server"

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const CreateAppointment = async (appointment: CreateAppointmentParams) => {
    try{
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )

        // console.log("new appointment created",newAppointment);

        return parseStringify(newAppointment);

    }catch(error) {
        console.log("error in creating appointment",error);
    }
}

export const getAppointment = async (appointmentId: string) => {
    try{
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
        )

        console.log("inside get appointment",appointment);

        return parseStringify(appointment);
    }catch(error){
        console.log("Error in getting appointment",error);
    }
}

export const getRecentAppointmentList = async () => {
    try{
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')] //query to fetch data based on descending order of created date
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') {
                acc.scheduledCount += 1
            } else if (appointment.status === 'pending') {
                acc.pendingCount += 1
            } else if (appointment.status === 'cancelled') {
                acc.cancelledCount += 1
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total, //total appointments
            ...counts, //all pending, scheduled, cancelled counts
            documents: appointments.documents,
        }

        return parseStringify(data);
    } catch(error){
        console.log("Error in getting recent appointment list",error);
    }
}

export const updateAppointment = async ( {appointmentId, userId, appointment, type} : UpdateAppointmentParams) => {
    try{
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!, //database id
            APPOINTMENT_COLLECTION_ID!, //collectionid
            appointmentId, //document id
            appointment, //data
        )

        if(!updateAppointment) {
            throw new Error('Appointment not found');
        } 

        // sms notification


        revalidatePath('/admin'); //update admin route
        return parseStringify(updatedAppointment);
    }catch(error) {
        console.log("error in updating appointment",error);
    }

}