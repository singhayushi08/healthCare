"use server"

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"

import {InputFile} from "node-appwrite/file"

export const createUser = async (user: CreateUserParams) => {
    try{
        const newUser = users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name,
        )

        console.log("new user",newUser);
        return newUser;
    } catch (error: any) {
        if(error && error?.code === 409) {
            const documents = await users.list(
                [
                    Query.equal('email',user.email) //already existing user
                ]
            )

            return documents.users[0];
        }
    }
}

export const getUser = async (userId: string) => {
    try{
        const user = await users.get(userId);

        return parseStringify(user);
    }catch(error) {
        console.log("error in getting user",error);
    }
}

export const registerPatient = async ( { identificationDocument, ...patient } : RegisterUserParams) => {
    try {
        let file;

        if(identificationDocument) {
            /* getting the input file uploaded by user */
            const inputFile = identificationDocument &&
            InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            )
            
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile) //save file in storage
        }

        console.log("gender: ",patient.gender);
        console.log("file id",file?.$id);
        // console.log("url",`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`);

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id ? file?.$id : null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }
        )

        return parseStringify(newPatient);
    }catch(error) {
        console.log("error in registering user",error);
    }
}

export const getPatient = async (userId: string) => {
    try{
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [
                Query.equal('userId',userId)
            ]
        )

        // console.log("patients,",patients);
        return parseStringify(patients.documents[0]);

    }catch(error) {
        console.log("error in get patient",error);
    }
}