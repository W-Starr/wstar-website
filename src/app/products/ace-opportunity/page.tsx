import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import FeatureCard from "@/components/FeatureCard";
import { Target, MessageSquare, FileCheck, TrendingUp } from "lucide-react";
import styles from "./aceopportunity.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ace-Opportunity — AI Career Agent for African Students & Job Seekers | WSTAR",
    description:
        "Ace-Opportunity is an AI agent that finds jobs, internships, scholarships, and fellowships that fit you, then helps you prepare to win them. Live now, in active beta.",
};

export default function AceOpportunityPage() {
    return (
        <>
            {/* ===== Hero ===== */}
            <HeroSection
                label="CareerTech Product"
                title={
                    <>
                        Your AI-Powered{" "}
                        <span>Career Strategist.</span>
                    </>
                }
                description="An AI agent that finds jobs, internships, scholarships, and fellowships that actually fit you — then helps you prepare to win them. Live now, in active beta with real students and job seekers."
                visual={
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div className={styles.previewCard}>
                            <div className={styles.previewChrome}>
                                <span className={styles.previewDot} />
                                <span className={styles.previewDot} />
                                <span className={styles.previewDot} />
                                <span className={styles.previewUrl}>ace-opportunity.onrender.com</span>
                            </div>
                            <div className={styles.previewBody}>
                                <span className={styles.previewTag}>AI Career Strategist</span>
                                <h4>
                                    Find real jobs, internships and scholarships —{" "}
                                    <span>then win them</span>
                                </h4>
                                <p>
                                    Searches real opportunities, builds a tailored CV, writes a
                                    fact-checked cover letter, and runs mock interviews.
                                </p>
                            </div>
                        </div>
                    </div>
                }
            >
                <CTAButton href="https://ace-opportunity.onrender.com" variant="primary" size="large" external>
                    Join the Beta
                </CTAButton>
                <CTAButton href="#features" variant="secondary" size="large">
                    See How It Works
                </CTAButton>
            </HeroSection>

            {/* ===== Problem vs Solution ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Generic Job Boards Weren&apos;t Built For You.</h2>
                    </div>
                    <div className={styles.problemSolution}>
                        <div className={styles.problemSide}>
                            <p className={`${styles.psLabel} ${styles.psLabelProblem}`}>
                                The Problem
                            </p>
                            <h3>What job seekers face today</h3>
                            <p>
                                Generic job boards bury students in stale, irrelevant, or
                                already-expired listings — many skewed toward roles and markets
                                that don&apos;t match a Nigerian student&apos;s actual level or
                                field, with zero guidance on how to actually win the opportunity
                                once found.
                            </p>
                        </div>
                        <div className={styles.solutionSide}>
                            <p className={`${styles.psLabel} ${styles.psLabelSolution}`}>
                                The Solution
                            </p>
                            <h3>How Ace-Opportunity helps</h3>
                            <p>
                                Ace-Opportunity replaces the generic feed with an AI agent that
                                verifies opportunities are real and current, matches them to your
                                actual skills and course of study, and coaches you through
                                closing the gap and acing the interview.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Features ===== */}
            <section className="section section--light" id="features">
                <div className="container">
                    <div className="section-header">
                        <h2 style={{ color: "var(--deep-navy)" }}>
                            From First-Ace to First Job.
                        </h2>
                        <p style={{ color: "var(--ink-secondary)" }}>
                            Ace-Acad gets a student through their coursework. Ace-Opportunity
                            gets them into what comes after — a job, internship, scholarship,
                            or fellowship.
                        </p>
                    </div>
                    <div className={styles.featuresGrid}>
                        <FeatureCard
                            light
                            icon={<Target size={28} />}
                            title="Verified, Personalized Matching"
                            description="Jobs, internships, scholarships, and fellowships ranked to your real skills, course, and academic level."
                        />
                        <FeatureCard
                            light
                            icon={<MessageSquare size={28} />}
                            title="Conversational AI Interview Prep"
                            description="Role-specific mock interview questions with instant, scored feedback — across every discipline, not just tech."
                        />
                        <FeatureCard
                            light
                            icon={<FileCheck size={28} />}
                            title="AI Cover Letters & CV Review"
                            description="Drafted and reviewed strictly from your own verified profile — never invented claims."
                        />
                        <FeatureCard
                            light
                            icon={<TrendingUp size={28} />}
                            title="Skill-Gap Coaching & Roadmaps"
                            description="A clear, time-boxed study plan with real free resources to close the gap to your target role."
                        />
                    </div>
                </div>
            </section>

            {/* ===== Status / Closing CTA ===== */}
            <section className="section section--dark" id="beta">
                <div className="container">
                    <div className={styles.statusSection}>
                        <span className={styles.statusBadge}>
                            <span className={styles.livePulseDot} />
                            Now in Active Beta
                        </span>
                        <h2>Built With Real User Feedback.</h2>
                        <p>
                            Ace-Opportunity is live today, and we&apos;re iterating fast based
                            on feedback from real students and job seekers using it right now.
                            Join the beta and help shape what we build next. Free during beta.
                        </p>
                        <CTAButton href="https://ace-opportunity.onrender.com" variant="primary" size="large" external>
                            Join the Beta
                        </CTAButton>
                    </div>
                </div>
            </section>
        </>
    );
}
