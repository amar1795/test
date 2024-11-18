"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { prismadb } from "@/lib/db";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";


const DEFAULT_LOGIN_REDIRECT = "/home";

export const getUserByUsername = async (username: string) => {
    try {
      const user = await prismadb.user.findUnique({ where: { name:username } });
  
      return user;
    } catch {
      return null;
    }
  };


export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { username, password } = validatedFields.data;

  const existingUser = await getUserByUsername(username);

  if (!existingUser || !existingUser.name || !existingUser.password) {
    return { error: "Username does not exist!" };
  }


  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo:DEFAULT_LOGIN_REDIRECT ,
    });
    return { success: "Logged in!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
