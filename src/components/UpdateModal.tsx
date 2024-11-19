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
import { useToast } from "@/hooks/use-toast"



export function UpdateModal({initialDescription,id,UpdateData}) {

  const user=useCurrentUser();

  const [open, setOpen] = useState(false); // Control the modal open state

  const [name, setName] = useState(user?.name);
  const [country,setCountry ] = useState(user?.country);
  const [description,setDescription] = useState(initialDescription);
  const [role,setRole] = useState(user?.role);
  const { toast } = useToast()

// console.log("this is intial description",initialDescription);

  // const id= user?.id;
  // console.log("this is current work id",id);

  const toastAction = ({varient,title,description}) => {
    toast({
      variant: varient,
      title: title,
      description: description,
    })
  }

  const handleToggle = () => {
    // alert("Task Deleted Successfully")
    UpdateData((prev)=>!prev)
  }


  const handleSubmit = async () => {
    setOpen(false)

    if(description === ""){
      return  toastAction({
        varient: "destructive", // or "error", "info", etc., depending on your toast implementation
        title: "Error",
        description: "Please fill all the fields",
      });
    }
    try {
      const response = await fetch(`${process.env.MAIN_DOMAIN}/api/data/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description,
        
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error updating data:", error);
        // alert(`Failed to update data: ${error.error}`);
        return;
      }

      const result = await response.json();
      toastAction({
        varient: "success", // or "error", "info", etc., depending on your toast implementation
        title: "Task Updated",
        description: "Your Task has been successfully Updated",
      });
      // console.log("Data created successfully:", result);
      // alert("Data updated successfully!");
    } catch (error) {
      console.error("An error occurred:", error);
      toastAction({
        varient: "destructive", // or "error", "info", etc., depending on your toast implementation
        title: "Error",
        description: error,
      });
    }

    handleToggle()
  };

  // useEffect(() => {

  //   // to fetch the user data from the api
  //   const getData = async () => {
   
  //   }
  //   getData();
  // } ,[user]);
 
  const handleChange = (event) => {
    setDescription(event.target.value); // Update the state with the textarea value
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  className=" bg-black text-white hover:bg-white hover:text-black " >Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>
            Please Update your Task here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
         
         
          <div className="">
            <Label htmlFor="username" className="text-right" >
              Description
            </Label>
            <Textarea placeholder="Type your Task here."  value={description}  onChange={handleChange} />

          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
