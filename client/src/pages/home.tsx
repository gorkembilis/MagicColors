import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { packs, Difficulty } from "@/lib/mock-data";
import { puzzlePacks } from "@/lib/puzzle-data";
import { Wand2, Lock, ArrowRight, Globe, Trophy, Sparkles, Palette, Download, Share2, ChevronLeft, ChevronRight, Search, X, Puzzle } from "lucide-react";
import { Link, useLocation } from "wouter";

import sliderImg1 from "@assets/generated_images/child_coloring_with_magic.png";
import sliderImg2 from "@assets/generated_images/digital_coloring_tablet.png";
import sliderImg3 from "@assets/generated_images/print_and_download_art.png";
import sliderImg4 from "@assets/generated_images/share_artwork_community.png";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";

type DifficultyFilter = 'all' | Difficulty;
type TabType = 'coloring' | 'puzzle';

export default function Home() {
  const [location, setLocation] = useLocation();
  const [prompt, setPrompt] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, language, setLanguage } = useI18n();
  const { user } = useAuth();

  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab') as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(tabParam === 'puzzle' ? 'puzzle' : 'coloring');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const newUrl = tab === 'coloring' ? '/' : '/?tab=puzzle';
    window.history.replaceState({}, '', newUrl);
  };

  const slides = [
    {
      icon: Sparkles,
      title: t("slider.slide1.title"),
      description: t("slider.slide1.desc"),
      color: "from-primary to-purple-500",
      image: sliderImg1
    },
    {
      icon: Palette,
      title: t("slider.slide2.title"),
      description: t("slider.slide2.desc"),
      color: "from-green-500 to-teal-500",
      image: sliderImg2
    },
    {
      icon: Download,
      title: t("slider.slide3.title"),
      description: t("slider.slide3.desc"),
      color: "from-orange-500 to-red-500",
      image: sliderImg3
    },
    {
      icon: Share2,
      title: t("slider.slide4.title"),
      description: t("slider.slide4.desc"),
      color: "from-blue-500 to-indigo-500",
      image: sliderImg4
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const filteredPacks = packs.filter(p => {
    const matchesDifficulty = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
    const packName = t(`pack.${p.id}`).toLowerCase();
    const matchesSearch = searchQuery === "" || packName.includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const filteredPuzzlePacks = puzzlePacks.filter(p => {
    const matchesDifficulty = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
    const packName = p.id.toLowerCase();
    const matchesSearch = searchQuery === "" || packName.includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const difficultyColors: Record<Difficulty, string> = {
    easy: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    hard: "bg-red-100 text-red-700 border-red-200"
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setLocation(`/generate?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

  return (
    <MobileLayout 
      headerAction={
        <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-8 px-2 text-xs font-bold border border-border">
          <Globe className="mr-1 h-3 w-3" /> {language.toUpperCase()}
        </Button>
      }
    >
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden px-4 pt-6 pb-4">
        <div className="relative">
          {/* Slider */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Background Image */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={slides[currentSlide].image} 
                    alt={slides[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center shadow-lg`}>
                      {(() => {
                        const IconComponent = slides[currentSlide].icon;
                        return <IconComponent className="h-5 w-5 text-white" />;
                      })()}
                    </div>
                    <h2 className="text-lg font-bold">
                      {slides[currentSlide].title}
                    </h2>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {slides[currentSlide].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors z-10"
              data-testid="slider-prev"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors z-10"
              data-testid="slider-next"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? "w-6 bg-white" 
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  data-testid={`slider-dot-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Generator - Sihir Yarat */}
      <section className="px-4 pb-4">
        <motion.form 
          onSubmit={handleGenerate}
          className="relative mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-purple-600 via-primary to-pink-500 rounded-3xl p-5 text-white shadow-xl border-2 border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Wand2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{t('home.hero.magicTitle') || 'Sihir Yarat'}</h3>
                <p className="text-white/80 text-xs">{t('home.hero.aiSubtitle')}</p>
              </div>
              <Sparkles className="h-6 w-6 ml-auto text-yellow-300 animate-pulse" />
            </div>
            <div className="flex gap-2">
              <Input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('home.hero.placeholder')}
                className="h-12 rounded-xl border-2 border-white/30 bg-white text-gray-800 placeholder:text-gray-400 text-sm font-medium shadow-inner"
                data-testid="input-magic-prompt"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-6 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300 shadow-lg border-2 border-yellow-300"
                data-testid="button-create-magic"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {t('home.hero.button')}
              </Button>
            </div>
          </div>
        </motion.form>
      </section>

      {/* Tab Navigation */}
      <section className="px-4 pb-2">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => handleTabChange('coloring')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'coloring' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-500'
            }`}
            data-testid="tab-coloring"
          >
            <Palette className="h-5 w-5" />
            {t('nav.coloring')}
          </button>
          <button
            onClick={() => handleTabChange('puzzle')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'puzzle' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-500'
            }`}
            data-testid="tab-puzzle"
          >
            <Puzzle className="h-5 w-5" />
            {t('nav.puzzles')}
          </button>
        </div>
      </section>

      {/* Packs Section */}
      <section className="px-4 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {activeTab === 'coloring' ? t('home.packs.title') : t('nav.puzzles')}
            </h2>
            <p className="text-xs text-muted-foreground">
              {activeTab === 'coloring' ? t('home.packs.subtitle') : t('puzzle.subtitle') || 'Eğlenceli puzzle oyunları'}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-primary px-2">
            {t('home.packs.viewAll')} <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        {/* Difficulty Filter with Search */}
        <div className="mb-4">
          {searchOpen ? (
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 rounded-full bg-white"
                  autoFocus
                  data-testid="input-search-packs"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="h-10 w-10 rounded-full"
                data-testid="button-close-search"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <Button
                  key={diff}
                  variant={difficultyFilter === diff ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficultyFilter(diff)}
                  className={`h-8 px-3 text-xs font-medium rounded-full whitespace-nowrap ${
                    difficultyFilter === diff ? "" : "bg-white"
                  }`}
                  data-testid={`filter-difficulty-${diff}`}
                >
                  {t(`difficulty.${diff}`)}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="h-8 px-3 text-xs font-medium rounded-full whitespace-nowrap bg-white ml-auto"
                data-testid="button-open-search"
              >
                <Search className="h-4 w-4 mr-1" />
                {t('search.button')}
              </Button>
            </div>
          )}
        </div>

        {/* Coloring Packs */}
        {activeTab === 'coloring' && (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3"
          >
            {filteredPacks.map((pack) => (
              <motion.div key={pack.id} variants={item}>
                <Link href={`/pack/${pack.id}`}>
                  <Card className="group cursor-pointer overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md bg-white active:scale-95 duration-100">
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      <img 
                        src={pack.cover} 
                        alt={pack.title}
                        className="h-full w-full object-cover"
                      />
                      {pack.isPremium && !user?.isPremium && (
                        <div className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-secondary backdrop-blur-sm">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                      {pack.isPremium && user?.isPremium && (
                        <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg border border-white">
                          Premium
                        </div>
                      )}
                      {!pack.isPremium && (
                        <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg border border-white animate-pulse">
                          {t('home.packs.free')}
                        </div>
                      )}
                      {/* Difficulty Badge */}
                      <div className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold border ${difficultyColors[pack.difficulty]}`}>
                        {t(`difficulty.${pack.difficulty}`)}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="mb-0.5 text-sm font-bold leading-none truncate">{t(`pack.${pack.id}`)}</h3>
                      <p className="text-[10px] text-muted-foreground">{pack.count} {t('home.packs.pages')}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Puzzle Packs */}
        {activeTab === 'puzzle' && (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3"
          >
            {filteredPuzzlePacks.map((pack) => (
              <motion.div key={pack.id} variants={item}>
                <Link href={`/puzzle-pack/${pack.id}`}>
                  <Card className="group cursor-pointer overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md bg-white active:scale-95 duration-100">
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      <img 
                        src={pack.cover} 
                        alt={pack.id}
                        className="h-full w-full object-cover"
                      />
                      {pack.isPremium && !user?.isPremium && (
                        <div className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-secondary backdrop-blur-sm">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                      {pack.isPremium && user?.isPremium && (
                        <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg border border-white">
                          Premium
                        </div>
                      )}
                      {!pack.isPremium && (
                        <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg border border-white animate-pulse">
                          {t('home.packs.free')}
                        </div>
                      )}
                      {/* Difficulty Badge */}
                      <div className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold border ${difficultyColors[pack.difficulty]}`}>
                        {t(`difficulty.${pack.difficulty}`)}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="mb-0.5 text-sm font-bold leading-none truncate">
                        {t(`puzzle.${pack.id}`) !== `puzzle.${pack.id}` ? t(`puzzle.${pack.id}`) : pack.id.replace('puzzle-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">{pack.count} puzzle</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </MobileLayout>
  );
}
