"use server";

import { prismadb } from "@/lib/db";


export const getUserCountry = async (id: string) => {
    try {
      const user = await prismadb.user.findUnique({
        where: { id }, // Querying by `id` instead of `name`
        select: { country: true }, // Select only the `country` field
      });
  
      return user?.country || null; // Return the country or null if user is not found
    } catch (error) {
      console.error("Error fetching user country:", error);
      return null; // Handle errors gracefully
    }
  };
  

  export const getNonAdminUsers = async () => {
    try {
      const users = await prismadb.user.findMany({
        where: {
          role: { not: "ADMIN" }, // Fetch users where role is not ADMIN
        },
        select: {
          id: true,      // Include the user ID
          name: true,    // Include the user name
          country: true, // Include the user country
          role: true,    // Include the role for verification
        },
      });
  
      return users; // Return the list of users
    } catch (error) {
      console.error("Error fetching non-admin users:", error);
      return []; // Return an empty array in case of an error
    }
  };
  