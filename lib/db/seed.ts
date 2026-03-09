import { createTables } from "./schema";

export async function seedDatabase() {
  await createTables();
  return { success: true };
}
