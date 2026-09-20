import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import FeatureCard from "@/components/FeatureCard";
import PricingCard from "@/components/PricingCard";
import AceAcadWaitlistForm from "./AceAcadWaitlistForm";
import AceAcadFAQ from "./AceAcadFAQ";
import Image from "next/image";
import { BookOpen, Target, Layers, BarChart } from "lucide-react";
import styles from "./aceacad.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ace-Acad — Offline-First Study App for Nigerian Students | WSTAR",
    description:
        "Ace-Acad is an offline-first study app for Nigerian undergraduates — curriculum-aligned quizzes, study guides, and a GPA calculator, built with NDPA-compliant data privacy.",
};

export default function AceAcadPage() {
    return (
        <>
            {/* ===== Hero ===== */}
            <HeroSection
                label="EdTech Product"
                title={
                    <>
                        Smarter Studying,{" "}
                        <span>Simplified for Nigerian Students.</span>
                    </>
                }
                description="Ace-Acad is an intelligent learning app that personalizes your reading, quizzes, and study reminders — built for the Nigerian university curriculum. Currently live in beta across all departments at ABU Zaria, and expanding fast."
                visual={
                    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Image src="/images/ace-acad/study-session.png" alt="Ace-Acad study session screen showing MATH 101: Introduction to Limits" width={280} height={498} style={{ objectFit: 'cover', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderRadius: 'var(--radius-lg)' }} priority />
                        <Image
                            src="/images/ace-acad/ace-acad-badge.png"
                            alt="Ace-Acad app icon"
                            width={56}
                            height={56}
                            style={{
                                position: "absolute",
                                bottom: "-16px",
                                right: "calc(50% - 140px - 16px)",
                                borderRadius: "14px",
                                boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                                border: "2px solid var(--deep-navy)",
                            }}
                        />
                    </div>
                }
            >
                <CTAButton href="#early-access" variant="primary" size="large">
                    Join the Beta Waitlist
                </CTAButton>
            </HeroSection>

            {/* ===== Problem vs Solution ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Ditch the Scattered Notes and Exam Stress.</h2>
                    </div>
                    <div className={styles.problemSolution}>
                        <div className={styles.problemSide}>
                            <p className={`${styles.psLabel} ${styles.psLabelProblem}`}>
                                The Problem
                            </p>
                            <h3>What students face today</h3>
                            <p>
                                Weak offline access, disorganized course materials, scattered
                                notes across multiple platforms, and a complete lack of
                                structured academic guidance — all fueling exam stress.
                            </p>
                        </div>
                        <div className={styles.solutionSide}>
                            <p className={`${styles.psLabel} ${styles.psLabelSolution}`}>
                                The Solution
                            </p>
                            <h3>How Ace-Acad helps</h3>
                            <p>
                                Ace-Acad replaces chaos with proven, highly efficient study
                                methods like Active Recall, Spaced Repetition, and Microlearning
                                — all accessible offline and aligned to your local curriculum.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Core Features ===== */}
            <section className="section section--light">
                <div className="container">
                    <div className="section-header">
                        <h2>Everything You Need to Ace Your Academics.</h2>
                        <p>
                            Powerful features designed around how students actually learn.
                        </p>
                    </div>
                    <div className={styles.featuresGrid}>
                        <FeatureCard
                            icon={<BookOpen size={32} />}
                            title="Offline-First E-Library"
                            description="Access recommended textbooks and course materials anytime, anywhere — no data required."
                            light
                        />
                        <FeatureCard
                            icon={<Target size={32} />}
                            title="Smart Study Guides"
                            description="Section-targeted reading and study plans directly aligned with your local curriculum."
                            light
                        />
                        <FeatureCard
                            icon={<Layers size={32} />}
                            title="Flashcard Quizzes & Mock Tests"
                            description="Quick self-assessment tools to fast-track your exam revision using Active Recall."
                            light
                        />
                        <FeatureCard
                            icon={<BarChart size={32} />}
                            title="Dashboard Analytics & GPA Calculator"
                            description="Track your performance, calculate your grades, and get automated study reminders."
                            light
                        />
                    </div>

                    {/* Real Ace-Acad screenshots, sourced from the live Play Store listing */}
                    <div className={styles.screenshotGrid}>
                        {[
                            { src: "/images/ace-acad/dashboard-home.png", label: "Home Dashboard" },
                            { src: "/images/ace-acad/study-library.png", label: "Study Library" },
                            { src: "/images/ace-acad/study-session.png", label: "Study Session" },
                        ].map(({ src, label }) => (
                            <div key={label} className={styles.screenshotSlot}>
                                <Image
                                    src={src}
                                    alt={`Ace-Acad ${label} screen`}
                                    width={270}
                                    height={480}
                                    style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "inherit" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Pricing ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>100% Free — With a Premium Tier on the Roadmap.</h2>
                        <p>
                            The Ace-Acad MVP is completely free during beta. Here&apos;s what&apos;s coming next.
                        </p>
                    </div>
                    <div className={styles.pricingContainer}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                            <PricingCard
                                plan="Free"
                                price="₦0"
                                description="Everything in the current beta, at no cost."
                                features={[
                                    "Basic e-library access",
                                    "Standard quizzes",
                                    "GPA calculator",
                                ]}
                                ctaText="Get Started Free"
                                ctaHref="#early-access"
                            />
                            <PricingCard
                                plan="Premium"
                                price="Pricing to be announced"
                                description="Unlock your full academic potential — coming soon."
                                features={[
                                    "AI-powered quiz generation",
                                    "Personalized study recommendations",
                                    "Detailed performance analytics",
                                    "Premium offline study packs",
                                    "Priority support",
                                ]}
                                ctaText="Get notified when Premium launches"
                                ctaHref="#early-access"
                                highlighted
                                badge="Coming Soon"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Early Access ===== */}
            <section className="section section--dark" id="early-access">
                <div className="container">
                    <div className={styles.earlyAccess}>
                        <h2>Are you an ABU Zaria Student? You&#39;re First in Line.</h2>
                        <p>
                            We are currently live in beta for undergraduates across all
                            departments at Ahmadu Bello University. Secure your early access
                            today.
                        </p>
                        <AceAcadWaitlistForm />
                        <div style={{ marginTop: "2rem", textAlign: "center" }}>
                            <a href="/products/ace-acad/privacy" style={{ color: "var(--color-primary-light)", textDecoration: "underline", fontSize: "0.9rem" }}>
                                Read our Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="section section--light">
                <div className="container">
                    <div className="section-header">
                        <h2>Frequently Asked Questions</h2>
                    </div>
                    <AceAcadFAQ />
                </div>
            </section>
        </>
    );
}
