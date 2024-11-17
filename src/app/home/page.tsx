"use client";

import React from 'react'
import { signOut } from "next-auth/react";
import { logout } from '@/actions/logout';
import { redirect } from 'next/navigation';


const Page = () => {

  
  const initiateLogout = async () => {
    signOut({ redirect: true, callbackUrl: "/" });
    await logout();
    // redirect("/");
  };
  return (
    <div>
      <h1>This is Home</h1>
      <div className="">
              <button
                onClick={() => initiateLogout()}
                className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-600"
              >
                <h1 className="font-bold below-1000:text-[0.8rem]">Logout</h1>
              </button>
            </div>
    </div>
  )
}

export default Page
