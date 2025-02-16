import { NextResponse } from "next/server";
import supabaseAdmin from "@/utils/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pollId, optionId } = body;

    // ✅ Validate input
    if (!pollId || !optionId) {
      return NextResponse.json(
        { success: false, error: "Missing pollId or optionId" },
        { status: 400 }
      );
    }

    // ✅ Ensure pollId is a valid UUID
    if (!/^[0-9a-fA-F-]{36}$/.test(pollId)) {
      return NextResponse.json(
        { success: false, error: "Invalid pollId format" },
        { status: 400 }
      );
    }

    // ✅ Check if poll exists
    const { data: poll, error: pollError } = await supabaseAdmin
      .from("polls")
      .select("id")
      .eq("id", pollId)
      .single();

    if (pollError || !poll) {
      return NextResponse.json(
        { success: false, error: "Poll not found" },
        { status: 404 }
      );
    }

    // ✅ Check if option exists and belongs to the poll
    const { data: option, error: optionError } = await supabaseAdmin
      .from("poll_options")
      .select("id, votes_count")
      .eq("id", optionId) // ✅ `option_id` should reference `poll_options.id` (bigint)
      .eq("poll_id", pollId)
      .single();

    if (optionError || !option) {
      return NextResponse.json(
        { success: false, error: "Option not found" },
        { status: 404 }
      );
    }

    // ✅ Increment vote count for the selected option
    const { error: voteError } = await supabaseAdmin
      .from("poll_options")
      .update({ votes_count: option.votes_count + 1 })
      .eq("id", optionId);

    if (voteError) throw voteError;

    // ✅ Insert vote log (only `poll_id` and `option_id`)
    const { error: logError } = await supabaseAdmin
      .from("poll_votes_logs")
      .insert([{ poll_id: pollId, option_id: optionId }]);

    if (logError) throw logError;

    // ✅ Success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error registering vote:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
