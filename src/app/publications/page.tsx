import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import { FileText, Calendar } from "lucide-react";
import { getPublishedAnnouncements } from "@/lib/sanity";
import styles from "./publications.module.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Publications & Announcements — WSTAR",
  description:
    "Official announcements, press releases, and publications from WSTAR Technologies.",
};

const CATEGORY_LABELS: Record<string, string> = {
  announcement: "Announcement",
  "press-release": "Press Release",
  publication: "Publication",
  report: "Report",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatFileSize(bytes?: number): string | null {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function PublicationsPage() {
  const announcements = await getPublishedAnnouncements();

  return (
    <>
      <HeroSection
        label="Newsroom"
        title={
          <>
            Publications &amp; <span>Announcements.</span>
          </>
        }
        description="Official statements, press releases, and publications from WSTAR Technologies — straight from the source."
        compact
      />

      <section className="section section--dark">
        <div className="container">
          {announcements.length === 0 ? (
            <div className={styles.emptyState}>
              <FileText size={28} color="var(--gray-500)" style={{ marginBottom: 12 }} />
              <h3>Nothing published yet</h3>
              <p>Check back soon for official announcements and publications from WSTAR.</p>
            </div>
          ) : (
            <div className={styles.list}>
              {announcements.map((item) => {
                const fileSize = formatFileSize(item.pdfSize);
                return (
                  <article key={item._id} className={styles.card}>
                    <div className={styles.cardTop}>
                      <span className={styles.categoryBadge}>
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <span className={styles.date}>
                        <Calendar size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>

                    <h2 className={styles.cardTitle}>{item.title}</h2>
                    {item.excerpt && <p className={styles.excerpt}>{item.excerpt}</p>}

                    <div className={styles.cardFooter}>
                      <span className={styles.meta}>
                        {item.author ? `${item.author}` : "WSTAR Technologies"}
                        {fileSize ? ` · PDF · ${fileSize}` : ""}
                      </span>

                      {item.pdfUrl && (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.pdfLink}
                        >
                          <FileText size={15} />
                          View PDF
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
