import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import FeatureCard from "@/components/FeatureCard";
import PricingCard from "@/components/PricingCard";
import Image from "next/image";
import { BookOpen, Target, Layers, BarChart } from "lucide-react";
import styles from "./aceacad.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ace-Acad — Smarter Studying, Simplified | WSTAR",
    description:
        "Ace-Acad is an intelligent learning app designed for Nigerian undergraduates. Offline e-library, flashcard quizzes, study guides, and GPA calculator.",
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
                description="Ace-Acad is an intelligent learning app that personalizes your reading, quizzes, and study reminders. Designed specifically for the Nigerian university curriculum, it empowers you to achieve higher retention with minimal effort."
                visual={
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Image src="/images/ace-acad-mockup.png" alt="Ace-Acad App Preview" width={280} height={500} style={{ objectFit: 'contain', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderRadius: 'var(--radius-lg)' }} priority />
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
                        <div className="glow-line glow-line--center" />
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
                        <div className="glow-line glow-line--center" />
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
                </div>
            </section>

            {/* ===== Pricing ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="glow-line glow-line--center" />
                        <h2>Start Free. Upgrade for Ultimate Power.</h2>
                        <p>
                            Choose the plan that fits your study goals.
                        </p>
                    </div>
                    <div className={styles.pricingContainer}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                            <PricingCard
                                plan="Free"
                                price="₦0"
                                description="Everything you need to get started."
                                features={[
                                    "Basic e-library access",
                                    "Standard quizzes",
                                    "Campus guide",
                                    "GPA calculator",
                                ]}
                                ctaText="Get Started Free"
                                ctaHref="#early-access"
                            />
                            <PricingCard
                                plan="Premium"
                                price="₦1,500 – ₦3,000"
                                period="month"
                                description="Unlock your full academic potential."
                                features={[
                                    "AI-powered quiz generation",
                                    "Personalized study recommendations",
                                    "Detailed performance analytics",
                                    "Premium offline study packs",
                                    "Priority support",
                                ]}
                                ctaText="Choose Premium"
                                ctaHref="#early-access"
                                highlighted
                                badge="Recommended"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Early Access ===== */}
            <section className="section section--dark" id="early-access">
                <div className="container">
                    <div className={styles.earlyAccess}>
                        <div className="glow-line glow-line--center" />
                        <h2>Are you an ABU Zaria Student? You&#39;re First in Line.</h2>
                        <p>
                            We are currently rolling out our Beta version for undergraduates,
                            starting with the Mechatronics Department and the Faculty of
                            Engineering at Ahmadu Bello University. Secure your early access
                            today.
                        </p>
                        <div className={styles.emailForm}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={styles.emailInput}
                            />
                            <CTAButton href="#" variant="primary">
                                Claim Early Access
                            </CTAButton>
                        </div>
                        <div style={{ marginTop: "2rem", textAlign: "center" }}>
                            <a href="/products/ace-acad/privacy" style={{ color: "var(--color-primary-light)", textDecoration: "underline", fontSize: "0.9rem" }}>
                                Read our Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
