import { z } from "zod";

export const savingSchema = z.object({
  campaignName: z.string().min(3, "Campaign name must be at least 3 characters"),
  frequency: z.enum(["daily", "weekly", "bi-weekly"]),
  amountPerContribution: z.coerce.number().min(1, "Contribution must be at least $1"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 unit"),
});

export type SavingInput = z.infer<typeof savingSchema>;