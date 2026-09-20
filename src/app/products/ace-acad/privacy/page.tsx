import styles from './privacy.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - Ace-Acad | WSTAR',
    description: 'NDPA 2023-compliant Privacy Policy for Ace-Acad, outlining data collection, processing, security, and statutory data subject rights.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className={`section ${styles.privacyPage}`}>
            <div className={`container ${styles.contentContainer}`}>
                <h1>Privacy Policy for Ace-Acad</h1>
                <p><strong>Effective Date:</strong> August 17, 2026</p>
                <p><strong>Last Updated:</strong> August 17, 2026</p>
                <p><strong>Version:</strong> 1.0.0</p>

                <h2>1. INTRODUCTION</h2>
                <p>
                    Ace-Acad (“Ace-Acad”, “we”, “us”, or “our”) is an educational mobile application developed and operated by <strong>WSTAR</strong> (“World of Science, Technology, Advancement & Research”), located at Ahmadu Bello University, Zaria, Kaduna State, Nigeria.
                </p>
                <p>
                    Ace-Acad helps university undergraduates manage coursework, access curated study paths, review course materials offline, and test their academic knowledge through structured session quizzes. We are firmly committed to respecting and protecting student data privacy in strict compliance with the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong>.
                </p>

                <h2>2. DATA CONTROLLER & CONTACT DETAILS</h2>
                <p>
                    <strong>Data Controller:</strong> WSTAR (World of Science, Technology, Advancement & Research)<br />
                    <strong>Physical Address:</strong> Ahmadu Bello University, Zaria, Kaduna State, Nigeria<br />
                    <strong>General Inquiries:</strong> <code>wstar5552@gmail.com</code><br />
                    <strong>Data Protection & Support:</strong> <code>support@wstartech.ng</code> / <code>privacy@wstartech.ng</code>
                </p>

                <h2>3. PERSONAL DATA WE COLLECT</h2>
                <p>
                    We strictly adhere to the principle of <strong>data minimization</strong> under Section 24 of the NDPA 2023. We collect only the information necessary to deliver and personalize your academic experience:
                </p>

                <h3>3.1 Information You Provide Directly</h3>
                <ul>
                    <li><strong>Full Name:</strong> To personalize your student dashboard and academic records.</li>
                    <li><strong>Email Address:</strong> Used as your unique account identifier, for authentication, password recovery, and service notices.</li>
                    <li><strong>Password:</strong> Handled securely via Google Firebase Authentication in salted and hashed form. We never store or view plain-text passwords.</li>
                    <li><strong>Academic Information:</strong> Faculty (e.g., Engineering, Science), Department (e.g., Mechatronics Engineering), and Year of Admission (e.g., 2025, 2026) to match you with foundational course syllabi.</li>
                    <li><strong>Feedback & Messages:</strong> Bug reports, feature suggestions, and inquiries submitted via the in-app feedback tool or email.</li>
                </ul>

                <h3>3.2 Information Collected Automatically</h3>
                <ul>
                    <li><strong>Study Progress:</strong> Enrolled courses, completed syllabus topics, quiz scores, and daily study activity timestamps (to power the 7-day study rhythm tracker).</li>
                    <li><strong>App Telemetry (Firebase Analytics):</strong> Screen view events, session duration, login/signup method, and device metadata (operating system version, device model) for stability monitoring and diagnostics.</li>
                    <li><strong>Account Timestamps:</strong> Account creation timestamp and last active session date.</li>
                </ul>

                <h3>3.3 What We DO NOT Collect</h3>
                <p>To ensure transparency, Ace-Acad does NOT collect:</p>
                <ul>
                    <li>❌ GPS or precise geolocation data (no location permissions are requested).</li>
                    <li>❌ Device photos, camera, microphone, or external storage access.</li>
                    <li>❌ Payment card details, BVN, or financial data (Ace-Acad MVP is 100% free).</li>
                    <li>❌ Sensitive biometric, health, or political data.</li>
                </ul>

                <h2>4. LAWFUL BASES FOR PROCESSING (NDPA SECTION 25)</h2>
                <ul>
                    <li><strong>Performance of a Contract (Sec 25(1)(b)):</strong> Necessary to provide your user account, deliver personalized study paths, record quiz progress, and sync offline study packs.</li>
                    <li><strong>Legitimate Interests (Sec 25(1)(f)):</strong> Platform stability diagnostics, crash reporting, and cybersecurity protection.</li>
                    <li><strong>Consent (Sec 25(1)(a)):</strong> Optional feedback submissions and support requests.</li>
                    <li><strong>Legal Obligation (Sec 25(1)(c)):</strong> Compliance with statutory directives under Nigerian law.</li>
                </ul>

                <h2>5. ON-DEVICE STORAGE & OFFLINE CACHING</h2>
                <p>
                    To enable seamless study in low-connectivity campus environments:
                </p>
                <ul>
                    <li><strong>Downloaded Course PDFs:</strong> Saved in Android's sandboxed private app directory (inaccessible to other non-root applications).</li>
                    <li><strong>Drift SQLite Database:</strong> An on-device database (<code>db.sqlite</code>) indexes downloaded materials for instant offline verification.</li>
                    <li><strong>Local Preferences:</strong> SharedPreferences store your theme selection (Light/Dark) and cached course listings.</li>
                    <li><strong>User Control:</strong> You can clear all cached course PDFs at any time via the in-app Download Manager or <strong>More &gt; Clear Offline Cache</strong>.</li>
                </ul>

                <h2>6. THIRD-PARTY SUB-PROCESSORS</h2>
                <p>
                    We do not sell or monetize student data. We share data solely with verified technical cloud providers under binding Data Processing Addenda:
                </p>
                <ul>
                    <li><strong>Google LLC (Firebase):</strong> Authentication, Cloud Firestore database, Firebase Storage for courseware, and Firebase Analytics. Governed by Google Cloud Data Processing Addendum and Standard Contractual Clauses (SCCs).</li>
                    <li><strong>Google Sign-In:</strong> Federated OAuth 2.0 social login.</li>
                </ul>

                <h2>7. CROSS-BORDER DATA TRANSFERS (NDPA PART VIII)</h2>
                <p>
                    Google Firebase servers are hosted in secure data centers globally (primarily US and EU). In compliance with Sections 41–43 of the NDPA 2023, transfers are safeguarded by enterprise Standard Contractual Clauses, contractual necessity for syncing your cloud account, and your explicit acknowledgement during registration.
                </p>

                <h2>8. DATA RETENTION & PURGE SCHEDULE</h2>
                <ul>
                    <li><strong>Active Account Data:</strong> Retained while your account remains active.</li>
                    <li><strong>Account Deletion:</strong> Upon receiving an account deletion request (via the app or web portal), all profile records, enrollments, progress, and authentication credentials are permanently purged within <strong>14 calendar days</strong>.</li>
                    <li><strong>Inactivity:</strong> Accounts inactive for more than 24 consecutive months are scheduled for deletion following email notification.</li>
                </ul>

                <h2>9. YOUR STATUTORY DATA SUBJECT RIGHTS</h2>
                <p>Under the Nigeria Data Protection Act 2023 (Sections 34–40), you have the right to:</p>
                <ul>
                    <li><strong>Access:</strong> Request a copy of all personal records we hold about you.</li>
                    <li><strong>Rectification:</strong> Correct inaccurate faculty, department, or profile info.</li>
                    <li><strong>Erasure:</strong> Permanently delete your account and all associated data.</li>
                    <li><strong>Data Portability:</strong> Export your study data in a machine-readable JSON format (available self-service in-app under <strong>More &gt; Export My Data</strong>).</li>
                    <li><strong>Restriction &amp; Objection:</strong> Restrict or object to processing for legitimate interest grounds.</li>
                </ul>
                <p>
                    To exercise your rights, use the in-app controls or email our compliance team at <code>privacy@wstartech.ng</code>. We respond within statutory timelines (30 days).
                </p>

                <h2>10. CHILDREN &amp; MINORS (NDPA SECTION 31)</h2>
                <p>
                    Ace-Acad is designed for university undergraduate students. Under Nigerian law, individuals under 18 are minors. Students aged 16–17 entering 100-Level affirm during registration that they have obtained parental or guardian permission to register and use the service. We do not knowingly collect data from children under 13.
                </p>

                <h2>11. REGULATORY AUTHORITY COMPLAINTS</h2>
                <p>
                    You have the statutory right to lodge a complaint with the national supervisory authority:
                </p>
                <p>
                    <strong>Nigeria Data Protection Commission (NDPC)</strong><br />
                    Website: <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer">https://ndpc.gov.ng</a><br />
                    Email: <code>info@ndpc.gov.ng</code><br />
                    Address: No. 5, Donau Crescent, Off Amazon Street, Maitama, Abuja, Nigeria
                </p>

                <h2>12. CONTACT US</h2>
                <p>
                    For privacy inquiries, contact: <strong>WSTAR Data Protection Lead</strong><br />
                    Email: <code>privacy@wstartech.ng</code> / <code>support@wstartech.ng</code><br />
                    Website: <code>https://www.wstartech.ng</code>
                </p>
            </div>
        </main>
    );
}