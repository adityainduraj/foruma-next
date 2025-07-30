import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json(
            { error: "URL parameter is required" },
            { status: 400 }
        );
    }

    try {
        // Add timeout and better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`Failed to fetch ${url} with status: ${response.status}`);
            return NextResponse.json({
                title: url,
                description: `Unable to fetch page information. Status: ${response.status}`,
                image: "",
            });
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("text/html")) {
            // If it's not HTML, return basic info
            return NextResponse.json({
                title: url,
                description: "This link does not point to an HTML page.",
                image: "",
            });
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract Open Graph and meta data
        const ogTitle =
            $('meta[property="og:title"]').attr("content") ||
            $("title").text() ||
            url;

        const ogDescription =
            $('meta[property="og:description"]').attr("content") ||
            $('meta[name="description"]').attr("content") ||
            "";

        const ogImage =
            $('meta[property="og:image"]').attr("content") ||
            $('meta[name="twitter:image"]').attr("content") ||
            "";

        return NextResponse.json({
            title: ogTitle.trim(),
            description: ogDescription.trim(),
            image: ogImage,
        });
    } catch (error) {
        console.error("Error fetching Open Graph data:", error);

        // Return fallback data
        return NextResponse.json({
            title: url,
            description: "Unable to fetch page information.",
            image: "",
        });
    }
}
