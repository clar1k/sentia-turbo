import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export class UserService {
  async findOrCreateUser(walletAddress: string) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.wallet, walletAddress.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return existingUser[0];
    }

    // Create new user if doesn't exist
    const newUser = await db
      .insert(users)
      .values({
        wallet: walletAddress.toLowerCase(),
      })
      .returning();

    return newUser[0];
  }

  async getUserById(id: number) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user.length > 0 ? user[0] : null;
  }
}
