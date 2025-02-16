"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { use } from "react";
import axios from "axios";
import moment from "moment";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, Share, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // ✅ Import ShadCN toast

interface PollOption {
  id: number;
  option: string;
  votes_count: number;
}

interface PollData {
  id: string;
  username: string;
  category: string;
  description: string;
  question: string;
  views: number;
  created_at: string;
  options: PollOption[];
}

export default function PollPage({
  params,
}: {
  params: Promise<{ pollId: string }>;
}) {
  const { pollId } = use(params);
  const { toast } = useToast(); // ✅ ShadCN toast hook
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [votedOption, setVotedOption] = useState<number | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [voting, setVoting] = useState<number | null>(null);

  const pollUrl = typeof window !== "undefined" ? window.location.href : "";

  // ✅ Fetch poll data (with optional view registration)
  const fetchPoll = async (registerView: boolean = false): Promise<void> => {
    try {
      setRefreshing(true);
      const response = await axios.get(
        `/api/polls/view?pollId=${pollId}&registerView=${registerView}`
      );
      if (response.data.success) {
        setPoll(response.data.poll);
        setTotalVotes(
          response.data.poll.options.reduce(
            (sum: number, opt: PollOption) => sum + opt.votes_count,
            0
          )
        );
      }
    } catch (error) {
      console.error("Error fetching poll:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
      setVoting(null);
    }
  };

  useEffect(() => {
    fetchPoll(true);
    const interval = setInterval(() => fetchPoll(false), 5000);
    return () => clearInterval(interval);
  }, [pollId]);

  const handleVote = async (optionId: number) => {
    if (votedOption || voting !== null) return;

    setVoting(optionId);

    try {
      const response = await axios.post("/api/polls/register-vote", {
        pollId,
        optionId,
      });
      if (response.data.success) {
        setVotedOption(optionId);
        await fetchPoll(false);
      }
    } catch (error) {
      console.error("Error registering vote:", error);
    }
  };

  // ✅ Copy poll link to clipboard and show ShadCN toast
  const handleCopyLink = () => {
    navigator.clipboard.writeText(pollUrl);
    toast({
      title: "Link copied!",
      description: "The poll link has been copied to your clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-600">Poll not found.</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center p-6 bg-white">
      <Card className="w-full max-w-lg shadow-md border border-gray-200 rounded-xl bg-white">
        <CardContent className="p-6">
          {/* ✅ Poll Meta Info Inside the Card */}
          <div className="flex justify-between items-center text-gray-600 text-sm mb-4">
            <span>📅 {moment(poll.created_at).format("MMMM D, YYYY")}</span>
            <div className="flex items-center gap-3">
              <span>👀 {poll.views} Views</span>
              {/* ✅ Share Button */}
              <button
                onClick={handleCopyLink}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Poll Header */}
          <h2 className="text-2xl font-bold text-gray-900 text-left mb-0">
            {poll.question}
          </h2>

          {/* Poll Details */}
          <p className="text-gray-600 text-xs text-left mb-3">
            by <strong>{poll.username}</strong>
          </p>
          <p className="text-gray-600 text-sm text-left">
            {poll.description || "No description provided."}
          </p>

          {/* Refreshing Indicator */}
          <div className="flex items-center justify-start gap-2 mt-4">
            <p className="font-semibold text-gray-700">
              Total Votes: {totalVotes}
            </p>
            <RefreshCcw
              className={`h-5 w-5 cursor-pointer transition-transform ${
                refreshing ? "animate-spin text-blue-500" : "text-gray-500"
              }`}
              onClick={() => fetchPoll(false)}
            />
          </div>

          {/* Poll Options */}
          <div className="mt-6 space-y-3">
            {poll.options.map((opt) => {
              const votePercentage = totalVotes
                ? Math.round((opt.votes_count / totalVotes) * 100)
                : 0;
              const isUserSelected = votedOption === opt.id;
              const isLoading = voting === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  disabled={!!votedOption || voting !== null}
                  className={`relative w-full flex items-center justify-between p-3 border rounded-lg transition-all duration-300
                  ${isUserSelected ? "border-blue-600" : "border-gray-300"}
                  bg-white hover:bg-gray-100 disabled:cursor-not-allowed`}
                  style={{
                    background: votedOption
                      ? `linear-gradient(to right, #f9f9f9 ${votePercentage}%, #ffffff ${votePercentage}%)`
                      : "",
                  }}
                >
                  <span className="relative z-10 text-gray-800 font-medium">
                    {opt.option}
                  </span>
                  {votedOption ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 text-sm font-semibold">
                        {votePercentage}%
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({opt.votes_count} votes)
                      </span>
                    </div>
                  ) : isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
