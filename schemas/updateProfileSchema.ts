import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  walletTopUp: z.coerce.number().min(0, "Amount must be positive"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;