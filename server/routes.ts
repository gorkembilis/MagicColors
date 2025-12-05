import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { generateColoringPage } from "./gemini";

const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Yetkisiz erişim" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user?.isAdmin) {
    return res.status(403).json({ message: "Yönetici yetkisi gerekli" });
  }
  
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isPremium: user.isPremium,
        isAdmin: user.isAdmin,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/generate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const imageUrl = await generateColoringPage(prompt);

      const image = await storage.createGeneratedImage({
        userId,
        prompt,
        imageUrl,
      });

      res.json(image);
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });

  app.get("/api/my-art", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const images = await storage.getUserGeneratedImages(userId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching user images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  app.get("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Favoriler alınamadı" });
    }
  });

  app.post("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { imageId, packId, imageUrl, title } = req.body;

      if (!imageId || !imageUrl) {
        return res.status(400).json({ message: "imageId ve imageUrl gerekli" });
      }

      const existing = await storage.isFavorite(userId, imageId);
      if (existing) {
        return res.status(400).json({ message: "Bu resim zaten favorilerde" });
      }

      const favorite = await storage.addFavorite({
        userId,
        imageId,
        packId,
        imageUrl,
        title,
      });

      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Favori eklenemedi" });
    }
  });

  app.delete("/api/favorites/:imageId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { imageId } = req.params;

      await storage.removeFavorite(userId, imageId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Favori kaldırılamadı" });
    }
  });

  app.get("/api/favorites/:imageId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { imageId } = req.params;

      const isFavorite = await storage.isFavorite(userId, imageId);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite:", error);
      res.status(500).json({ message: "Favori durumu alınamadı" });
    }
  });

  app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "İstatistikler alınamadı" });
    }
  });

  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        isPremium: u.isPremium,
        isAdmin: u.isAdmin,
        createdAt: u.createdAt,
      })));
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Kullanıcılar alınamadı" });
    }
  });

  app.patch("/api/admin/users/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { isPremium, isAdmin: makeAdmin } = req.body;
      
      const updates: any = {};
      if (typeof isPremium === "boolean") updates.isPremium = isPremium;
      if (typeof makeAdmin === "boolean") updates.isAdmin = makeAdmin;
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isPremium: user.isPremium,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Kullanıcı güncellenemedi" });
    }
  });

  app.delete("/api/admin/users/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      if (id === req.session.userId) {
        return res.status(400).json({ message: "Kendinizi silemezsiniz" });
      }
      
      await storage.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Kullanıcı silinemedi" });
    }
  });

  app.get("/api/admin/images", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const images = await storage.getAllGeneratedImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Görüntüler alınamadı" });
    }
  });

  app.delete("/api/admin/images/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGeneratedImage(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Görüntü silinemedi" });
    }
  });

  return httpServer;
}
