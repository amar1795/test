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
import { use, useEffect, useState } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DialogDemo({selectedCountry}) {
  const user=useCurrentUser();
  const [open, setOpen] = useState(false); // Control the modal open state

  const [name, setName] = useState(user?.name);
  const [country,setCountry ] = useState(user?.country);
  const [description,setDescription] = useState("");
  const [role,setRole] = useState(user?.role);
console.log("this is description",description);




  const handleSubmit = async () => {
    setOpen(false)
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description,
          country: country,
          role: role,
          id:user?.id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating data:", error);
        // alert(`Failed to create data: ${error.error}`);
        return;
      }

      const result = await response.json();
      console.log("Data created successfully:", result);
      // alert("Data created successfully!");
    } catch (error) {
      console.error("An error occurred:", error);
      // alert("An unexpected error occurred.");
    }
  };

  useEffect(() => {

    // to fetch the user data from the api
    const getData = async () => {
   
    }
    getData();
  } ,[user]);
 
  const handleChange = (event) => {
    setDescription(event.target.value); // Update the state with the textarea value
  };

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
            <Input
              id="name"
              defaultValue={name}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="flex gap-4 items-center">
            <Label htmlFor="username" className="text-right">
              Country
            </Label>
            <Input
              id="username"
              defaultValue={selectedCountry}
              className="col-span-3"
              disabled
            />
            
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
}
