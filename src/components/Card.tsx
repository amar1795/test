"use client"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UpdateModal } from "./UpdateModal"
import { DeleteModal } from "./DeleteModal"

export function CardWithForm({task,currentUser,setUpdateData}) {

  // console.log("this is the user and current user", task,currentUser);
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle> Task </CardTitle>
        {currentUser?.role === "ADMIN" ?(<CardDescription>added by {task?.assignedBy === currentUser?.id ?"You":task?.user?.name } </CardDescription>):(<p>added by {task?.assignedBy ? "Admin":"you"}</p>)}
        {currentUser?.role ==="ADMIN" && task?.assignedBy &&  (<p className=" text-gray-600">assigned to {task?.user?.name}</p>)}
        <p>{task?.work}</p>

      </CardHeader>
      <CardContent>
       
       </CardContent>    
      <CardFooter className="flex justify-between">

        {currentUser?.role !=="ADMIN" ? task?.assignedBy ?(<div></div>):( <div className=" flex justify-between  w-full"> 
       <UpdateModal UpdateData={setUpdateData}   initialDescription={task?.work} id={task?.id} />
         
        <DeleteModal id={task?.id} UpdateData={setUpdateData} /></div>):( <div className=" flex justify-between  w-full"> 
       <UpdateModal  UpdateData={setUpdateData}  initialDescription={task?.work} id={task?.id} />
        <DeleteModal id={task?.id} UpdateData={setUpdateData}  /></div>)}
      
        
      </CardFooter>
    </Card>
  )
}
