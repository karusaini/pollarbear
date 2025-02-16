import { NextResponse } from "next/server";
import supabaseAdmin from "@/utils/supabase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pollId = searchParams.get("pollId");
    const registerView = searchParams.get("registerView") === "true"; // ✅ Register view only if explicitly requested

    if (!pollId) {
      return NextResponse.json(
        { success: false, error: "Missing pollId" },
        { status: 400 }
      );
    }

    // ✅ Fetch poll details
    const { data: poll, error: pollError } = await supabaseAdmin
      .from("polls")
      .select("*")
      .eq("id", pollId)
      .single();

    if (pollError || !poll) {
      return NextResponse.json(
        { success: false, error: "Poll not found" },
        { status: 404 }
      );
    }

    // ✅ Fetch poll options
    const { data: options, error: optionsError } = await supabaseAdmin
      .from("poll_options")
      .select("id, option, votes_count")
      .eq("poll_id", pollId)
      .order("id");

    if (optionsError) throw optionsError;

    // ✅ Conditionally register the view (only on page load)
    if (registerView) {
      const { error: viewError } = await supabaseAdmin
        .from("polls")
        .update({ views: poll.views + 1 })
        .eq("id", pollId);

      if (viewError) console.error("Error updating views:", viewError); // Log error but don’t block response
    }

    // ✅ Return poll with options
    return NextResponse.json({
      success: true,
      poll: {
        ...poll,
        views: registerView ? poll.views + 1 : poll.views, // Reflect updated views only if registered
        options,
      },
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
