import type { MetadataRoute } from "next";

const BASE_URL = "https://wstartech.ng";

const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/ai-solutions", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/products/ace-acad", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/products/plantiq", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/investors", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/publications", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/ai-solutions/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/ai-solutions/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/products/ace-acad/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/products/ace-acad/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/products/ace-acad/acceptable-use", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/products/ace-acad/account-deletion", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
    return staticRoutes.map((route) => ({
        url: `${BASE_URL}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
