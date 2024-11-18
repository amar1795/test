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
import { DeleteModal } from "./deleteModal"

export function CardWithForm({task,currentUser}) {

  console.log("this is the user and current user", task,currentUser);
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle> Task </CardTitle>
        {currentUser?.role === "ADMIN" ?(<p>added by {task?.assignedBy === currentUser?.id ?"You":task?.user?.name } </p>):(<p>added by {task?.assignedBy ? "Admin":task?.user?.name}</p>)}
        <CardDescription>{task?.work}</CardDescription>
      </CardHeader>
      <CardContent>
       
      </CardContent>
      <CardFooter className="flex justify-between">

        {currentUser.role !=="ADMIN" ? task?.assignedBy ?(<div></div>):( <div className=" flex justify-between  w-full"> 
       <UpdateModal   initialDescription={task?.work} id={task?.id} />
        <DeleteModal id={task?.id} /></div>):( <div className=" flex justify-between  w-full"> 
       <UpdateModal   initialDescription={task?.work} id={task?.id} />
        <DeleteModal id={task?.id} /></div>)}
      
        
      </CardFooter>
    </Card>
  )
}
