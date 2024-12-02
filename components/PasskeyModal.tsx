"use client" //since we are using react hooks here

import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { decryptKey, encryptKey } from '@/lib/utils';
  

  
const PasskeyModal = () => {
    const router = useRouter();
    const path = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const [passkey, setPasskey] = useState('');
    const [error, setError] = useState('');

    // fetch encrypted key stored in browser local storage
    const encryptedKey = typeof window !== undefined ? window.localStorage.getItem('accessKey') : null;

    useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey); //decrypt the encrypted key if it exists

        if(path) {
            if(accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                setIsOpen(false);
                router.push('/admin')
            } else {
                setIsOpen(true);
            }
        }
    }, [encryptedKey]) 

    const closeModal = () => {
        setIsOpen(false); 
        // we also want to set admin as false, coz this modal has closed, so use router
        router.push('/') //redirect to homepage
    }

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)  => {
        e.preventDefault(); //prevent default reload of page when submitted

        if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            //passkey is correct, we have entered admin dashboard
            const encryptedKey = encryptKey(passkey); //encrypting the passkey entered by user

            localStorage.setItem('accessKey', encryptedKey);

            setIsOpen(false);
        } else {
            setError('Invalid passkey. Please try again.')
        }
    }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="shad-alert-dialog">
            <AlertDialogHeader>
            <AlertDialogTitle className='flex items-start justify-between'>
                Admin Access Verification
                <Image 
                    src="/assets/icons/close.svg"
                    alt="close"
                    height={20}
                    width={20}
                    onClick={() => closeModal()}
                    className='cursor-pointer'
                />
            </AlertDialogTitle>
            <AlertDialogDescription>
               To access the admin page, please enter the passkey.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <div>
                <InputOTP maxLength={6} value={passkey} onChange={(value) => setPasskey(value)}>
                <InputOTPGroup className='shad-otp'>
                    <InputOTPSlot className='shad-otp-slot' index={0} />
                    <InputOTPSlot className='shad-otp-slot' index={1} />
                    <InputOTPSlot className='shad-otp-slot' index={2} />
                    <InputOTPSlot className='shad-otp-slot' index={3} />
                    <InputOTPSlot className='shad-otp-slot' index={4} />
                    <InputOTPSlot className='shad-otp-slot' index={5} />
                </InputOTPGroup>
                </InputOTP>

                {error && 
                <p className='shad-error text-14-regular mt-4 flex justify-center'>
                    {error}
                </p>
                }
            </div>

            <AlertDialogFooter>
            <AlertDialogAction onClick={(e) => validatePasskey(e)}
                className='shad-primary-btn w-full'>
                Enter Admin Passkey
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

  )
}

export default PasskeyModal