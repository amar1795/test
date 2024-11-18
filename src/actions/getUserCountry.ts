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
  