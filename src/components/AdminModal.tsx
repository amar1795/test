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
import React, { useCallback, useState } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export const AdminDialogDemo = React.memo(({ countries, alluserData, setUpdateData }) => {
  const user = useCurrentUser();
  const { toast } = useToast();
  
  // Form state
  const [formState, setFormState] = useState({
    open: false,
    description: "",
    country: "",
    selectedUserId: null,
    selectedUserRole: null,
    isSubmitting: false
  });

  // Toast helper
  const showToast = useCallback(({ variant, title, description }) => {
    toast({
      variant,
      title,
      description,
    });
  }, [toast]);

  // Handle user selection
  const handleUserSelect = useCallback((userName) => {
    const selectedUser = alluserData.find((user) => user.name === userName);
    if (selectedUser) {
      setFormState(prev => ({
        ...prev,
        selectedUserId: selectedUser.id,
        selectedUserRole: selectedUser.role
      }));
    }
  }, [alluserData]);

  // Handle country selection
  const handleCountrySelect = useCallback((country) => {
    setFormState(prev => ({
      ...prev,
      country
    }));
  }, []);

  // Handle description change
  const handleDescriptionChange = useCallback((event) => {
    setFormState(prev => ({
      ...prev,
      description: event.target.value
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    const { description, country, selectedUserId, selectedUserRole } = formState;
    
    // Validation
    if (!description || !country || !selectedUserId) {
      showToast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all the fields"
      });
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const response = await fetch(`${process.env.MAIN_DOMAIN}/api/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          country,
          role: selectedUserRole,
          id: selectedUserId,
          assignedBy: user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }

      await response.json();
      
      // Success handling
      showToast({
        variant: "success",
        title: "Task Created",
        description: "Your Task has been successfully created"
      });
      
      // Reset form and close dialog
      setFormState(prev => ({
        ...prev,
        open: false,
        description: "",
        country: "",
        selectedUserId: null,
        selectedUserRole: null
      }));
      
      // Update parent component
      setUpdateData(prev => !prev);

    } catch (error) {
      showToast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState, user?.id, showToast, setUpdateData]);

  return (
    <Dialog 
      open={formState.open} 
      onOpenChange={(open) => setFormState(prev => ({ ...prev, open }))}
    >
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-white hover:text-black">
          Create Task +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>Please Add your Task here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* User Selection */}
          <div className="flex gap-4 items-center">
            <Label htmlFor="name" className="text-right">Name</Label>
            <div className="w-[10rem] pt-1.5">
              <Select onValueChange={handleUserSelect}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="select a user" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {alluserData.map((userName, index) => (
                    <SelectItem value={userName?.name} key={index}>
                      {userName?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Country Selection */}
          <div className="flex gap-4 items-center">
            <Label htmlFor="country" className="text-right">Country</Label>
            <div className="w-[10rem] pt-1.5">
              <Select onValueChange={handleCountrySelect}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="select a country" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {countries.map((country, index) => (
                    <SelectItem value={country} key={index}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea 
              placeholder="Type your Task here." 
              value={formState.description} 
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

AdminDialogDemo.displayName = "AdminDialogDemo";