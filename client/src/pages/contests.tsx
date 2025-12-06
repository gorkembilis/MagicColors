import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Heart, Clock, Medal, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { format, differenceInDays, differenceInHours } from "date-fns";

interface Contest {
  id: number;
  theme: string;
  themeKey: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Submission {
  id: number;
  contestId: number;
  userId: string;
  imageUrl: string;
  title: string | null;
  voteCount: number;
  userName: string | null;
}

export default function Contests() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ contest: Contest; submissions: Submission[] } | null>({
    queryKey: ["/api/contests/active"],
    queryFn: async () => {
      const res = await fetch("/api/contests/active");
      if (!res.ok) throw new Error("Failed to fetch contest");
      return res.json();
    },
  });

  const voteMutation = useMutation({
    mutationFn: async (submissionId: number) => {
      const res = await fetch(`/api/contests/submissions/${submissionId}/vote`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contests/active"] });
    },
  });

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const days = differenceInDays(end, now);
    const hours = differenceInHours(end, now) % 24;
    
    if (days > 0) return `${days} ${t("contest.days")} ${hours} ${t("contest.hours")}`;
    if (hours > 0) return `${hours} ${t("contest.hours")}`;
    return t("contest.ended");
  };

  const handleVote = (submissionId: number) => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    voteMutation.mutate(submissionId);
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </MobileLayout>
    );
  }

  if (!data || !data.contest) {
    return (
      <MobileLayout>
        <div className="px-4 py-8 text-center">
          <div className="p-4 rounded-full bg-muted inline-block mb-4">
            <Trophy className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">{t("contest.noActive")}</h2>
          <p className="text-muted-foreground mb-4">{t("contest.noActiveDesc")}</p>
          <Link href="/">
            <Button>{t("contest.backHome")}</Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  const { contest, submissions } = data;
  const topThree = submissions.slice(0, 3);

  return (
    <MobileLayout>
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-purple-500 rounded-2xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">{t("contest.weeklyContest")}</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{t(`contest.theme.${contest.themeKey}`) || contest.theme}</h1>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{getTimeRemaining(contest.endDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{submissions.length} {t("contest.participants")}</span>
            </div>
          </div>
        </motion.div>

        {topThree.length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Medal className="h-5 w-5 text-yellow-500" />
              {t("contest.leaderboard")}
            </h2>
            <div className="space-y-3">
              {topThree.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`overflow-hidden ${index === 0 ? "ring-2 ring-yellow-400" : ""}`}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img 
                          src={submission.imageUrl} 
                          alt={submission.title || "Submission"} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{submission.userName || t("contest.anonymous")}</p>
                        <p className="text-sm text-muted-foreground">{submission.voteCount} {t("contest.votes")}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(submission.id)}
                        disabled={voteMutation.isPending}
                        className="flex-shrink-0"
                        data-testid={`vote-submission-${submission.id}`}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {t("contest.vote")}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {submissions.length > 3 && (
          <section className="mb-6">
            <h2 className="font-bold text-lg mb-3">{t("contest.allSubmissions")}</h2>
            <div className="grid grid-cols-2 gap-3">
              {submissions.slice(3).map((submission) => (
                <motion.div
                  key={submission.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={submission.imageUrl} 
                        alt={submission.title || "Submission"} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <div className="flex items-center justify-between text-white">
                          <span className="text-xs truncate">{submission.userName || t("contest.anonymous")}</span>
                          <span className="text-xs flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {submission.voteCount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => handleVote(submission.id)}
                        disabled={voteMutation.isPending}
                        data-testid={`vote-submission-${submission.id}`}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {t("contest.vote")}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-6">
          <Card className="bg-gradient-to-r from-secondary/20 to-primary/10">
            <CardContent className="p-4">
              <h3 className="font-bold mb-2">{t("contest.howToParticipate")}</h3>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                  {t("contest.step1")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                  {t("contest.step2")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                  {t("contest.step3")}
                </li>
              </ol>
              <Link href="/generate">
                <Button className="w-full mt-4" data-testid="button-join-contest">
                  {t("contest.joinNow")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </MobileLayout>
  );
}
