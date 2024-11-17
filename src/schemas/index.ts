import * as z from "zod";
import { UserRole } from "@prisma/client";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;


export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }).regex(passwordRegex, {
    message: "Password must have at least one uppercase letter, one lowercase letter, one digit, and one special character",
  }),
  confirmpassword: z.string()
}).refine(
  (values) =>
   values.password === values.confirmpassword
  ,
  {
    message: "Please enter the same Password !",
    path: ["confirmpassword"],
  }
);

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  newPassword: z.string().min(6, {
    message: "Minimum 6 characters required",
  }).regex(passwordRegex, {
    message: "Password must have at least one uppercase letter, one lowercase letter, one digit, and one special character",
  }),
  confirmNewPassword: z.string()
}).refine(
  (values) =>
    values.newPassword === values.confirmNewPassword,
  {
    message: "Please enter the same password!",
    path: ["confirmNewPassword"],
  }
);

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
    username: z.string().min(1, {
        message: "username is required",
      }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});


export const RegisterSchema = z.object({
  username: z.string().min(1, {
    message: "username is required",
  }),
  country: z.string().min(1, {
    message: "country is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  confirmpassword: z.string() 
}).refine(
  (values) =>
   values.password === values.confirmpassword
  ,
  {
    message: "Please enter the same Password !",
    path: ["confirmpassword"],
  }
)
