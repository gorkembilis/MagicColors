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

  app.get("/api/contests/active", async (req, res) => {
    try {
      const contest = await storage.getActiveContest();
      if (!contest) {
        return res.json(null);
      }
      const submissions = await storage.getContestSubmissions(contest.id);
      res.json({ contest, submissions });
    } catch (error) {
      console.error("Error fetching active contest:", error);
      res.status(500).json({ message: "Yarışma alınamadı" });
    }
  });

  app.get("/api/contests/:id/leaderboard", async (req, res) => {
    try {
      const { id } = req.params;
      const leaderboard = await storage.getLeaderboard(parseInt(id));
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Liderlik tablosu alınamadı" });
    }
  });

  app.post("/api/contests/:id/submit", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { id } = req.params;
      const { imageUrl, title } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ message: "imageUrl gerekli" });
      }

      const submission = await storage.createContestSubmission({
        contestId: parseInt(id),
        userId,
        imageUrl,
        title,
      });

      res.json(submission);
    } catch (error) {
      console.error("Error submitting to contest:", error);
      res.status(500).json({ message: "Eser gönderilemedi" });
    }
  });

  app.post("/api/contests/submissions/:id/vote", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { id } = req.params;

      const success = await storage.voteForSubmission(parseInt(id), userId);
      if (!success) {
        return res.status(400).json({ message: "Bu esere zaten oy verdiniz" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error voting:", error);
      res.status(500).json({ message: "Oy verilemedi" });
    }
  });

  app.get("/api/contests/submissions/:id/voted", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { id } = req.params;

      const hasVoted = await storage.hasUserVoted(parseInt(id), userId);
      res.json({ hasVoted });
    } catch (error) {
      console.error("Error checking vote:", error);
      res.status(500).json({ message: "Oy durumu kontrol edilemedi" });
    }
  });

  app.post("/api/admin/contests", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { theme, themeKey, startDate, endDate } = req.body;

      if (!theme || !themeKey || !startDate || !endDate) {
        return res.status(400).json({ message: "Tüm alanlar gerekli" });
      }

      const contest = await storage.createContest({
        theme,
        themeKey,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: true,
      });

      res.json(contest);
    } catch (error) {
      console.error("Error creating contest:", error);
      res.status(500).json({ message: "Yarışma oluşturulamadı" });
    }
  });

  app.get("/api/admin/contests", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const contests = await storage.getAllContests();
      res.json(contests);
    } catch (error) {
      console.error("Error fetching contests:", error);
      res.status(500).json({ message: "Yarışmalar alınamadı" });
    }
  });

  // Promo Code Routes - Admin
  app.get("/api/admin/promo-codes", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const promoCodes = await storage.getAllPromoCodes();
      res.json(promoCodes);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      res.status(500).json({ message: "Promosyon kodları alınamadı" });
    }
  });

  app.post("/api/admin/promo-codes", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { code, description, maxUses, premiumDays, expiresAt, isActive } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Kod gerekli" });
      }

      const promoCode = await storage.createPromoCode({
        code,
        description,
        maxUses: maxUses || 1,
        premiumDays: premiumDays || 30,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== false,
      });

      res.json(promoCode);
    } catch (error: any) {
      console.error("Error creating promo code:", error);
      if (error.code === "23505") {
        return res.status(400).json({ message: "Bu kod zaten mevcut" });
      }
      res.status(500).json({ message: "Promosyon kodu oluşturulamadı" });
    }
  });

  app.patch("/api/admin/promo-codes/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { code, description, maxUses, remainingUses, premiumDays, expiresAt, isActive } = req.body;

      const updates: any = {};
      if (code !== undefined) updates.code = code.toUpperCase();
      if (description !== undefined) updates.description = description;
      if (maxUses !== undefined) updates.maxUses = maxUses;
      if (remainingUses !== undefined) updates.remainingUses = remainingUses;
      if (premiumDays !== undefined) updates.premiumDays = premiumDays;
      if (expiresAt !== undefined) updates.expiresAt = expiresAt ? new Date(expiresAt) : null;
      if (isActive !== undefined) updates.isActive = isActive;

      const promoCode = await storage.updatePromoCode(parseInt(id), updates);
      if (!promoCode) {
        return res.status(404).json({ message: "Promosyon kodu bulunamadı" });
      }

      res.json(promoCode);
    } catch (error) {
      console.error("Error updating promo code:", error);
      res.status(500).json({ message: "Promosyon kodu güncellenemedi" });
    }
  });

  app.delete("/api/admin/promo-codes/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deletePromoCode(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting promo code:", error);
      res.status(500).json({ message: "Promosyon kodu silinemedi" });
    }
  });

  app.get("/api/admin/promo-codes/:id/redemptions", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const redemptions = await storage.getPromoCodeRedemptions(parseInt(id));
      res.json(redemptions);
    } catch (error) {
      console.error("Error fetching redemptions:", error);
      res.status(500).json({ message: "Kullanım geçmişi alınamadı" });
    }
  });

  // Promo Code Routes - User
  app.post("/api/promo/redeem", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ success: false, message: "Kod gerekli" });
      }

      const result = await storage.redeemPromoCode(userId, code);
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error redeeming promo code:", error);
      res.status(500).json({ success: false, message: "Kod kullanılamadı" });
    }
  });

  // Puzzle Routes
  app.get("/api/puzzles", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const puzzles = await storage.getUserPuzzles(userId);
      res.json(puzzles);
    } catch (error) {
      console.error("Error fetching puzzles:", error);
      res.status(500).json({ message: "Puzzle'lar alınamadı" });
    }
  });

  app.get("/api/puzzles/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const puzzle = await storage.getPuzzle(parseInt(id));
      if (!puzzle) {
        return res.status(404).json({ message: "Puzzle bulunamadı" });
      }
      res.json(puzzle);
    } catch (error) {
      console.error("Error fetching puzzle:", error);
      res.status(500).json({ message: "Puzzle alınamadı" });
    }
  });

  app.post("/api/puzzles", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { title, imageUrl, difficulty } = req.body;

      if (!title || !imageUrl) {
        return res.status(400).json({ message: "Başlık ve resim gerekli" });
      }

      const puzzle = await storage.createPuzzle({
        userId,
        title,
        imageUrl,
        difficulty: difficulty || 3,
      });

      res.json(puzzle);
    } catch (error) {
      console.error("Error creating puzzle:", error);
      res.status(500).json({ message: "Puzzle oluşturulamadı" });
    }
  });

  app.patch("/api/puzzles/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { id } = req.params;
      const { isCompleted, bestTime } = req.body;

      const puzzle = await storage.getPuzzle(parseInt(id));
      if (!puzzle || puzzle.userId !== userId) {
        return res.status(404).json({ message: "Puzzle bulunamadı" });
      }

      const updates: any = {};
      if (typeof isCompleted === "boolean") updates.isCompleted = isCompleted;
      if (typeof bestTime === "number") updates.bestTime = bestTime;

      const updated = await storage.updatePuzzle(parseInt(id), updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating puzzle:", error);
      res.status(500).json({ message: "Puzzle güncellenemedi" });
    }
  });

  app.delete("/api/puzzles/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { id } = req.params;

      const puzzle = await storage.getPuzzle(parseInt(id));
      if (!puzzle || puzzle.userId !== userId) {
        return res.status(404).json({ message: "Puzzle bulunamadı" });
      }

      await storage.deletePuzzle(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting puzzle:", error);
      res.status(500).json({ message: "Puzzle silinemedi" });
    }
  });

  return httpServer;
}
