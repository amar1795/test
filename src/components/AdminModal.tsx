"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textarea"
import React, { use, useCallback, useEffect, useState } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AdminDialogDemo= React.memo(({countries,alluserData})=> {
  const user=useCurrentUser();
  const [open, setOpen] = useState(false); // Control the modal open state

  const [name, setName] = useState(user?.name);
  const [country,setCountry ] = useState(user?.country);
  const [description,setDescription] = useState("");
  const [role,setRole] = useState(user?.role);
  const [selectedUserId,setselectedUserId] = useState(null);
  const [selectedUserRole,setselectedUserRole] = useState(null);
// console.log("this is all user data",alluserData);
console.log("this is the selected user role ",selectedUserRole);




  const handleSubmit = async () => {
    setOpen(false)
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description,
          country: country,
          role: selectedUserRole,
          id:selectedUserId,
          assignedBy:user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating data:", error);
        alert(`Failed to create data: ${error.error}`);
        return;
      }

      const result = await response.json();
      console.log("Data created successfully:", result);
      alert("Data created successfully!");
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred.");
    }
  };

  // useEffect(() => {

  //   // to fetch the user data from the api
  //   const getData = async () => {
   
  //   }
  //   getData();
  // } ,[user]);


  const handleSetData=(data)=>{
    setselectedUserId(data.id);
    setselectedUserRole(data.role);
  }
 
    // Handle textarea change



    const handleChange = useCallback(
      (event) => {
        setDescription(event.target.value); // Only update the state for description
      },
      [setDescription]
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  className=" bg-black text-white hover:bg-white hover:text-black " >Create Task +</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Please Add your Task here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className=" flex gap-4 items-center">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>


                <div className="w-[10rem] pt-1.5 ">
                <Select 
                 onValueChange={(value) => {
                  const selectedUser = alluserData.find((user) => user.name === value);
                  handleSetData(selectedUser); // Call your function with the selected user data
                  setCountry(value); // Update the state for country
                }}
                //  value={watch("country")} // Add this to sync with form state
>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="select a user" />
                  </SelectTrigger>

                  <SelectContent position="popper"  >
                    {alluserData.length > 0 && (
                      <>
                          {alluserData.map((userName, index) => (
                            <SelectItem
                              value={userName?.name}
                              key={index}
                              // onClick={()=>handleSetData(userName)}
  
                            >
                              {userName?.name}
                            </SelectItem>
                          ))}
                      </>
                    )}
                  </SelectContent>
              
                </Select>
                </div>
          </div>
          <div className="flex gap-4 items-center">
            <Label htmlFor="username" className="text-right">
              Country
            </Label>

              <div className="w-[10rem] pt-1.5 ">
                <Select 
                 onValueChange={(value) => setCountry(value)}
>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="select a country" />
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
          </div>
          <div className="">
            <Label htmlFor="username" className="text-right" >
              Description
            </Label>
            <Textarea placeholder="Type your Task here."  value={description}  onChange={handleChange} />

          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

AdminDialogDemo.displayName = "AdminDialogDemo";
