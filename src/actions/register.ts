"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { prismadb } from "@/lib/db";

import { RegisterSchema } from "@/schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { country, password, username,confirmpassword } = validatedFields.data;
  
  const fullname = username ;
  if(password !== confirmpassword){
    return { error: "Password and Confirm Password do not match!" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await prismadb.user.create({
    data: {
      name:fullname,
    country:country,
      password: hashedPassword,
    },
  });


  return { success: "Account Created" };
};
