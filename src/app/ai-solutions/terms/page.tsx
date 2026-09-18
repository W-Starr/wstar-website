import type { Metadata } from "next";
import styles from "../legal.module.css";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service — WSTAR AI Solutions",
    description:
        "Terms of Service and Data Processing Addendum governing WSTAR AI Solutions engagements.",
};

export default function AiSolutionsTermsPage() {
    return (
        <main className={`section section--dark ${styles.legalPage}`}>
            <div className={`container ${styles.contentContainer}`}>
                <h1>WSTAR AI Solutions — Terms of Service &amp; DPA</h1>
                <p className={styles.meta}><strong>Status:</strong> Draft — pending final review</p>

                <div className={styles.placeholderBanner}>
                    <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>
                        [PLACEHOLDER — Ibrahim to supply final Terms of Service and Data
                        Processing Addendum text. This is a structural draft only, not reviewed
                        legal language, and should not be relied on until replaced.]
                    </span>
                </div>

                <h2>1. Engagement Structure</h2>
                <p>
                    [PLACEHOLDER] Describe the Value Validation Sprint → full deployment
                    engagement model, scope of work, and fee structure at a high level.
                </p>

                <h2>2. Data Processing</h2>
                <p>
                    [PLACEHOLDER] Data Processing Addendum terms: what client data is processed,
                    on whose behalf, sub-processors (if any), and security obligations.
                </p>

                <h2>3. Intellectual Property</h2>
                <p>
                    [PLACEHOLDER] Ownership of client data, deliverables, and any reusable
                    tooling/IP developed during an engagement.
                </p>

                <h2>4. Liability &amp; Warranties</h2>
                <p>
                    [PLACEHOLDER] Standard limitation of liability and warranty language —
                    requires legal review before publishing.
                </p>

                <h2>5. Contact</h2>
                <p>
                    Questions about these terms: <a href="mailto:solutions@wstartech.ng">solutions@wstartech.ng</a>.
                </p>
            </div>
        </main>
    );
}
