"use server";
import { z } from "zod";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "../lib/constants";
import db from "@/lib/db";

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return !user;
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !user;
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???",
      })
      .toLowerCase()
      .trim()
      // .transform((username) => `🔥 ${username}`)
      .refine(checkUniqueUsername, "Username is already taken"),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(checkUniqueEmail, "Email is already taken"),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(
        PASSWORD_REGEX,
        "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-"
      ),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPassword, {
    path: ["confirm_password"],
    message: "Two passwords should be equal",
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // hash password
    // save the user to db
    // log the user in
    // redirect "/home"
  }
}
