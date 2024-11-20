"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getNonAdminUsers, getUserCountry } from "@/actions/getUserCountry";
import { DialogDemo } from "@/components/Modal";
import { CardWithForm } from "@/components/Card";
import { AdminDialogDemo } from "@/components/AdminModal";
import { ToastDemo } from "@/components/CustomToast";
import Spinner from "@/components/spinner/Spinner";

const Page = () => {
  const { data: session } = useSession();
  const user = useCurrentUser();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState<string | null>(user?.country);
  const [error, setError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Replace boolean with counter

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((country: any) => country.name.common);
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch user data with error handling and loading state
  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [countryData, allUserData] = await Promise.all([
        getUserCountry(user.id),
        getNonAdminUsers()
      ]);
      
      setUserCountry(countryData);
      setAllUsers(allUserData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data");
    }
  }, [user?.id]);

  // Fetch task data with proper error handling
  const fetchTaskData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.MAIN_DOMAIN}/api/data`);
      if (!response.ok) {
        throw new Error('Failed to fetch task data');
      }
      const taskData = await response.json();
      setData(taskData);
    } catch (error) {
      console.error("Error fetching task data:", error);
      setError("Failed to fetch task data");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Combined effect for fetching both user and task data
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchUserData(),
        fetchTaskData()
      ]);
    };
    
    fetchAllData();
  }, [fetchUserData, fetchTaskData, updateTrigger]);

  // Update user country with proper error handling
  const updateUserCountry = useCallback(async (selectedCountry: string) => {
    if (!selectedCountry || !user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.MAIN_DOMAIN}/api/user/country`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country: selectedCountry }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update country");
      }

      // Trigger a refresh of all data
      setUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error updating country:", error);
      setError(error instanceof Error ? error.message : "Failed to update country");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    updateUserCountry(value);
  };

  const handleDataUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const initiateLogout = () => signOut({ redirect: true, callbackUrl: "/" });

  return (
    <div>
      <div className="">
        <div className="bg-black w-full h-[4rem] text-white">
          <div className="flex justify-between">
            <div></div>
            <div></div>
            <div className="flex flex-row justify-between text-center w-[15rem] space-y-1.5 mr-[5rem] pt-3">
              <div className="w-[10rem] pt-1.5">
                <Select onValueChange={handleCountryChange}>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder={userCountry === null ? "loading" : userCountry} />
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
              <Button 
                className="bg-white text-black hover:bg-red-600"
                onClick={initiateLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mt-7 ml-8">
          {user?.role === "ADMIN" ? (
            <AdminDialogDemo 
              countries={countries} 
              alluserData={allUsers} 
              setUpdateData={handleDataUpdate}
            />
          ) : (
            <DialogDemo 
              selectedCountry={country} 
              setUpdateData={handleDataUpdate}
            />
          )}
        </div>

        <div className="mt-6 ml-7">
          <h1 className="mb-8 text-[2rem]">
            {data.length === 0 ? "No Tasks" : "Your Tasks"}
          </h1>
          
          <div className="flex gap-7 flex-wrap">
            {isLoading ? (
              <div className="text-[2rem] flex w-full justify-center">
                <Spinner/>
              </div>
            ) : (
              data.length !== 0 && data?.map((task) => (
                <CardWithForm 
                  key={task?.id} 
                  task={task} 
                  currentUser={user} 
                  setUpdateData={handleDataUpdate}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;