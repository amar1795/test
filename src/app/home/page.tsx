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
import { DialogDemo } from '@/components/Modal';
import { CardWithForm } from '@/components/Card';
import { UpdateModal } from '@/components/UpdateModal';


const Page = () => {

const { data: session, status } = useSession();
  const user=useCurrentUser();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usercountry, setUserCountry] = useState<string | null>(null);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState<string | null>(user?.country);
  const [error, setError] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  console.log("this is user from user hook",user);
  console.log("this is country selected by user",country);




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
    const getData = async () => {
      const response = await fetch('/api/data')
      
       const data = await response.json()
       setData(data)
      //  alert("Data fetched successfully!");
        console.log("this is the data from the user api",data);
  }
    getData();
  }, [country])

  
  const initiateLogout = async () => {
    
   await signOut({ redirect: true, callbackUrl: "/" });
   
  };

//   useEffect(() => {

//     const getData = async () => {
//       const response = await fetch('/api/data')
      
//        const data = await response.json()
//        setData(data)
//       //  alert("Data fetched successfully!");
//         console.log("this is the data from the user api",data);
//   }
//     getData();
// }, [country]);



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

            <div>
             <div className=' mt-7 ml-8'>
            <DialogDemo selectedCountry={country} />
             </div>
              
             <div className=' mt-6 ml-7'>

              { (data.length === 0) ?(<h1 className=' mb-8 text-[2rem]'>No Tasks</h1>):<h1 className=' mb-8 text-[2rem]'>Your Tasks</h1>}
          
          <div className=' flex gap-7'>

        
         {data && data?.map((task) => (<CardWithForm key={task?.id} task={task} currentUser={user} />))}
                    
                      </div>
          
             </div>
            </div>
    </div>
  )
}

export default Page
