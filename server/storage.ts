import {
  users,
  generatedImages,
  favorites,
  type User,
  type UpsertUser,
  type GeneratedImage,
  type InsertGeneratedImage,
  type Favorite,
  type InsertFavorite,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUserWithPassword(email: string, passwordHash: string, firstName?: string, lastName?: string): Promise<User>;
  getUserGeneratedImages(userId: string): Promise<GeneratedImage[]>;
  createGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage>;
  
  getUserFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, imageId: string): Promise<boolean>;
  isFavorite(userId: string, imageId: string): Promise<boolean>;
  
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllGeneratedImages(): Promise<(GeneratedImage & { userEmail?: string | null })[]>;
  deleteGeneratedImage(id: number): Promise<boolean>;
  getStats(): Promise<{ totalUsers: number; totalImages: number; premiumUsers: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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

  async createUserWithPassword(
    email: string,
    passwordHash: string,
    firstName?: string,
    lastName?: string
  ): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName,
        lastName,
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

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));
  }

  async addFavorite(favoriteData: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values(favoriteData)
      .returning();
    return favorite;
  }

  async removeFavorite(userId: string, imageId: string): Promise<boolean> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.imageId, imageId)));
    return true;
  }

  async isFavorite(userId: string, imageId: string): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.imageId, imageId)));
    return !!favorite;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  }

  async getAllGeneratedImages(): Promise<(GeneratedImage & { userEmail?: string | null })[]> {
    const images = await db
      .select({
        id: generatedImages.id,
        userId: generatedImages.userId,
        prompt: generatedImages.prompt,
        imageUrl: generatedImages.imageUrl,
        createdAt: generatedImages.createdAt,
        userEmail: users.email,
      })
      .from(generatedImages)
      .leftJoin(users, eq(generatedImages.userId, users.id))
      .orderBy(desc(generatedImages.createdAt));
    return images;
  }

  async deleteGeneratedImage(id: number): Promise<boolean> {
    await db.delete(generatedImages).where(eq(generatedImages.id, id));
    return true;
  }

  async getStats(): Promise<{ totalUsers: number; totalImages: number; premiumUsers: number }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [imageCount] = await db.select({ count: count() }).from(generatedImages);
    const [premiumCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.isPremium, true));

    return {
      totalUsers: userCount?.count || 0,
      totalImages: imageCount?.count || 0,
      premiumUsers: premiumCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
