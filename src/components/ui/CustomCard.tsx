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

import { LoginSchema, RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { register } from "@/actions/register";

import { useEffect, useRef, useState, useTransition } from "react";
import { login } from "@/actions/login";

export function TabsDemo() {
  const [countries, setCountries] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isSignup, setIsSignup] = useState(false);



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
    register: loginfield,
    handleSubmit: loginhandleSubmit,
    formState: { errors: loginerrors },
    reset:loginreset,
    setValue: setLoginValue

  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });


  
  const onSubmitLogin = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            // reset();
            // alert(data.error);
            setError(data.error);
          }

          if (data?.success) {
            console.log("this is the data",data);
            // alert("redirection successfull");
            loginreset();
            setSuccess(data.success);
            // redirect(`/home`) // Navigate to the new post page
          }

        })
        .catch(() => setError("Something went wrong"));
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
      // alert(error);
    }
    if (success) {
      setIsSignup(false);
      // alert(success);
      reset();
    }
  }, [error, success,setIsSignup]);

const ADMIN_CREDENTIALS = {
  username: "Mark",
  password: "123456" 
};


  const handleAdminLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // setLoginValue("username", ADMIN_CREDENTIALS.username);
    // setLoginValue("password", ADMIN_CREDENTIALS.password);
    
    startTransition(() => {
      login(ADMIN_CREDENTIALS)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }
          if (data?.success) {
            loginreset();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };





  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">LOGIN</TabsTrigger>
        <TabsTrigger value="signup">SIGNUP</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Please Login To Continue</CardTitle>
            {/* <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription> */}
          </CardHeader>
          <form className="mt-8" onSubmit={loginhandleSubmit(onSubmitLogin)}>

          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username"  {...loginfield("username")} />
            </div>
            {loginerrors.username && (
                  <span className="  text-red-800  text-[0.7rem]">
                    {loginerrors.username.message}
                  </span>
                )}
            <div className="space-y-1">
              <Label htmlFor="name">Password</Label>
              <Input type="password" {...loginfield("password")}  />
            </div>
            {loginerrors.password && (
                  <span className="  text-red-800  text-[0.7rem]">
                    {loginerrors.password.message}
                  </span>
                )}
          </CardContent>
          <CardFooter>
            <div className=" flex w-full justify-between">
            <div className="flex w-full justify-between">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAdminLogin}
                  disabled={isPending}
                >
                  {isPending ? "Logging in..." : "Login as Admin"}
                </Button>
              </div>
            </div>
          </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
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
