import * as z from "zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Enter valid email or number",
    })
    .toLowerCase(),
  phone_number: z
    .string()
    .min(10, {
      message: "Minimum 10 characters required",
    })
    .regex(/^\d+$/, "Phone number must contain only numbers"),
});
