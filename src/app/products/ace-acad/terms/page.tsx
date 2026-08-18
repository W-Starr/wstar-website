import styles from '../privacy/privacy.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - Ace-Acad | WSTAR',
    description: 'Terms of Service for Ace Acad by WSTAR, governing user eligibility, academic integrity, copyright fair dealing, and platform usage.',
};

export default function TermsOfServicePage() {
    return (
        <main className={`section ${styles.privacyPage}`}>
            <div className={`container ${styles.contentContainer}`}>
                <h1>Terms of Service for Ace Acad</h1>
                <p><strong>Effective Date:</strong> August 17, 2026</p>
                <p><strong>Last Updated:</strong> August 17, 2026</p>
                <p><strong>Version:</strong> 1.0.0</p>

                <h2>1. AGREEMENT TO TERMS</h2>
                <p>
                    These Terms of Service (“Terms”) constitute a legally binding agreement between you (“User”, “Student”, or “you”) and <strong>WSTAR</strong> (“World of Science, Technology, Advancement &amp; Research”, “we”, “us”, or “our”), governing your access to and use of the <strong>Ace Acad</strong> mobile application, website, and related academic tools.
                </p>
                <p>
                    By registering for or using Ace Acad, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>

                <h2>2. ELIGIBILITY &amp; AGE AFFIRMATION</h2>
                <p>
                    Ace Acad is designed for university undergraduate students. Users aged 18 and older possess full legal capacity to enter this agreement. Users aged 16–17 represent that they have obtained parental or guardian permission to register and use the application in accordance with Section 31 of the Nigeria Data Protection Act 2023. The platform is not intended for individuals under 13.
                </p>

                <h2>3. USER ACCOUNTS &amp; SECURITY</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your login credentials and preventing unauthorized access to your account. Creating fraudulent accounts, sharing accounts, or impersonating another student or university staff member is strictly prohibited.
                </p>

                <h2>4. ACADEMIC NATURE OF SERVICE &amp; DISCLAIMERS</h2>
                <ul>
                    <li><strong>Supplemental Study Tool:</strong> Ace Acad is an independent academic productivity tool designed to help students organize study routines and review foundational concepts.</li>
                    <li><strong>Independent Entity:</strong> Ace Acad is an independent product developed by WSTAR and is not officially affiliated with, sponsored by, or endorsed by Ahmadu Bello University (ABU), Zaria, or any other institution, unless an institutional MoU is executed.</li>
                    <li><strong>No Grade Guarantees:</strong> While designed to boost study efficiency, WSTAR does not guarantee specific exam scores, grades, or degree classifications. Academic outcomes depend on individual student dedication.</li>
                </ul>

                <h2>5. ACCEPTABLE USE &amp; PROHIBITED CONDUCT</h2>
                <p>You agree NOT to:</p>
                <ul>
                    <li>Use Ace Acad for examination malpractice or academic fraud during official university tests or exams.</li>
                    <li>Reverse engineer, decompile, or tamper with the application, APIs, or database structures pursuant to the Cybercrimes Act 2015 (as amended 2024).</li>
                    <li>Scrape or bulk-download PDF courseware or question banks using automated bots or scrapers.</li>
                    <li>Sell, rent, or commercially exploit study materials downloaded from Ace Acad.</li>
                </ul>

                <h2>6. INTELLECTUAL PROPERTY &amp; COPYRIGHT</h2>
                <p>
                    The Ace Acad software, logos, interfaces, and original study paths are the exclusive intellectual property of WSTAR. Curated syllabus materials and past question summaries are provided for educational review and private study under the fair dealing provisions (Sections 20–27) of the <strong>Nigerian Copyright Act 2022</strong>.
                </p>
                <p>
                    <strong>Designated Copyright Agent:</strong><br />
                    Legal &amp; Copyright Division, WSTAR<br />
                    Email: <code>copyright@wstartech.ng</code> / <code>support@wstartech.ng</code><br />
                    Address: Ahmadu Bello University, Zaria, Kaduna State, Nigeria
                </p>

                <h2>7. FEES &amp; SUBSCRIPTIONS</h2>
                <p>
                    The Ace Acad MVP is provided <strong>100% free of charge</strong>. Any future premium subscription tiers will be clearly disclosed in Nigerian Naira (NGN) with affirmative opt-in consent in compliance with the Federal Competition and Consumer Protection Act 2018 (FCCPA).
                </p>

                <h2>8. TERMINATION &amp; ACCOUNT DELETION</h2>
                <p>
                    You may terminate your account at any time via the in-app "Delete Account" button or through our online deletion portal. WSTAR reserves the right to suspend or terminate accounts that breach these Terms or engage in platform misuse.
                </p>

                <h2>9. GOVERNING LAW &amp; JURISDICTION</h2>
                <p>
                    These Terms are governed by and construed in accordance with the <strong>laws of the Federal Republic of Nigeria</strong>. Any disputes that cannot be settled amicably shall be submitted to the exclusive jurisdiction of the competent courts in Kaduna State, Nigeria.
                </p>

                <h2>10. CONTACT US</h2>
                <p>
                    WSTAR Technologies<br />
                    Ahmadu Bello University, Zaria, Kaduna State, Nigeria<br />
                    Email: <code>support@wstartech.ng</code> / <code>legal@wstartech.ng</code>
                </p>
            </div>
        </main>
    );
}
