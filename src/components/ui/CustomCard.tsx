"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { register } from "@/actions/register";

import { useEffect, useRef, useState, useTransition } from "react";

export function TabsDemo() {
  const [countries, setCountries] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();




  useEffect(() => {
    // Fetch countries from RestCountries API
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((country: any) => country.name.common);
        setCountries(countryNames);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);


  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });

      
    });
  };

  const {
    setValue,
    register: registerField,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    watch    
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      country: "",
      password: "",
      confirmpassword: "",
    },
    mode: "onBlur", // Validate on blur
  });


  useEffect(() => {
    if (error) {
      alert(error);
    }
    if (success) {
      // setIsSignup(false);
      // alert(success);
      reset();
    }
  }, [error, success]);

  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">LOGIN</TabsTrigger>
        <TabsTrigger value="password">SIGNUP</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Please Login To Continue</CardTitle>
            {/* <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Password</Label>
              <Input type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  {...registerField("username")}
                />
                {errors.username && (
                  <span className="  text-red-800  text-[0.7rem]">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Country</Label>
                <Select 
                 onValueChange={(value) => setValue("country", value)}
                 value={watch("country")} // Add this to sync with form state
>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select"  />
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
              
                  {errors.country && (
                  <span className="  text-red-800  text-[0.7rem]">
                    {errors.country.message}
                  </span>
                )}
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input id="password" type="password" {...registerField("password")} />
              </div>
              {errors.password && (
                  <span className="  text-red-800  text-[0.7rem]">
                    {errors.password.message}
                  </span>
                )}
              <div className="space-y-1">
                <Label htmlFor="username">Confirm Password</Label>
                <Input id="confirmpassword" type="password"  {...registerField("confirmpassword")} />
              </div>
              {errors.confirmpassword && (
                  <span className="  text-red-800  text-[0.7rem]">
                    {errors.confirmpassword.message}
                  </span>
                )}
            </CardContent>
            <CardFooter>
              <Button>Create Account</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
