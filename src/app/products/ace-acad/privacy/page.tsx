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
                <h1>Privacy Policy for Ace Acad</h1>
                <p><strong>Effective Date:</strong> August 17, 2026</p>
                <p><strong>Last Updated:</strong> October 1, 2026</p>
                <p><strong>Version:</strong> 1.1.0</p>

                <div className={styles.changeNote}>
                    <strong>What changed in 1.1.0:</strong> CBT tests, assignments, timetable reminders, the
                    AI tutor, games leaderboards, content reporting and lecturer practice sets. New data:
                    optional registration number; test answers and exam-integrity records; assignment work;
                    on-phone location checks for location-locked tests; photos/files you choose to send;
                    questions to the AI tutor (sent to our AI providers); mock exam answers marked by AI;
                    feedback emailed to our team; first name and score on weekly leaderboards. See §4, §7
                    and §8.
                </div>

                <h2>1. Introduction</h2>
                <p>
                    Ace Acad (“Ace Acad”, “we”, “us”, or “our”) is an educational technology mobile platform
                    developed and operated by <strong>WSTAR TECHNOLOGIES LTD</strong> (“WSTAR”, World of
                    Science, Technology, Advancement &amp; Research), a company registered in Nigeria,
                    located at Ahmadu Bello University, Zaria, Kaduna State, Nigeria.
                </p>
                <p>
                    Ace Acad is designed to help university undergraduates manage coursework, access
                    curated study paths, review course materials offline, and test their academic knowledge
                    through structured session quizzes.
                </p>
                <p>
                    We are firmly committed to respecting and protecting the privacy and personal data of
                    our users. This Privacy Policy explains what personal information we collect, why we
                    collect it, how it is processed and stored, who it may be shared with, and the statutory
                    rights available to you under the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong>{' '}
                    and applicable data protection regulations.
                </p>

                <h2>2. Scope &amp; Applicability</h2>
                <p>This Policy applies to:</p>
                <ul>
                    <li>Registered student users of the Ace Acad mobile application;</li>
                    <li>Prospective students and visitors accessing Ace Acad services or web portals;</li>
                    <li>Individuals communicating with Ace Acad or WSTAR support channels.</li>
                </ul>
                <p>This Policy does not apply to:</p>
                <ul>
                    <li>Third-party websites, services, or platforms linked from our application;</li>
                    <li>Institutional university portals (such as official university admission or registration portals) that operate independently of Ace Acad.</li>
                </ul>

                <h2>3. Data Controller &amp; Contact Information</h2>
                <p>
                    <strong>Data Controller:</strong> WSTAR TECHNOLOGIES LTD (World of Science, Technology, Advancement &amp; Research)<br />
                    <strong>Address:</strong> Ahmadu Bello University, Zaria, Kaduna State, Nigeria<br />
                    <strong>Contact Email:</strong> <code>support@wstartech.ng</code> / <code>wstar5552@gmail.com</code><br />
                    <strong>Data Protection Support:</strong> <code>privacy@wstartech.ng</code>
                </p>

                <h2>4. Personal Data We Collect</h2>
                <p>
                    We adhere strictly to the principle of <strong>data minimization</strong> under Section 24
                    of the NDPA 2023. We collect only the personal information necessary to deliver and
                    improve the Ace Acad service.
                </p>

                <h3>4.1 Information You Provide Directly</h3>
                <p>When creating an account, completing your student profile, or interacting with our app, we collect:</p>
                <ul>
                    <li><strong>Full Name:</strong> To personalize your student dashboard, greetings, and study records.</li>
                    <li><strong>Email Address:</strong> Used as your unique account identifier, for authentication, password recovery, and essential service notices.</li>
                    <li><strong>Password:</strong> Stored in cryptographically salted and hashed form via Google Firebase Authentication. We never have access to your plain-text password.</li>
                    <li>
                        <strong>Academic Profile Information:</strong>
                        <ul>
                            <li>Faculty (e.g., Faculty of Engineering, Faculty of Science);</li>
                            <li>Department (e.g., Department of Mechatronics Engineering, Department of Computer Science);</li>
                            <li>Year of Admission (e.g., 2025, 2026);</li>
                            <li>Set (class), current level and entry mode (e.g., U21, 500L, Direct Entry).</li>
                        </ul>
                        <em>Purpose:</em> To deliver academic course materials, curriculum modules, and study
                        paths tailored to your specific department and study level, and to show you your
                        class&apos;s tests, assignments, timetable and announcements.
                    </li>
                    <li><strong>Registration Number (optional):</strong> To show you your project/lab group and to name your CBT results and assignment submissions for your lecturer. One account may claim a registration number.</li>
                    <li><strong>Assignment Work:</strong> Text you type and files you attach (e.g. PDFs, photos of handwritten work) when you hand in an assignment, kept for your lecturer with their grade and feedback.</li>
                    <li><strong>Photos and Files You Choose to Send for Reading:</strong> Photos or PDFs of a timetable (students) or a test paper (lecturers/Ace-Reps), and photos of your working in a mock exam, are sent to our server and AI providers to be read. Pages are captured with the on-phone document scanner (Google ML Kit). Photos are not kept afterwards; a PDF a lecturer uploads for this is kept in their private upload folder. Scanned files Ace-Reps share with a class are read by AI first to check they hold no students&apos; personal data.</li>
                    <li><strong>Mock Exam Answers and Simulated Results:</strong> Your mock answers (typed, photographed or drawn) are sent to our AI providers to be marked against the marking guide. Your marks, typed answers and the AI&apos;s comments are kept in your account for review; the photos stay on your phone. For the simulated result we keep the CA you expect, your course units and, if you give it, your CGPA so far.</li>
                    <li><strong>Questions to the AI Tutor:</strong> The questions you type, sent with extracts of your course&apos;s study guide to our AI provider to write an answer. The conversation is stored only on your phone; we keep a daily count of questions per account to enforce fair-use limits.</li>
                    <li><strong>Content Reports:</strong> What you report about a material, question, topic or flashcard, and why.</li>
                    <li><strong>Feedback &amp; Inquiries:</strong> Feedback and complaints sent in the app are also emailed (via Gmail) to the Ace-Acad team at <code>wstar5552@gmail.com</code> with your name, email, class, app version and any screenshot you add, so we can reply. When you submit bug reports, feature requests, or support messages via our in-app &quot;Send Feedback&quot; feature or email, we collect your message content, feedback category, and associated user ID.</li>
                </ul>

                <h3>4.2 Information Collected Automatically Through App Use</h3>
                <p>When you use the Ace Acad mobile app, our system records:</p>
                <ul>
                    <li><strong>Course Enrollments &amp; Study Progress:</strong> The courses you add to your dashboard, topics marked complete, modules completed, and your last active study timestamp.</li>
                    <li><strong>Daily Study Activity:</strong> Date-level indicators recording whether a study session occurred on a given day (to power your 7-day study rhythm view).</li>
                    <li><strong>Quiz Performance Data:</strong> Quiz scores, topic completion records, and question response accuracy.</li>
                    <li><strong>Diagnostic &amp; Telemetry Data (Firebase Analytics):</strong> Screen view events, session start/end timestamps, app login/signup method (email vs. Google), and anonymous device metadata (operating system version, device model).</li>
                    <li><strong>Account Timestamps:</strong> Account creation timestamp (<code>createdAt</code>) and last active timestamp (<code>lastSeen</code>).</li>
                    <li><strong>CBT Tests:</strong> Your answers, start/submit times, the number of times you left the app during a test, and a random identifier for your app installation (so a test continues only on the phone it started on). Results are marked on our server and shown to your lecturer.</li>
                    <li><strong>Location Checks (location-locked tests only):</strong> When a lecturer requires you to be at the test venue, the app reads your location once when you start the test and compares it with the venue on your phone. Your location is not stored or sent to us. No location is read at any other time.</li>
                    <li><strong>Games:</strong> Your score per game; your first name and best score appear on that course&apos;s weekly leaderboard, visible to other students.</li>
                    <li><strong>Timetable &amp; Reminders:</strong> Your class timetable and classes you add; reminders are scheduled on your phone.</li>
                </ul>

                <h3>4.3 What We DO NOT Collect</h3>
                <p>To prevent ambiguity and adhere strictly to verified system behavior:</p>
                <ul>
                    <li>❌ We do not track your location. Location is read only at the start of a location-locked CBT test, checked on your phone, and never stored or sent to us.</li>
                    <li>❌ We do not access your camera, photos or files except when you choose to take or attach one (assignments, reading a timetable or test paper). We never access your microphone, contacts or media library in the background.</li>
                    <li>❌ We do not collect payment card numbers, bank verification numbers (BVN), or financial data (Ace Acad MVP is 100% free).</li>
                    <li>❌ We do not collect sensitive personal data such as biometric records, genetic data, health data, political opinions, or religious affiliations.</li>
                </ul>

                <h2>5. Lawful Bases for Processing (NDPA Section 25)</h2>
                <p>Under Section 25 of the Nigeria Data Protection Act 2023, we process your personal data under the following lawful bases:</p>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Purpose of Processing</th>
                                <th>Categories of Personal Data</th>
                                <th>Lawful Basis (NDPA Section 25)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Account registration, authentication &amp; password resets</td>
                                <td>Full Name, Email, Password, Google Auth ID</td>
                                <td><strong>Performance of a Contract</strong> (Sec 25(1)(b)) — Necessary to provide your user account.</td>
                            </tr>
                            <tr>
                                <td>Delivering tailored courses, study paths &amp; quizzes</td>
                                <td>Faculty, Department, Admission Year, Enrollments</td>
                                <td><strong>Performance of a Contract</strong> (Sec 25(1)(b)) — Core educational service delivery.</td>
                            </tr>
                            <tr>
                                <td>Tracking study progress, quiz scores &amp; daily activity</td>
                                <td>Completed topics, Quiz scores, Activity dates</td>
                                <td><strong>Performance of a Contract</strong> (Sec 25(1)(b)) — Core app functionality.</td>
                            </tr>
                            <tr>
                                <td>App performance monitoring, crash diagnostics &amp; security</td>
                                <td>Device metadata, OS version, Screen views, Login logs</td>
                                <td><strong>Legitimate Interests</strong> (Sec 25(1)(f)) — Maintaining platform stability and security.</td>
                            </tr>
                            <tr>
                                <td>CBT tests, exam-integrity records, assignments &amp; grading</td>
                                <td>Answers, submissions, registration number, app-leave counts, installation ID</td>
                                <td><strong>Performance of a Contract</strong> (Sec 25(1)(b)) and <strong>Legitimate Interests</strong> (Sec 25(1)(f)) — running your lecturers&apos; assessments fairly.</td>
                            </tr>
                            <tr>
                                <td>Location check for location-locked tests</td>
                                <td>Location, read once on the phone, not stored</td>
                                <td><strong>Consent</strong> (Sec 25(1)(a)) — Android asks your permission; without it you cannot start that test.</td>
                            </tr>
                            <tr>
                                <td>AI tutor, mock marking, reading timetables &amp; papers</td>
                                <td>Your questions, mock answers, photos/files you choose to send</td>
                                <td><strong>Performance of a Contract</strong> (Sec 25(1)(b)) — features you choose to use.</td>
                            </tr>
                            <tr>
                                <td>User feedback handling &amp; bug resolution</td>
                                <td>Feedback subject, description, user ID</td>
                                <td><strong>Consent / Legitimate Interests</strong> (Sec 25(1)(a)/(f)) — Customer support.</td>
                            </tr>
                            <tr>
                                <td>Statutory compliance, security investigations, legal orders</td>
                                <td>Account records, access logs</td>
                                <td><strong>Compliance with Legal Obligation</strong> (Sec 25(1)(c)) — Adhering to Nigerian laws.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2>6. On-Device Storage &amp; Local Caching</h2>
                <p>To support low-connectivity and offline study environments across Nigerian university campuses, Ace Acad stores select data locally on your device:</p>
                <ul>
                    <li><strong>Downloaded Course PDFs:</strong> When you tap &quot;Download Course&quot; or &quot;Download Material&quot;, PDF files are downloaded from cloud storage and saved exclusively in the app&apos;s sandboxed, private documents directory (<code>/data/data/com.example.aceAcadMobile/app_flutter/courses/</code>).</li>
                    <li><strong>Local Database (Drift SQLite):</strong> The app maintains a local SQLite database (<code>db.sqlite</code>) tracking which course materials have been downloaded for offline access.</li>
                    <li><strong>Preferences (SharedPreferences):</strong> Your chosen theme mode (Light, Dark, System) and cached course catalog listings are stored locally for fast startup.</li>
                    <li><strong>Data Wipe:</strong> You can delete all local downloaded materials at any time via the in-app Download Manager or by clearing app storage in your Android system settings.</li>
                </ul>

                <h2>7. Artificial Intelligence &amp; Pedagogical Content</h2>
                <ul>
                    <li><strong>Generated Study Content:</strong> Study guides, flashcards and practice questions are written by AI from each course&apos;s lecture notes and past questions. Generation refuses pages it cannot read. Content built from an Ace-Rep&apos;s upload is checked by an Ace-Rep before students see it. AI-written practice is kept separate from real past questions, and students can report errors.</li>
                    <li><strong>AI Tutor:</strong> Answers are generated instantly by an AI model from your course&apos;s study guide and are not reviewed by a person; they may contain errors.</li>
                    <li><strong>No Real-Time Automated Profiling:</strong> The mobile application does not subject users to automated legal profiling or automated decisions that produce legal or significant adverse effects.</li>
                    <li><strong>Academic Disclaimer:</strong> AI-assisted study guides and quiz explanations are designed as supplementary educational aids. They do not replace official university lectures, textbooks, or institutional grading rubrics.</li>
                </ul>

                <h2>8. Data Sharing &amp; Third-Party Processors</h2>
                <p>We do <strong>not</strong> sell, rent, lease, or monetize your personal data to third parties, advertisers, or data brokers.</p>
                <p>We disclose personal data strictly to verified technical service providers (Data Processors) under binding contractual safeguards:</p>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Processor / Service</th>
                                <th>Provider</th>
                                <th>Purpose &amp; Scope</th>
                                <th>Location / Safeguards</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Firebase Authentication</strong></td>
                                <td>Google LLC</td>
                                <td>User authentication, identity tokens, password hashing</td>
                                <td>Global / US (Google Cloud DPA &amp; SCCs)</td>
                            </tr>
                            <tr>
                                <td><strong>Cloud Firestore</strong></td>
                                <td>Google LLC</td>
                                <td>Cloud database for user profiles, study progress, enrollments</td>
                                <td>Multi-region Cloud (Google Cloud DPA)</td>
                            </tr>
                            <tr>
                                <td><strong>Firebase Cloud Storage</strong></td>
                                <td>Google LLC</td>
                                <td>Storage and secure distribution of PDF courseware</td>
                                <td>Google Cloud Storage Bucket (Authenticated Read Only)</td>
                            </tr>
                            <tr>
                                <td><strong>Firebase Analytics</strong></td>
                                <td>Google LLC</td>
                                <td>App usage telemetry, screen views, demographic aggregates</td>
                                <td>Global (Aggregated / Pseudonymized)</td>
                            </tr>
                            <tr>
                                <td><strong>Google Sign-In API</strong></td>
                                <td>Google LLC</td>
                                <td>Federated OAuth 2.0 social login</td>
                                <td>Google Identity Services</td>
                            </tr>
                            <tr>
                                <td><strong>Cloud Functions</strong></td>
                                <td>Google LLC</td>
                                <td>Server-side marking of CBT tests, takedowns, account-deletion clean-up, AI requests</td>
                                <td>Google Cloud (europe-west1)</td>
                            </tr>
                            <tr>
                                <td><strong>Gemini API</strong></td>
                                <td>Google LLC</td>
                                <td>AI tutor answers; reading timetables and test papers</td>
                                <td>Google Cloud (Google Cloud DPA)</td>
                            </tr>
                            <tr>
                                <td><strong>Groq API</strong></td>
                                <td>Groq, Inc.</td>
                                <td>Backup AI model for the tutor and pasted text when Gemini is unavailable</td>
                                <td>United States (DPA &amp; SCCs)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p>
                    Within Ace Acad, <strong>lecturers and Ace-Reps</strong> see results of tests they set and
                    submissions to assignments they set; <strong>Ace-Acad administrators</strong> can see
                    account profile details (name, email, class, level, department, registration number) to
                    run the service and support students. Other students see only your first name and score
                    on game leaderboards.
                </p>
                <p>
                    All technical processors are bound by written Data Processing Addenda complying with
                    NDPA requirements, obligating them to implement robust technical security measures and
                    process data solely on our instructions.
                </p>

                <h3>Legal Disclosures</h3>
                <p>
                    We may disclose personal data if required to do so by Nigerian law, a valid court order,
                    a formal request from law enforcement under the Cybercrimes Act 2015 (as amended 2024),
                    or to protect the vital interests and safety of students and the platform.
                </p>

                <h2>9. Cross-Border Data Transfers (NDPA Part VIII)</h2>
                <p>
                    Ace Acad operates using Google Firebase and Google Cloud infrastructure, which stores
                    and processes data on secure servers located outside Nigeria (principally in the United
                    States and European Union regions).
                </p>
                <p>In accordance with Sections 41, 42, and 43 of the Nigeria Data Protection Act 2023:</p>
                <ul>
                    <li>Transfers are conducted pursuant to Google Cloud&apos;s Data Processing Addendum and Standard Contractual Clauses (SCCs), providing international-grade organizational and technical safeguards;</li>
                    <li>Transfers are necessary for the performance of our service contract with you (NDPA Section 43(1)(b)) to synchronize your study progress and account across devices;</li>
                    <li>By registering for Ace Acad, you acknowledge and consent to the secure cross-border transfer and storage of your account data on Google Cloud servers (NDPA Section 43(1)(a)).</li>
                </ul>

                <h2>10. Data Retention &amp; Deletion Schedule</h2>
                <p>We retain personal data only for as long as necessary to fulfill the educational purposes for which it was collected:</p>
                <ul>
                    <li><strong>Active User Profile Data:</strong> Retained for the lifetime of your active account.</li>
                    <li><strong>Study Progress &amp; Quiz Records:</strong> Retained while your account is active to maintain your learning history.</li>
                    <li><strong>Feedback Submissions:</strong> Retained for up to twelve (12) months to resolve technical issues and improve features, after which they are anonymized.</li>
                    <li><strong>Account Inactivity:</strong> Accounts inactive for more than twenty-four (24) consecutive months may be queued for deletion following email notification.</li>
                    <li><strong>Account Deletion:</strong> When you request account deletion, all personal data in <code>users/{'{uid}'}</code>, enrollments, progress, and activity records are permanently purged from active Firestore databases, your Firebase Auth record is deleted, and local cached data is removed within fourteen (14) days. Deleting the account also removes, automatically, your CBT attempts and results, assignment submissions and their files, game leaderboard rows, content reports, AI-tutor usage counters and private uploads. Copies a lecturer has already exported (e.g. a results spreadsheet) are held by that lecturer.</li>
                    <li><strong>Test Results &amp; Assignments:</strong> Retained while your account is active so you and your lecturer can see them for the session.</li>
                </ul>

                <h2>11. Data Security Measures</h2>
                <p>We implement robust technical and organizational measures to safeguard your personal data:</p>
                <ul>
                    <li><strong>Transport Layer Encryption:</strong> All data transmitted between the Ace Acad mobile app and backend servers is encrypted in transit using TLS 1.3 / HTTPS.</li>
                    <li><strong>Credential Protection:</strong> Passwords are never stored in plain text; authentication is managed securely through Firebase Auth using salted hashing.</li>
                    <li><strong>Application Sandbox:</strong> Local SQLite data and downloaded course files are stored in Android&apos;s private app sandbox, preventing access by unauthorized third-party applications.</li>
                    <li><strong>Cloud Storage Rules:</strong> Firebase Storage rules enforce authenticated-only access (<code>request.auth != null</code>) and disable client-side write access.</li>
                    <li><strong>Least-Privilege Access:</strong> Administrative access to backend database infrastructure is restricted to authorized WSTAR technical personnel using multi-factor authentication.</li>
                </ul>

                <h2>12. Your Statutory Data Subject Rights</h2>
                <p>Under the Nigeria Data Protection Act 2023 (Sections 34–40), you have the following rights regarding your personal data:</p>
                <ul>
                    <li><strong>Right of Access (Section 34(1)(b)):</strong> You have the right to request a copy of the personal data we hold about you.</li>
                    <li><strong>Right to Rectification (Section 34(1)(c)):</strong> You have the right to correct inaccurate or incomplete profile information.</li>
                    <li><strong>Right to Erasure / Right to be Forgotten (Section 34(1)(d)):</strong> You have the right to request the permanent deletion of your account and personal records.</li>
                    <li><strong>Right to Restriction of Processing (Section 34(1)(e)):</strong> You have the right to request that we temporarily restrict the processing of your data in specific circumstances.</li>
                    <li><strong>Right to Data Portability (Section 34(1)(f)):</strong> You have the right to receive your personal data and study history in a structured, commonly used, and machine-readable JSON format.</li>
                    <li><strong>Right to Object (Section 34(1)(g)):</strong> You have the right to object at any time to the processing of your personal data for direct marketing or based on legitimate interests.</li>
                    <li><strong>Right to Withdraw Consent (Section 35):</strong> Where processing is based on consent, you may withdraw your consent at any time without affecting the lawfulness of prior processing.</li>
                </ul>

                <h3>How to Exercise Your Rights</h3>
                <ul>
                    <li><strong>In-App Self-Service:</strong> You can export your data or initiate account deletion directly from the app: <strong>More &gt; Export My Data</strong> and <strong>More &gt; Delete Account</strong>.</li>
                    <li><strong>Web Deletion Portal:</strong> You can submit an account deletion request online at <a href="https://www.wstartech.ng/products/ace-acad/account-deletion">wstartech.ng/products/ace-acad/account-deletion</a>.</li>
                    <li><strong>Email Requests:</strong> You can contact our Data Protection team at <code>privacy@wstartech.ng</code> or <code>support@wstartech.ng</code>. We will verify your identity and respond to your request within thirty (30) days in accordance with statutory timelines.</li>
                </ul>

                <h2>13. Children &amp; Minors&apos; Privacy (NDPA Section 31)</h2>
                <p>Ace Acad is designed as a higher-education academic study tool for university undergraduate students.</p>
                <p>
                    Under the Child&apos;s Rights Act 2003 and Section 31 of the NDPA 2023, individuals under
                    18 years of age are classified as children/minors. In Nigeria, many 100-level university
                    students are 16 or 17 years of age.
                </p>
                <ul>
                    <li>If you are between 16 and 17 years old, you affirm during registration that you have obtained the permission of your parent or legal guardian to create an account, use the application, and agree to these terms.</li>
                    <li>We do not knowingly collect personal data from children under the age of 13. If we discover that an individual under 13 has registered an account, we will immediately delete their account and associated data.</li>
                </ul>

                <h2>14. Regulatory Authority &amp; Complaints</h2>
                <p>If you believe that your personal data has been processed in violation of the Nigeria Data Protection Act 2023, you have the right to lodge a complaint with the national supervisory authority:</p>
                <p>
                    <strong>Nigeria Data Protection Commission (NDPC)</strong><br />
                    Website: <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer">https://ndpc.gov.ng</a><br />
                    Email: <code>info@ndpc.gov.ng</code><br />
                    Address: No. 5, Donau Crescent, Off Amazon Street, Maitama, Abuja, FCT, Nigeria
                </p>

                <h2>15. Changes to this Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy periodically to reflect enhancements to the Ace Acad
                    application, changes in data practices, or updates to statutory requirements.
                </p>
                <p>When material changes occur:</p>
                <ul>
                    <li>We will update the &quot;Last Updated&quot; and &quot;Version&quot; indicators at the top of this document;</li>
                    <li>We will provide prominent in-app notification upon your next login;</li>
                    <li>Continued use of Ace Acad following notice of changes constitutes acknowledgement of the updated Privacy Policy.</li>
                </ul>

                <h2>16. Contact Us</h2>
                <p>If you have questions, feedback, or privacy-related inquiries, please reach out to us:</p>
                <p>
                    <strong>WSTAR TECHNOLOGIES LTD — Ace Acad Team</strong><br />
                    Ahmadu Bello University, Zaria, Kaduna State, Nigeria<br />
                    General Inquiries: <code>wstar5552@gmail.com</code><br />
                    Customer &amp; Account Support: <code>support@wstartech.ng</code><br />
                    Privacy &amp; Data Rights: <code>privacy@wstartech.ng</code><br />
                    Website: <a href="https://www.wstartech.ng">wstartech.ng</a>
                </p>
            </div>
        </main>
    );
}
