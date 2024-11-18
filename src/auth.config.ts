import bcrypt from "bcryptjs";

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import * as z from "zod";
import { prismadb } from "@/lib/db";
import { LoginSchema } from "@/schemas";
import { getUserByUsername } from "./actions/login";



export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { username, password } = validatedFields.data;
          
          const user = await getUserByUsername(username);
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