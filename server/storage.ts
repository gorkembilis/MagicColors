import {
  users,
  generatedImages,
  type User,
  type UpsertUser,
  type GeneratedImage,
  type InsertGeneratedImage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserGeneratedImages(userId: string): Promise<GeneratedImage[]>;
  createGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserGeneratedImages(userId: string): Promise<GeneratedImage[]> {
    return await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.userId, userId))
      .orderBy(desc(generatedImages.createdAt));
  }

  async createGeneratedImage(
    imageData: InsertGeneratedImage
  ): Promise<GeneratedImage> {
    const [image] = await db
      .insert(generatedImages)
      .values(imageData)
      .returning();
    return image;
  }
}

export const storage = new DatabaseStorage();
