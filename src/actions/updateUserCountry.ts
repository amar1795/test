"use server";

import { prismadb } from "@/lib/db";

export const updateUserCountry = async (id: string, newCountry: string) => {
    try {
      const updatedUser = await prismadb.user.update({
        where: { id }, // Find user by their unique `id`
        data: { country: newCountry }, // Update the `country` field
      });
  
      return updatedUser; // Return the updated user object
    } catch (error) {
      console.error("Error updating user country:", error);
      return null; // Handle errors gracefully
    }
  };
  