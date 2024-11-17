import bcrypt from "bcryptjs";

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import * as z from "zod";
import { prismadb } from "@/lib/db";
import { LoginSchema } from "@/schemas";


export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { username, password } = validatedFields.data;
          
          const user = await getUserByEmail(username);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password,
          );

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ],
} satisfies NextAuthConfig