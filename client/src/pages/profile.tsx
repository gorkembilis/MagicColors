import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  User, Settings, LogOut, Heart, Palette, Award, 
  ChevronRight, Crown, Star, Trophy, ImageIcon, Wand2, Sparkles, Trash2, X
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Favorite {
  id: number;
  imageId: string;
  packId?: string;
  imageUrl: string;
  title?: string;
  createdAt: string;
}

export default function Profile() {
  const { t } = useI18n();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading: favoritesLoading } = useQuery<Favorite[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  const { data: myArt = [], isLoading: artLoading } = useQuery<any[]>({
    queryKey: ["/api/my-art"],
    enabled: !!user,
  });

  const deleteMagicImage = useMutation({
    mutationFn: async (imageId: number) => {
      const res = await fetch(`/api/my-art/${imageId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silme başarısız");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-art"] });
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (authLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!user) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t("profile.loginRequired")}</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              {t("profile.loginDesc")}
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col gap-3 w-full max-w-xs"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/auth">
              <Button className="w-full h-12 text-lg font-bold" data-testid="button-login">
                {t("profile.login")}
              </Button>
            </Link>
            <Link href="/auth?mode=register">
              <Button variant="outline" className="w-full h-12 text-lg font-bold" data-testid="button-register">
                {t("profile.register")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  const memberDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-";
  const achievements = [
    { 
      id: 1, 
      icon: Palette, 
      title: t("profile.achievement1"), 
      desc: t("profile.achievement1Desc"),
      completed: myArt.length > 0,
      color: "text-blue-500"
    },
    { 
      id: 2, 
      icon: Star, 
      title: t("profile.achievement2"), 
      desc: t("profile.achievement2Desc"),
      completed: myArt.length >= 10,
      color: "text-yellow-500"
    },
    { 
      id: 3, 
      icon: Heart, 
      title: t("profile.achievement3"), 
      desc: t("profile.achievement3Desc"),
      completed: favorites.length >= 5,
      color: "text-red-500"
    },
  ];

  return (
    <MobileLayout headerTitle={t("profile.title")}>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 py-6 space-y-6"
      >
        <motion.div variants={item} className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
          </div>
          <h2 className="text-xl font-bold">
            {user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.email}
          </h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.isPremium && (
            <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
              <Crown className="w-3 h-3" /> Premium
            </div>
          )}
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-none">
            <CardContent className="py-4">
              <div className="grid grid-cols-3 divide-x">
                <div className="text-center px-2">
                  <p className="text-2xl font-bold text-primary">{myArt.length}</p>
                  <p className="text-xs text-muted-foreground">{t("profile.totalColored")}</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-2xl font-bold text-accent">{favorites.length}</p>
                  <p className="text-xs text-muted-foreground">{t("profile.totalFavorites")}</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-sm font-bold">{memberDate}</p>
                  <p className="text-xs text-muted-foreground">{t("profile.memberSince")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sihirli Dünyam - AI Generated Images */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              {t("profile.magicWorld") || "Sihirli Dünyam"}
            </h3>
            {myArt.length > 0 && (
              <Link href="/gallery" className="text-xs text-primary font-bold">
                {t("profile.viewAll")} <ChevronRight className="inline w-3 h-3" />
              </Link>
            )}
          </div>
          
          {myArt.length === 0 ? (
            <Card className="border-dashed border-purple-200 bg-purple-50/50">
              <CardContent className="py-8 text-center">
                <Wand2 className="w-10 h-10 text-purple-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  {t("profile.magicWorldEmpty") || "Henüz sihirli bir sayfa oluşturmadınız"}
                </p>
                <Link href="/">
                  <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                    <Wand2 className="w-4 h-4 mr-1" />
                    {t("profile.createMagic") || "Sihir Yarat"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {myArt.slice(0, 4).map((art: any) => (
                <div key={art.id} className="relative group">
                  <Link href={`/view/ai-${art.id}`}>
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                      <img 
                        src={art.imageUrl} 
                        alt={art.prompt || "AI Generated"} 
                        className="w-full h-full object-cover"
                        data-testid={`magic-image-${art.id}`}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600/80 to-transparent p-1">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button 
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        data-testid={`delete-magic-${art.id}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("profile.deleteConfirmTitle") || "Görseli Sil"}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("profile.deleteConfirmDesc") || "Bu görseli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("common.cancel") || "İptal"}</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteMagicImage.mutate(art.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {t("profile.delete") || "Sil"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Favorites */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              {t("profile.favorites")}
            </h3>
            {favorites.length > 0 && (
              <Link href="/favorites" className="text-xs text-primary font-bold">
                {t("profile.viewAll")} <ChevronRight className="inline w-3 h-3" />
              </Link>
            )}
          </div>
          
          {favorites.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <Heart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t("profile.favoritesEmpty")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {favorites.slice(0, 4).map((fav) => (
                <Link key={fav.id} href={`/view/${fav.imageId}`}>
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={fav.imageUrl} 
                      alt={fav.title || "Favorite"} 
                      className="w-full h-full object-cover"
                      data-testid={`favorite-image-${fav.id}`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={item}>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {t("profile.achievements")}
          </h3>
          <div className="space-y-2">
            {achievements.map((ach) => (
              <Card key={ach.id} className={`transition-all ${ach.completed ? "" : "opacity-50"}`}>
                <CardContent className="py-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ach.completed ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <ach.icon className={`w-5 h-5 ${ach.completed ? ach.color : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{ach.title}</p>
                    <p className="text-xs text-muted-foreground">{ach.desc}</p>
                  </div>
                  {ach.completed && (
                    <Award className="w-5 h-5 text-yellow-500" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Premium Section */}
        <motion.div variants={item}>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-secondary" />
            Premium
          </h3>
          
          {user.isPremium ? (
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-6 text-white text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-1">
                  {t("profile.premiumActive")}
                </h4>
                <p className="text-white/80 text-sm">
                  {t("profile.premiumActiveDesc")}
                </p>
                <div className="mt-4 flex justify-center gap-2 flex-wrap">
                  <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {t("profile.premiumBenefit1")}
                  </div>
                  <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {t("profile.premiumBenefit2")}
                  </div>
                  <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {t("profile.premiumBenefit3")}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden border-secondary/30">
              <div className="bg-gradient-to-r from-secondary/10 to-orange-400/10 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t("profile.upgradeToPremium")}</h4>
                    <p className="text-xs text-muted-foreground">{t("profile.upgradeDesc")}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>{t("profile.premiumFeature1")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>{t("profile.premiumFeature2")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>{t("profile.premiumFeature3")}</span>
                  </div>
                </div>
                <Link href="/premium">
                  <Button className="w-full bg-gradient-to-r from-secondary to-orange-500 hover:from-secondary/90 hover:to-orange-500/90 text-white font-bold" data-testid="button-get-premium">
                    {t("profile.getPremium")}
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </motion.div>

        <motion.div variants={item} className="space-y-2">
          <Link href="/settings">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="py-3 flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 font-medium">{t("profile.settings")}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {t("profile.logout")}
          </Button>
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
}
