import { connectDB } from "@/lib/db";
import Note from "@/models/Notes";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const notes = await Note.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Get Notes Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    const note = await Note.create({
      title,
      content,
      userId: session.user.id,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST Note Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
