import { NextResponse } from "next/server";
import supabaseAdmin from "@/utils/supabase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "all"; // ✅ Filter by category
    const sortBy = searchParams.get("sortBy") || "newest"; // ✅ Sorting type
    const page = parseInt(searchParams.get("page") || "1", 10); // ✅ Current page
    const limit = parseInt(searchParams.get("limit") || "10", 10); // ✅ Items per page
    const searchQuery = searchParams.get("search")?.trim().toLowerCase() || ""; // ✅ Search term

    const offset = (page - 1) * limit; // ✅ Pagination offset calculation

    let query = supabaseAdmin
      .from("polls")
      .select(
        "id, username, question, description, views, created_at, category, options:poll_options(votes_count)",
        { count: "exact" }
      );

    // ✅ Filter by category if not "all"
    if (category !== "all") {
      query = query.ilike("category", category);
    }

    // ✅ Search by title or description
    if (searchQuery) {
      query = query.or(
        `question.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      );
    }

    // ✅ Execute query with pagination
    const {
      data: polls,
      count,
      error,
    } = await query.range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // ✅ Format response and calculate total votes
    const formattedPolls = polls.map((poll) => ({
      id: poll.id,
      username: poll.username,
      question: poll.question,
      description: poll.description,
      views: poll.views,
      created_at: poll.created_at,
      category: poll.category, // ✅ Include category in response
      total_votes: poll.options.reduce((sum, opt) => sum + opt.votes_count, 0),
    }));

    // ✅ Sorting logic
    if (sortBy === "newest") {
      formattedPolls.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "oldest") {
      formattedPolls.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortBy === "most_voted") {
      formattedPolls.sort((a, b) => b.total_votes - a.total_votes);
    } else if (sortBy === "most_viewed") {
      formattedPolls.sort((a, b) => b.views - a.views);
    }

    return NextResponse.json({
      success: true,
      polls: formattedPolls,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count! / limit),
        totalItems: count,
      },
    });
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
