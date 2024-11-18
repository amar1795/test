"use client";

import React, { use } from 'react'
import { signOut } from "next-auth/react";
import { logout } from '@/actions/logout';
import { redirect, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react";


import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from '@/hooks/use-current-user';
import { getUserCountry } from '@/actions/getUserCountry';


const Page = () => {

const { data: session, status } = useSession();
  const user=useCurrentUser();


  const [isLoading, setIsLoading] = useState(true);
  const [usercountry, setUserCountry] = useState<string | null>(null);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  console.log("this is user from user hook",user);
  // console.log("this is country selected by user",country);




  useEffect(() => {
    const getData = async () => {
      
      if(user){
    const data= await getUserCountry(user?.id);
    setUserCountry(data);
      }
    }
    getData();
  } ,[user]);

  useEffect(() => {
    // Fetch countries from RestCountries API
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((country: any) => country.name.common);
        setCountries(countryNames);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);


  // useEffect(() => {
  //   // Fetch countries from RestCountries API
  //   fetch("api/user")
  //     .then((response) => response.json())
  //     .then((data) => {
  //      console.log("this is the data from the user api",data?.message);
  //     })
  //     .catch((error) => console.error("Error fetching countries:", error));
  // }, []);

  const updateUserCountry = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/user/country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country: country })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update country')
      }

      console.log("User updated successfully:", data.user)
      // You can update your UI state here
      
    } catch (error) {
      console.error("Error updating country:", error)
      setError(error instanceof Error ? error.message : 'Failed to update country')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    updateUserCountry()
  }, [country])

  
  const initiateLogout = async () => {
    
   await signOut({ redirect: true, callbackUrl: "/" });
   
  };



  return (
    <div>
      {/* <h1>This is Home</h1> */}
      <div className="">
           <div>
           <div className=" bg-black w-full h-[4rem] text-white ">
          <div className=" flex justify-between">
            <div>

            </div>
            <div>
            </div>
          <div className="flex flex-row justify-between text-center  w-[15rem]  space-y-1.5 mr-[5rem] pt-3  ">
               
            
                <div className="w-[10rem] pt-1.5 ">
                <Select 
                 onValueChange={(value) => setCountry(value)}
                //  value={watch("country")} // Add this to sync with form state
>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder={usercountry === null ? "loading":usercountry}  />
                  </SelectTrigger>

                  <SelectContent position="popper"  >
                    {countries.length > 0 && (
                      <>
                        {countries.map((country, index) => (
                          <SelectItem
                            value={country}
                            key={index}
 
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
              
                </Select>
                </div>
                
                <Button className=' bg-white text-black hover:bg-red-600 ' onClick={() => initiateLogout()}>Logout</Button>
                
              </div>
          </div>
        </div>
           </div>
            </div>
    </div>
  )
}

export default Page
