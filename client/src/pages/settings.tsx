import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Bell, Palette, Globe, Moon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface NotificationSettings {
  newPacks: boolean;
  weeklyReminder: boolean;
  promotions: boolean;
}

export default function Settings() {
  const [, setLocation] = useLocation();
  const { t, language, setLanguage } = useI18n();
  
  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem("magiccolors_notifications");
    return saved ? JSON.parse(saved) : {
      newPacks: true,
      weeklyReminder: true,
      promotions: false
    };
  });

  useEffect(() => {
    localStorage.setItem("magiccolors_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification(t("settings.notificationsEnabled"), {
          body: t("settings.notificationsEnabledDesc"),
          icon: "/icon.png"
        });
      }
    }
  };

  return (
    <MobileLayout showHeader={false}>
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-xl">{t("settings.title")}</h1>
        </header>

        <div className="p-4 space-y-6">
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-100">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="font-bold text-lg">{t("settings.notifications")}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.newPacks")}</p>
                  <p className="text-sm text-muted-foreground">{t("settings.newPacksDesc")}</p>
                </div>
                <Switch
                  checked={notifications.newPacks}
                  onCheckedChange={(v) => updateNotification("newPacks", v)}
                  data-testid="switch-new-packs"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.weeklyReminder")}</p>
                  <p className="text-sm text-muted-foreground">{t("settings.weeklyReminderDesc")}</p>
                </div>
                <Switch
                  checked={notifications.weeklyReminder}
                  onCheckedChange={(v) => updateNotification("weeklyReminder", v)}
                  data-testid="switch-weekly-reminder"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.promotions")}</p>
                  <p className="text-sm text-muted-foreground">{t("settings.promotionsDesc")}</p>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onCheckedChange={(v) => updateNotification("promotions", v)}
                  data-testid="switch-promotions"
                />
              </div>

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={requestNotificationPermission}
                data-testid="button-enable-notifications"
              >
                {t("settings.enableNotifications")}
              </Button>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-100">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="font-bold text-lg">{t("settings.language")}</h2>
            </div>

            <div className="space-y-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setLanguage("en")}
                data-testid="button-lang-en"
              >
                🇬🇧 English
              </Button>
              <Button
                variant={language === "tr" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setLanguage("tr")}
                data-testid="button-lang-tr"
              >
                🇹🇷 Türkçe
              </Button>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setLocation("/premium")}
              data-testid="button-premium"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100">
                  <Palette className="h-5 w-5 text-amber-600" />
                </div>
                <span className="font-bold">{t("settings.managePremium")}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => {
                localStorage.removeItem("magiccolors_onboarding_complete");
                setLocation("/onboarding");
              }}
              data-testid="button-replay-onboarding"
            >
              {t("settings.replayOnboarding")}
            </Button>
          </motion.section>
        </div>
      </div>
    </MobileLayout>
  );
}
