

import type { Metadata } from "next";
import localFont from "next/font/local";
import "../../globals.css";
import { Label } from "@/components/ui/label";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ToastDemo } from "@/components/CustomToast";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
// console.log("this is session from the root",session);
  return (
    <SessionProvider session={session}>

    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        {children}
        <Toaster />
      </body>
    </html>
    </SessionProvider>

  );
}
