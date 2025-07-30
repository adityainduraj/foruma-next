import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json(
            { error: "URL parameter is required" },
            { status: 400 }
        );
    }

    const apiKey = process.env.LINKPREVIEW_API_KEY;
    if (!apiKey) {
        console.error("LinkPreview API key not configured");
        return NextResponse.json({
            title: url,
            description: "Link preview service unavailable.",
            image: "",
        });
    }

    try {
        const response = await fetch(
            `https://api.linkpreview.net/?q=${encodeURIComponent(url)}`,
            {
                headers: {
                    "X-Linkpreview-Api-Key": apiKey,
                },
            }
        );

        if (!response.ok) {
            console.error(`LinkPreview API failed with status: ${response.status}`);
            return NextResponse.json({
                title: url,
                description: `Unable to fetch page information. API Status: ${response.status}`,
                image: "",
            });
        }

        const data = await response.json();

        return NextResponse.json({
            title: data.title || url,
            description: data.description || "",
            image: data.image || "",
        });
    } catch (error) {
        console.error("Error fetching from LinkPreview API:", error);

        return NextResponse.json({
            title: url,
            description: "Unable to fetch page information.",
            image: "",
        });
    }
}