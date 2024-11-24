
import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// layout for Register page
/* destructure userID from params */
const Register = async (props : SearchParamProps) => {
    const params = await Promise.resolve(props.params);
    const userId = params.userId;
    const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      {/* */}

      <section className="remove-scrollbar container my-auto">
         <div className="sub-container max-w-[860px] flex-1 flex-col py-10"></div>
         <Image
         src="/assets/icons/logo-full.svg"
         height ={1000}
         width= {1000}
         alt = "patient"
         className="mb-12 h-10 w-fit" //marign bottom, height, width css
         />

        <RegisterForm user={user}/>

        <p className="copyright py-12">© 2024 CarePulse</p>

      </section>

      <Image 
      src = "/assets/images/register-img.png"
      height={1000}
      width={1000}
      alt="patient"
      className="side-img max-w-[390px]"
      />
    </div>
  )
}

export default Register