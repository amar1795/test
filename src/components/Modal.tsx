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
import { useToast } from "@/hooks/use-toast"
import { title } from "process"

export function DialogDemo({selectedCountry,setUpdateData}) {
  const user=useCurrentUser();
  const [open, setOpen] = useState(false); // Control the modal open state

  const [name, setName] = useState(user?.name);
  const [country,setCountry ] = useState(user?.country);
  const [description,setDescription] = useState("");
  const [role,setRole] = useState(user?.role);
  console.log("this is description",description);
  const { toast } = useToast()

  const toastAction = ({varient,title,description}) => {
    toast({
      variant: varient,
      title: title,
      description: description,
    })
  }

  const handleSubmit = async () => {
   
    if(description === "" || country === "" || role === ""){
      
      return  toastAction({
        varient: "destructive", // or "error", "info", etc., depending on your toast implementation
        title: "Error",
        description: "Please fill all the fields",
      });
    }
    setOpen(false)
    
    setUpdateData((prev)=>!prev)
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
      toastAction({
        varient: "success", // or "error", "info", etc., depending on your toast implementation
        title: "Task Created",
        description: "Your Task has been successfully created",
      });
      setDescription("")
    } catch (error) {
      console.error("An error occurred:", error);
      toastAction({
        varient: "destructive", // or "error", "info", etc., depending on your toast implementation
        title: "Error",
        description: error,
      });

      // alert("An unexpected error occurred.");
    }
  };

  useEffect(() => {
setCountry(selectedCountry)
// toastAction()
  } ,[selectedCountry]);
 
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
