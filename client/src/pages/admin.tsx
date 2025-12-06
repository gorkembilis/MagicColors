import { useState } from "react";
import { useLocation } from "wouter";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Image,
  Crown,
  Trash2,
  Shield,
  ArrowLeft,
  Settings,
  BarChart3,
  RefreshCw,
  Ticket,
  Plus,
  Copy,
  Check,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isPremium: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface AdminImage {
  id: number;
  userId: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  userEmail: string | null;
}

interface Stats {
  totalUsers: number;
  totalImages: number;
  premiumUsers: number;
}

interface PromoCode {
  id: number;
  code: string;
  description: string | null;
  maxUses: number;
  remainingUses: number;
  premiumDays: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { language } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState("stats");
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    description: "",
    maxUses: 1,
    premiumDays: 30,
    expiresAt: "",
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.isAdmin,
  });

  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isAdmin,
  });

  const { data: images, isLoading: imagesLoading, refetch: refetchImages } = useQuery<AdminImage[]>({
    queryKey: ["/api/admin/images"],
    enabled: !!user?.isAdmin,
  });

  const { data: promoCodes, isLoading: promoCodesLoading, refetch: refetchPromoCodes } = useQuery<PromoCode[]>({
    queryKey: ["/api/admin/promo-codes"],
    enabled: !!user?.isAdmin,
  });

  const createPromoCodeMutation = useMutation({
    mutationFn: async (data: typeof newPromoCode) => {
      const res = await apiRequest("POST", "/api/admin/promo-codes", {
        ...data,
        expiresAt: data.expiresAt || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      setPromoDialogOpen(false);
      setNewPromoCode({ code: "", description: "", maxUses: 1, premiumDays: 30, expiresAt: "" });
      toast({
        title: language === "tr" ? "Başarılı" : "Success",
        description: language === "tr" ? "Promosyon kodu oluşturuldu" : "Promo code created",
      });
    },
    onError: () => {
      toast({
        title: language === "tr" ? "Hata" : "Error",
        description: language === "tr" ? "Promosyon kodu oluşturulamadı" : "Failed to create promo code",
        variant: "destructive",
      });
    },
  });

  const updatePromoCodeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PromoCode> }) => {
      const res = await apiRequest("PATCH", `/api/admin/promo-codes/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      toast({
        title: language === "tr" ? "Başarılı" : "Success",
        description: language === "tr" ? "Promosyon kodu güncellendi" : "Promo code updated",
      });
    },
    onError: () => {
      toast({
        title: language === "tr" ? "Hata" : "Error",
        description: language === "tr" ? "Promosyon kodu güncellenemedi" : "Failed to update promo code",
        variant: "destructive",
      });
    },
  });

  const deletePromoCodeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/promo-codes/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      toast({
        title: language === "tr" ? "Başarılı" : "Success",
        description: language === "tr" ? "Promosyon kodu silindi" : "Promo code deleted",
      });
    },
    onError: () => {
      toast({
        title: language === "tr" ? "Hata" : "Error",
        description: language === "tr" ? "Promosyon kodu silinemedi" : "Failed to delete promo code",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { isPremium?: boolean; isAdmin?: boolean } }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: language === "tr" ? "Başarılı" : "Success",
        description: language === "tr" ? "Kullanıcı güncellendi" : "User updated",
      });
    },
    onError: () => {
      toast({
        title: language === "tr" ? "Hata" : "Error",
        description: language === "tr" ? "Kullanıcı güncellenemedi" : "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: language === "tr" ? "Başarılı" : "Success",
        description: language === "tr" ? "Kullanıcı silindi" : "User deleted",
      });
    },
    onError: () => {
      toast({
        title: language === "tr" ? "Hata" : "Error",
        description: language === "tr" ? "Kullanıcı silinemedi" : "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/images/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: language === "tr" ? "Başarılı" : "Success",
        description: language === "tr" ? "Görüntü silindi" : "Image deleted",
      });
    },
    onError: () => {
      toast({
        title: language === "tr" ? "Hata" : "Error",
        description: language === "tr" ? "Görüntü silinemedi" : "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <MobileLayout showHeader={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </MobileLayout>
    );
  }

  if (!user?.isAdmin) {
    return (
      <MobileLayout showHeader={false}>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 text-center">
          <Shield className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-xl font-bold mb-2">
            {language === "tr" ? "Erişim Reddedildi" : "Access Denied"}
          </h1>
          <p className="text-muted-foreground mb-4">
            {language === "tr" 
              ? "Bu sayfaya erişim yetkiniz yok" 
              : "You don't have permission to access this page"}
          </p>
          <Button onClick={() => setLocation("/")} data-testid="button-go-home">
            {language === "tr" ? "Ana Sayfaya Dön" : "Go Home"}
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const handleRefresh = () => {
    refetchStats();
    refetchUsers();
    refetchImages();
    refetchPromoCodes();
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPromoCode(prev => ({ ...prev, code }));
  };

  return (
    <MobileLayout showHeader={false}>
      <div className="flex flex-col min-h-[calc(100vh-80px)]">
        <div className="sticky top-0 bg-background/95 backdrop-blur z-10 p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  {language === "tr" ? "Yönetim Paneli" : "Admin Dashboard"}
                </h1>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              data-testid="button-refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mx-4 mt-4" style={{ width: "calc(100% - 32px)" }}>
            <TabsTrigger value="stats" className="flex items-center gap-1 text-xs px-2" data-testid="tab-stats">
              <BarChart3 className="h-3 w-3" />
              {language === "tr" ? "İstatistik" : "Stats"}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 text-xs px-2" data-testid="tab-users">
              <Users className="h-3 w-3" />
              {language === "tr" ? "Üyeler" : "Users"}
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-1 text-xs px-2" data-testid="tab-images">
              <Image className="h-3 w-3" />
              {language === "tr" ? "Görseller" : "Images"}
            </TabsTrigger>
            <TabsTrigger value="promo" className="flex items-center gap-1 text-xs px-2" data-testid="tab-promo">
              <Ticket className="h-3 w-3" />
              {language === "tr" ? "Kodlar" : "Codes"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="flex-1 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4"
            >
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">
                    {language === "tr" ? "Toplam Kullanıcı" : "Total Users"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold" data-testid="text-total-users">
                      {statsLoading ? "..." : stats?.totalUsers || 0}
                    </span>
                    <Users className="h-8 w-8 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">
                    {language === "tr" ? "Toplam Görsel" : "Total Images"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold" data-testid="text-total-images">
                      {statsLoading ? "..." : stats?.totalImages || 0}
                    </span>
                    <Image className="h-8 w-8 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">
                    {language === "tr" ? "Premium Üyeler" : "Premium Users"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold" data-testid="text-premium-users">
                      {statsLoading ? "..." : stats?.premiumUsers || 0}
                    </span>
                    <Crown className="h-8 w-8 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="users" className="flex-1">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4 space-y-3">
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : users?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {language === "tr" ? "Henüz kullanıcı yok" : "No users yet"}
                  </div>
                ) : (
                  users?.map((u) => (
                    <Card key={u.id} className="overflow-hidden" data-testid={`card-user-${u.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium truncate" data-testid={`text-user-email-${u.id}`}>
                                {u.email || "No email"}
                              </span>
                              {u.isAdmin && (
                                <Badge variant="default" className="bg-purple-500">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                              {u.isPremium && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                            {(u.firstName || u.lastName) && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {[u.firstName, u.lastName].filter(Boolean).join(" ")}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <Switch
                                checked={u.isPremium}
                                onCheckedChange={(checked) =>
                                  updateUserMutation.mutate({ id: u.id, data: { isPremium: checked } })
                                }
                                disabled={updateUserMutation.isPending}
                                data-testid={`switch-premium-${u.id}`}
                              />
                              Premium
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <Switch
                                checked={u.isAdmin}
                                onCheckedChange={(checked) =>
                                  updateUserMutation.mutate({ id: u.id, data: { isAdmin: checked } })
                                }
                                disabled={updateUserMutation.isPending || u.id === user?.id}
                                data-testid={`switch-admin-${u.id}`}
                              />
                              Admin
                            </label>
                          </div>
                          
                          {u.id !== user?.id && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  data-testid={`button-delete-user-${u.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {language === "tr" ? "Kullanıcıyı Sil?" : "Delete User?"}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {language === "tr"
                                      ? "Bu işlem geri alınamaz. Kullanıcı ve tüm verileri silinecek."
                                      : "This action cannot be undone. The user and all their data will be deleted."}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    {language === "tr" ? "İptal" : "Cancel"}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteUserMutation.mutate(u.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {language === "tr" ? "Sil" : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="images" className="flex-1">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4 grid grid-cols-2 gap-3">
                {imagesLoading ? (
                  <div className="col-span-2 flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : images?.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    {language === "tr" ? "Henüz görsel yok" : "No images yet"}
                  </div>
                ) : (
                  images?.map((img) => (
                    <Card key={img.id} className="overflow-hidden" data-testid={`card-image-${img.id}`}>
                      <div className="aspect-square relative bg-muted">
                        <img
                          src={img.imageUrl}
                          alt={img.prompt}
                          className="h-full w-full object-contain"
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-7 w-7"
                              data-testid={`button-delete-image-${img.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {language === "tr" ? "Görseli Sil?" : "Delete Image?"}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {language === "tr"
                                  ? "Bu işlem geri alınamaz."
                                  : "This action cannot be undone."}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {language === "tr" ? "İptal" : "Cancel"}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteImageMutation.mutate(img.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {language === "tr" ? "Sil" : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <CardContent className="p-2">
                        <p className="text-xs text-muted-foreground truncate" title={img.prompt}>
                          {img.prompt}
                        </p>
                        <p className="text-xs text-muted-foreground/70 truncate">
                          {img.userEmail || "Unknown user"}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="promo" className="flex-1">
            <div className="p-4">
              <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mb-4" data-testid="button-create-promo">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "tr" ? "Yeni Kod Oluştur" : "Create New Code"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {language === "tr" ? "Yeni Promosyon Kodu" : "New Promo Code"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>{language === "tr" ? "Kod" : "Code"}</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newPromoCode.code}
                          onChange={(e) => setNewPromoCode(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                          placeholder="PREMIUM2024"
                          data-testid="input-promo-code-new"
                        />
                        <Button variant="outline" onClick={generateRandomCode} type="button">
                          {language === "tr" ? "Rastgele" : "Random"}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{language === "tr" ? "Açıklama" : "Description"}</Label>
                      <Input
                        value={newPromoCode.description}
                        onChange={(e) => setNewPromoCode(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={language === "tr" ? "Kampanya açıklaması" : "Campaign description"}
                        data-testid="input-promo-description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{language === "tr" ? "Kullanım Sayısı" : "Max Uses"}</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newPromoCode.maxUses}
                          onChange={(e) => setNewPromoCode(prev => ({ ...prev, maxUses: parseInt(e.target.value) || 1 }))}
                          data-testid="input-promo-max-uses"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{language === "tr" ? "Premium Gün" : "Premium Days"}</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newPromoCode.premiumDays}
                          onChange={(e) => setNewPromoCode(prev => ({ ...prev, premiumDays: parseInt(e.target.value) || 30 }))}
                          data-testid="input-promo-days"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{language === "tr" ? "Son Kullanma Tarihi (Opsiyonel)" : "Expiry Date (Optional)"}</Label>
                      <Input
                        type="date"
                        value={newPromoCode.expiresAt}
                        onChange={(e) => setNewPromoCode(prev => ({ ...prev, expiresAt: e.target.value }))}
                        data-testid="input-promo-expires"
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => createPromoCodeMutation.mutate(newPromoCode)}
                      disabled={!newPromoCode.code || createPromoCodeMutation.isPending}
                      data-testid="button-save-promo"
                    >
                      {createPromoCodeMutation.isPending 
                        ? (language === "tr" ? "Oluşturuluyor..." : "Creating...") 
                        : (language === "tr" ? "Oluştur" : "Create")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="space-y-3">
                  {promoCodesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : promoCodes?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {language === "tr" ? "Henüz promosyon kodu yok" : "No promo codes yet"}
                    </div>
                  ) : (
                    promoCodes?.map((promo) => (
                      <Card key={promo.id} className="overflow-hidden" data-testid={`card-promo-${promo.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded font-mono text-sm font-bold">
                                {promo.code}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => copyToClipboard(promo.code)}
                                data-testid={`button-copy-${promo.id}`}
                              >
                                {copiedCode === promo.code ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={promo.isActive}
                                onCheckedChange={(checked) =>
                                  updatePromoCodeMutation.mutate({ id: promo.id, data: { isActive: checked } })
                                }
                                disabled={updatePromoCodeMutation.isPending}
                                data-testid={`switch-active-${promo.id}`}
                              />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    data-testid={`button-delete-promo-${promo.id}`}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {language === "tr" ? "Kodu Sil?" : "Delete Code?"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {language === "tr"
                                        ? "Bu işlem geri alınamaz."
                                        : "This action cannot be undone."}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      {language === "tr" ? "İptal" : "Cancel"}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deletePromoCodeMutation.mutate(promo.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {language === "tr" ? "Sil" : "Delete"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          
                          {promo.description && (
                            <p className="text-sm text-muted-foreground mb-2">{promo.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-2 text-xs">
                            <Badge variant={promo.isActive ? "default" : "secondary"}>
                              {promo.isActive 
                                ? (language === "tr" ? "Aktif" : "Active") 
                                : (language === "tr" ? "Pasif" : "Inactive")}
                            </Badge>
                            <Badge variant="outline">
                              {promo.remainingUses}/{promo.maxUses} {language === "tr" ? "kullanım" : "uses"}
                            </Badge>
                            <Badge variant="outline">
                              {promo.premiumDays} {language === "tr" ? "gün" : "days"}
                            </Badge>
                            {promo.expiresAt && (
                              <Badge variant={new Date(promo.expiresAt) < new Date() ? "destructive" : "outline"}>
                                {new Date(promo.expiresAt) < new Date() 
                                  ? (language === "tr" ? "Süresi Doldu" : "Expired")
                                  : new Date(promo.expiresAt).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
