import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/os", "/os/", "/api/", "/publications/admin"],
            },
        ],
        sitemap: "https://wstartech.ng/sitemap.xml",
    };
}
