import type { Metadata } from "next";
import styles from "../legal.module.css";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "Data & Privacy — WSTAR AI Solutions",
    description:
        "How WSTAR AI Solutions collects, handles, and protects client data during intake, sandbox engagements, and production deployments.",
};

export default function AiSolutionsPrivacyPage() {
    return (
        <main className={`section section--dark ${styles.legalPage}`}>
            <div className={`container ${styles.contentContainer}`}>
                <h1>WSTAR AI Solutions — Data &amp; Privacy Policy</h1>
                <p className={styles.meta}><strong>Status:</strong> Draft — pending final review</p>

                <div className={styles.placeholderBanner}>
                    <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>
                        [PLACEHOLDER — Ibrahim to supply final policy text for each section below.
                        Section headings reflect what this page needs to cover; the body copy is a
                        structural placeholder only and has not been legally reviewed.]
                    </span>
                </div>

                <h2>1. What We Collect</h2>
                <p>
                    [PLACEHOLDER] Describe what is collected via the intake form: name, work
                    email, company, ERP/CRM stack, and workflow/bottleneck description submitted
                    on the &quot;Request a Custom Sandbox&quot; form.
                </p>

                <h2>2. How Sandbox &amp; Sprint Engagement Data Is Handled</h2>
                <p>
                    [PLACEHOLDER] Confirm and detail: sandbox and Value Validation Sprint
                    engagements run against sanitized or simulated schema fixtures only — no
                    production ERP/CRM write access is used or required, matching the claim made
                    on the AI Solutions page itself.
                </p>

                <h2>3. Data Retention &amp; Deletion</h2>
                <p>
                    [PLACEHOLDER] State how long intake and sandbox data is retained, and how a
                    prospect or client can request deletion.
                </p>

                <h2>4. No Public Model Training</h2>
                <p>
                    [PLACEHOLDER] Formal policy statement confirming client data (CAD drawings,
                    pricing tiers, vendor catalogs, ERP data) is never used to train public or
                    third-party models — backing the claim already made on the AI Solutions page.
                </p>

                <h2>5. Contact for Data Requests</h2>
                <p>
                    For questions about this policy or to make a data request, contact{" "}
                    <a href="mailto:ibrahim@wstartech.ng">ibrahim@wstartech.ng</a>.
                </p>
            </div>
        </main>
    );
}
