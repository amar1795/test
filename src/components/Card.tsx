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

export function CardWithForm({task,currentUser}) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Your Task </CardTitle>
        <p>added by {task?.username === currentUser?.username && "you"} </p>
        <CardDescription>{task?.work}</CardDescription>
      </CardHeader>
      <CardContent>
       
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Edit</Button>
        <Button>Delete</Button>
      </CardFooter>
    </Card>
  )
}
