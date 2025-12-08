import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Wand2, Palette, Share2, Sparkles } from "lucide-react";

interface OnboardingSlide {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  gradient: string;
}

const slides: OnboardingSlide[] = [
  {
    icon: <Wand2 className="h-16 w-16" />,
    titleKey: "onboarding.slide1.title",
    descKey: "onboarding.slide1.desc",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: <Palette className="h-16 w-16" />,
    titleKey: "onboarding.slide2.title",
    descKey: "onboarding.slide2.desc",
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    icon: <Share2 className="h-16 w-16" />,
    titleKey: "onboarding.slide3.title",
    descKey: "onboarding.slide3.desc",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Sparkles className="h-16 w-16" />,
    titleKey: "onboarding.slide4.title",
    descKey: "onboarding.slide4.desc",
    gradient: "from-amber-500 to-orange-500"
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    localStorage.setItem("magiccolors_onboarding_complete", "true");
    setLocation("/");
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              className={`mb-8 rounded-full bg-gradient-to-br ${slide.gradient} p-8 text-white shadow-2xl`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {slide.icon}
            </motion.div>

            <motion.h1
              className="mb-4 text-3xl font-extrabold text-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t(slide.titleKey)}
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground max-w-xs leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t(slide.descKey)}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-32 pt-4">
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
              data-testid={`dot-indicator-${index}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {!isLastSlide && (
            <Button
              variant="ghost"
              className="flex-1 h-14 text-lg font-semibold"
              onClick={handleSkip}
              data-testid="button-skip"
            >
              {t("onboarding.skip")}
            </Button>
          )}
          <Button
            className={`h-14 text-lg font-bold rounded-2xl shadow-lg ${
              isLastSlide ? "flex-1" : "flex-[2]"
            }`}
            onClick={handleNext}
            data-testid="button-next"
          >
            {isLastSlide ? t("onboarding.start") : t("onboarding.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
