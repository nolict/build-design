import { NextRequest, NextResponse } from "next/server";
import { getPublishedDesigns, getDesignBySlug } from "@/lib/actions/design-actions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  try {
    if (slug) {
      // Get single design by slug
      const design = await getDesignBySlug(slug);
      return NextResponse.json(design);
    }

    // Get all published designs
    const designs = await getPublishedDesigns();
    return NextResponse.json(designs);
  } catch (error) {
    console.error("API Error:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Design not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}