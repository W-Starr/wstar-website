import styles from '../privacy/privacy.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Academic & AI Policy - Ace-Acad | WSTAR',
    description: 'Acceptable Use and Academic AI Policy for Ace-Acad by WSTAR, detailing academic integrity, prohibited technical conduct, and AI content transparency.',
};

export default function AcceptableUsePage() {
    return (
        <main className={`section ${styles.privacyPage}`}>
            <div className={`container ${styles.contentContainer}`}>
                <h1>Acceptable Use &amp; Academic AI Policy</h1>
                <p><strong>Effective Date:</strong> August 17, 2026</p>
                <p><strong>Last Updated:</strong> August 17, 2026</p>
                <p><strong>Version:</strong> 1.0.0</p>

                <h2>1. PURPOSE &amp; PHILOSOPHY</h2>
                <p>
                    <strong>Ace-Acad</strong> was created by <strong>WSTAR</strong> to empower Nigerian university students to achieve academic excellence through structured, disciplined, and accessible study methods. This Policy outlines our standards for academic integrity and details how artificial intelligence technologies are responsibly applied.
                </p>

                <h2>2. ACADEMIC INTEGRITY STANDARDS</h2>
                <p>
                    Ace-Acad is an active-recall study companion. It is designed to reinforce your understanding—never as a tool to bypass genuine learning.
                </p>
                <ul>
                    <li><strong>No Examination Malpractice:</strong> Ace-Acad must never be accessed or used during active, proctored university semester examinations, mid-term tests, or continuous assessment evaluations where mobile devices are prohibited.</li>
                    <li><strong>Authentic Learning:</strong> AI-assisted summaries and study guides should supplement, not replace, your required reading of prescribed university textbooks and attendance at official lectures.</li>
                </ul>

                <h2>3. TECHNICAL CODE OF CONDUCT</h2>
                <p>
                    In compliance with the <strong>Cybercrimes (Prohibition, Prevention, etc.) Act 2015 (as amended 2024)</strong>:
                </p>
                <ul>
                    <li>You may not decompile, disassemble, reverse engineer, or extract source code from the mobile app.</li>
                    <li>You may not deploy automated scrapers, crawlers, or extraction bots against our course repositories or quiz databases.</li>
                    <li>You may not tamper with network requests or attempt to spoof quiz performance records.</li>
                </ul>

                <h2>4. ARTIFICIAL INTELLIGENCE TRANSPARENCY</h2>
                <ul>
                    <li><strong>Curated Study Sequences:</strong> Study paths, topic outlines, and question banks are curated by WSTAR curriculum specialists using AI-assisted structuring tools during backend content preparation.</li>
                    <li><strong>Human Review:</strong> All AI-generated study outlines and practice questions undergo human pedagogical review prior to publishing.</li>
                    <li><strong>Independent Verification:</strong> Students are advised to cross-check critical scientific formulas, definitions, and examination schedules with official faculty course materials.</li>
                </ul>

                <h2>5. REPORTING MISCONDUCT</h2>
                <p>
                    To report academic misconduct, system vulnerabilities, or content inaccuracies:<br />
                    Email: <code>support@wstartech.ng</code> / <code>security@wstartech.ng</code><br />
                    WSTAR Technologies, Ahmadu Bello University, Zaria, Nigeria
                </p>
            </div>
        </main>
    );
}
