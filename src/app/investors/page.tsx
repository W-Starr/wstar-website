import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import FeatureCard from "@/components/FeatureCard";
import ContactForm from "@/components/ContactForm";
import { Rocket, Banknote, TrendingUp, GraduationCap, Sprout, Users } from "lucide-react";
import styles from "./investors.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Investors & Partners — WSTAR",
    description:
        "Back the future of African innovation. Explore WSTAR's market opportunity, financial projections, and partnership opportunities across Industrial AI, EdTech, AgriTech, and CareerTech.",
};

export default function InvestorsPage() {
    return (
        <>
            {/* ===== Hero ===== */}
            <HeroSection
                label="Investment Opportunity"
                title={
                    <>
                        Back the Future of{" "}
                        <span>African Innovation.</span>
                    </>
                }
                description="WSTAR is actively seeking partners, collaborators, and investors to join us in transforming Africa's challenges into global opportunities. We build scalable, high-impact ventures that solve critical problems in education, agriculture, and sustainability."
                compact
            >
                <CTAButton href="#contact-form" variant="primary" size="large">
                    Request Full Pitch Deck
                </CTAButton>
                <CTAButton href="/contact" variant="secondary" size="large">
                    Schedule a Meeting
                </CTAButton>
            </HeroSection>

            {/* ===== Market Opportunity ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Massive Markets. Untapped Potential.</h2>
                        <p>
                            Four high-growth sectors spanning African and global markets.
                        </p>
                    </div>
                    <div className={styles.marketGrid}>
                        <div className={styles.marketCard}>
                            <p className={styles.marketLabel}>EdTech — Ace-Acad</p>
                            <span className={styles.marketStat}>2M+</span>
                            <span className={styles.marketStatLabel}>
                                Undergraduates in Nigeria alone
                            </span>
                            <h3>15M+ across Africa</h3>
                            <p>
                                A rapidly growing demand for personalized, offline-capable
                                digital learning platforms tailored to the local curriculum. The
                                market is largely untapped by quality, locally-built solutions.
                            </p>
                        </div>
                        <div className={styles.marketCard}>
                            <p className={styles.marketLabel}>AgriTech — PlantIQ</p>
                            <span className={styles.marketStat}>$26.83M</span>
                            <span className={styles.marketStatLabel}>
                                Nigerian smart agriculture market by 2025
                            </span>
                            <h3>10.5% CAGR in a $14B+ global market</h3>
                            <p>
                                Capturing the rising interest in home-based gardening and urban
                                food security. Our affordable IoT solution targets a massively
                                underserved segment.
                            </p>
                        </div>
                        <div className={styles.marketCard}>
                            <p className={styles.marketLabel}>Industrial AI — WSTAR AI Solutions</p>
                            <span className={styles.marketStat}>Underserved</span>
                            <span className={styles.marketStatLabel}>
                                Mid-market industrial &amp; B2B distributors globally
                            </span>
                            <h3>Directional opportunity — no third-party estimate cited yet</h3>
                            <p>
                                Mid-market manufacturers, distributors, and technical service
                                teams carry significant administrative overhead with little
                                enterprise-grade AI tooling built for their workflows.
                            </p>
                        </div>
                        <div className={styles.marketCard}>
                            <p className={styles.marketLabel}>CareerTech — Ace-Opportunity</p>
                            <span className={styles.marketStat}>Growing Fast</span>
                            <span className={styles.marketStatLabel}>
                                Nigerian graduates &amp; job seekers entering the market yearly
                            </span>
                            <h3>Directional opportunity — no third-party estimate cited yet</h3>
                            <p>
                                A large and growing addressable market of Nigerian graduates and
                                job seekers — the natural next stage after Ace-Acad, still
                                underserved by generic global job boards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Financial Overview ===== */}
            <section className="section section--light">
                <div className="container">
                    <div className="section-header">
                        <h2>Bootstrapped for MVP. Ready to Scale.</h2>
                        <p>
                            Transparent financials and diversified revenue streams.
                        </p>
                    </div>
                    <div className={styles.financeGrid}>
                        <div className={styles.financeCard}>
                            <div className={styles.financeIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Rocket size={40} color="var(--deep-navy)" />
                            </div>
                            <h3>Current Status</h3>
                            <p>
                                Ace-Opportunity is live in open beta with real, unaffiliated
                                users — our furthest-along venture. WSTAR AI Solutions is running
                                active sandbox engagements, while Ace-Acad and PlantIQ remain in
                                pilot/MVP development. All self-funded through team contributions
                                and strategic resource allocation.
                            </p>
                            <span className={styles.financeHighlight}>
                                ₦820K total MVP budget
                            </span>
                        </div>
                        <div className={styles.financeCard}>
                            <div className={styles.financeIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Banknote size={40} color="var(--deep-navy)" />
                            </div>
                            <h3>Revenue Streams</h3>
                            <p>
                                Diversified models: freemium app subscriptions, institutional
                                licensing, B2B school deals, and direct IoT device sales.
                            </p>
                            <span className={styles.financeHighlight}>4 revenue channels</span>
                        </div>
                        <div className={styles.financeCard}>
                            <div className={styles.financeIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUp size={40} color="var(--deep-navy)" />
                            </div>
                            <h3>3-Year Projections</h3>
                            <p>
                                Ace-Acad: 50K users, ₦20M annual revenue. PlantIQ: 500-unit
                                pilot, ₦37M early revenue.
                            </p>
                            <span className={styles.financeHighlight}>₦57M+ by Year 3</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== WSTAR Advantage / ESG ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Yielding Returns. Driving Impact.</h2>
                        <p>
                            Aligned with ESG priorities — social impact that delivers
                            measurable returns.
                        </p>
                    </div>
                    <div className={styles.esgGrid}>
                        <FeatureCard
                            icon={<GraduationCap size={32} />}
                            title="Education Equity"
                            description="Bridging the gap for under-resourced students with offline-first tools and locally-aligned curriculum."
                        />
                        <FeatureCard
                            icon={<Sprout size={32} />}
                            title="Food Security"
                            description="Empowering households to grow food locally in resource-constrained environments with affordable automation."
                        />
                        <FeatureCard
                            icon={<Users size={32} />}
                            title="Youth Empowerment"
                            description="Built entirely by young Nigerian innovators, fostering local tech talent and a future-ready workforce."
                        />
                    </div>
                </div>
            </section>

            {/* ===== Bottom Contact Form ===== */}
            <section className="section section--dark" id="contact-form">
                <div className="container">
                    <div className={styles.investorForm}>
                        <h2>Let&apos;s Build the Future Together.</h2>
                        <p>
                            Whether you are an investor, an institution wanting to adopt our
                            solutions, or a professional looking to collaborate, we want to
                            hear from you.
                        </p>
                    </div>
                    <ContactForm formType="investor" />
                </div>
            </section>
        </>
    );
}
