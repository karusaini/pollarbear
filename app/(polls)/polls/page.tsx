"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // ✅ Fix Tooltip
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, Plus, Share } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ✅ Define Poll Data Type
interface Poll {
  id: string;
  username: string;
  question: string;
  description: string;
  category: string;
  views: number;
  created_at: string;
  total_votes: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const categories = [
  "All",
  "General",
  "Sports",
  "Tech",
  "Entertainment",
  "Politics",
];
const sortingOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "most_voted", label: "Most Voted" },
  { value: "most_viewed", label: "Most Viewed" },
];

export default function PollsPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // ✅ Fetch polls with filters & pagination
  const fetchPolls = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/polls/list", {
        params: {
          category: category === "All" ? "all" : category.toLowerCase(),
          sortBy,
          page,
          limit: 10,
          search,
        },
      });

      if (response.data.success) {
        setPolls(response.data.polls);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPolls();
  }, [category, sortBy, page]);

  // ✅ Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPolls();
  };

  // ✅ Handle copying poll link
  const handleCopyLink = (pollId: string) => {
    const pollUrl = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(pollUrl);
    toast({
      title: "Link copied!",
      description: "Poll link copied to clipboard.",
    });
  };

  return (
    <TooltipProvider>
      <main className="container mx-auto px-4 py-6">
        {/* ✅ Top Row: Create Poll Button */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => router.push("/create")}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Poll
          </Button>
        </div>

        {/* ✅ Category Selection */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              className="rounded-full"
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* ✅ Search & Sorting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          {/* 🔍 Search Bar */}
          <form className="flex w-full md:w-auto gap-2" onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder="Search polls..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </form>

          {/* 🔽 Sorting */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-52">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortingOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ✅ Polls List */}
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : polls.length === 0 ? (
          <p className="text-center text-gray-600">No polls found.</p>
        ) : (
          <div className="space-y-4">
            {polls.map((poll) => (
              <Card
                key={poll.id}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <CardContent
                  className="p-4 flex items-center justify-between"
                  onClick={() => router.push(`/poll/${poll.id}`)}
                >
                  {/* 📝 Left Side - Poll Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold truncate max-w-xs">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{poll.question}</span>
                        </TooltipTrigger>
                        <TooltipContent>{poll.question}</TooltipContent>
                      </Tooltip>
                    </h3>
                    <p className="text-sm text-gray-500">
                      by <span className="font-medium">{poll.username}</span>
                    </p>
                    <p className="text-sm text-gray-600 truncate max-w-xs">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{poll.description}</span>
                        </TooltipTrigger>
                        <TooltipContent>{poll.description}</TooltipContent>
                      </Tooltip>
                    </p>
                  </div>

                  {/* 📊 Right Side - Stats & Share */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Votes</p>
                      <p className="text-lg font-semibold">
                        {poll.total_votes}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Views</p>
                      <p className="text-lg font-semibold">{poll.views}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(poll.id);
                      }}
                      className="text-gray-500 hover:text-gray-800 transition"
                    >
                      <Share className="h-5 w-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </TooltipProvider>
  );
}
