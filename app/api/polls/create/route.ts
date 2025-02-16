import supabaseAdmin from "@/utils/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate received data
    const { name, category, description, question, options } = body;

    if (!name || !question || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    // ✅ Insert poll into `polls` table
    const { data: pollData, error: pollError } = await supabaseAdmin
      .from("polls")
      .insert([
        {
          username: name,
          category,
          description,
          question,
        },
      ])
      .select("id")
      .single();

    if (pollError) throw pollError;

    const pollId = pollData.id;

    // ✅ Insert poll options into `poll_options` table
    const optionRecords = options.map((option) => ({
      poll_id: pollId,
      option,
    }));

    const { error: optionsError } = await supabaseAdmin
      .from("poll_options")
      .insert(optionRecords);

    if (optionsError) throw optionsError;

    // ✅ Success response
    return NextResponse.json({ success: true, pollId });
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
