import { z } from "zod";

export const BrandFormSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  logo: z.string().optional(),
  description: z.string().optional(),
  code: z.string().min(1, "Code Required"),
  status: z.string(),
});
