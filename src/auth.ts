import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prismadb } from "@/lib/db";
import authConfig from "@/auth.config";



export const getUserById = async (id: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { id } });
    // console.log("this is the user data", user)
    return user;
  } catch {
    return null;
  }
};




export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: "/login",
  },
  events: {
    async linkAccount({ user }) {
      await prismadb.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
    
  },
  callbacks: {
    async signIn({ user, account }) {
    
      if (account.provider === "credentials") {
        return true;
      }


      return true;
    },
    async session({ token, session }) {
      
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }


      if (session.user) {
        session.user.name = token.username as string;
      }

      return session;
    },
    async jwt({ token }) {
      
      // sub is a unique identifier for the user ie the user id
      if (!token.sub) return token;
      
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.role = existingUser.role;

      return token;

    },
    
  },
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  ...authConfig,
});
