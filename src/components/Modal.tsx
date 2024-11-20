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
import { useEffect, useState, useCallback } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/hooks/use-toast"

export function DialogDemo({selectedCountry, setUpdateData}) {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    country: selectedCountry || user?.country || '',
    description: '',
    role: user?.role || ''
  });

  const { toast } = useToast();

  // Update country when selectedCountry changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev, 
      country: selectedCountry || prev.country
    }));
  }, [selectedCountry]);

  // Consolidated change handler
  const handleChange = useCallback((key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Toast notification helper
  const showToast = useCallback((variant: 'default' | 'destructive' | 'success', title: string, description: string) => {
    toast({
      variant,
      title,
      description
    });
  }, [toast]);

  // Submit handler with improved error handling
  const handleSubmit = async () => {
    // Validation
    if (!formData.description || !formData.country || !formData.role) {
      showToast('destructive', 'Error', 'Please fill all the fields');
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setOpen(false);

    try {
      const response = await fetch(`${process.env.MAIN_DOMAIN}/api/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: formData.description,
          country: formData.country,
          role: formData.role,
          id: user?.id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create task');
      }

      // Trigger data update
      setUpdateData(prev => prev + 1);  // Use increment instead of toggle

      // Success toast
      showToast('success', 'Task Created', 'Your task has been successfully created');

      // Reset description
      setFormData(prev => ({...prev, description: ''}));
    } catch (error) {
      console.error("Task creation error:", error);
      showToast('destructive', 'Error', error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-white hover:text-black">
          Create Task +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Please Add your Task here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-4 items-center">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="flex gap-4 items-center">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <Input
              id="country"
              value={formData.country}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea 
              id="description"
              placeholder="Type your Task here." 
              value={formData.description}  
              onChange={(e) => handleChange('description', e.target.value)} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}