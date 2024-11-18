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

  // Fetch countries once on component mount
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((country: any) => country.name.common);
        setCountries(countryNames);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (user) {
      const countryData = await getUserCountry(user?.id);
      setUserCountry(countryData);
      const allUserData = await getNonAdminUsers();
      setAllUsers(allUserData);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Update user country
  const updateUserCountry = useCallback(async (selectedCountry: string) => {
    if (!selectedCountry) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/country", {
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

      // Fetch updated data after successful update
      await fetchUserData();
      await fetchTaskData();
    } catch (error) {
      console.error("Error updating country:", error);
      setError(error instanceof Error ? error.message : "Failed to update country");
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserData]);

  // Fetch task data
  const fetchTaskData = useCallback(async () => {
    try {
      const response = await fetch("/api/data");
      const taskData = await response.json();
      setData(taskData);
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  }, []);

  useEffect(() => {
    fetchTaskData();
  }, [fetchTaskData]);

  const handleCountryChange = async (value: string) => {
    setCountry(value);
    await updateUserCountry(value);
  };

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
            <AdminDialogDemo countries={countries} alluserData={allUsers} />
          ) : (
            <DialogDemo selectedCountry={country} />
          )}
        </div>

        <div className="mt-6 ml-7">
          <h1 className="mb-8 text-[2rem]">
            {data.length === 0 ? "No Tasks" : "Your Tasks"}
          </h1>
          <div className="flex gap-7">
            {data?.map((task) => (
              <CardWithForm key={task?.id} task={task} currentUser={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;