import { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { registerSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "magiccolors-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
      sameSite: "lax",
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Bu email adresi zaten kayıtlı" });
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      
      const user = await storage.createUserWithPassword(
        data.email,
        passwordHash,
        data.firstName,
        data.lastName
      );

      req.session.userId = user.id;
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isPremium: user.isPremium,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      console.error("Register error:", error);
      res.status(500).json({ message: "Kayıt başarısız oldu" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(data.email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Email veya şifre hatalı" });
      }

      const isValid = await bcrypt.compare(data.password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Email veya şifre hatalı" });
      }

      req.session.userId = user.id;
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isPremium: user.isPremium,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri" });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Giriş başarısız oldu" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Çıkış yapılamadı" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Çıkış başarılı" });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const testMode = process.env.TEST_MODE === 'true' || process.env.NODE_ENV !== 'production';
  
  if (!req.session.userId) {
    if (testMode) {
      (req as any).guestMode = true;
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
