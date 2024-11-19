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

export function DeleteModal({id,UpdateData}) {
  const user=useCurrentUser();
  const { toast } = useToast()

  const [open, setOpen] = useState(false); // Control the modal open state

  const [name, setName] = useState(user?.name);
  const [country,setCountry ] = useState(user?.country);
  const [description,setDescription] = useState("");
  const [role,setRole] = useState(user?.role);
// console.log("this is description",description);

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
    try {
      const response = await fetch(`${process.env.MAIN_DOMAIN}/api/data/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting data:", error);
        // alert(`Failed to delete data: ${error.error}`);
        return toastAction({
          varient: "destructive", 
          title: "Error",
          description: error,
        });

        
      }

      toastAction({
        varient: "success", 
        title: "Task Deleted",
        description: "Your Task has been successfully Deleted",
      });
      // alert("Task Deleted Successfully")
      const result = await response.json();
     
      // console.log("Data deleted successfully:", result);
    } catch (error) {
      console.error("An error occurred:", error);
      toastAction({
        varient: "destructive", 
        title: "Error",
        description: error,
      });
    }
    handleToggle()
  };

  

  const handleClose = () => {
    setOpen(false);
  }

 
  const handleChange = (event) => {
    setDescription(event.target.value); // Update the state with the textarea value
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  className=" bg-black text-white hover:bg-white hover:text-black " >Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Would you like to Delete the Task</DialogTitle>
         
        </DialogHeader>
        
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} >Yes</Button>
          <Button type="submit" onClick={handleClose}>No</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
