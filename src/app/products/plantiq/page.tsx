import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import FeatureCard from "@/components/FeatureCard";
import Image from "next/image";
import { Droplet, RefreshCw, Sun, Smartphone } from "lucide-react";
import styles from "./plantiq.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PlantIQ — Automated Smart Gardening | WSTAR",
    description:
        "PlantIQ is a modular IoT device that optimizes water use for home gardeners and small-scale farmers. Solar-powered, app-controlled smart gardening.",
};

export default function PlantIQPage() {
    return (
        <>
            {/* ===== Hero ===== */}
            <HeroSection
                label="AgriTech Product"
                title={
                    <>
                        Effortless Growth.{" "}
                        <span>Automated Smart Gardening for Everyone.</span>
                    </>
                }
                description="Meet PlantIQ, a modular IoT device that optimizes water use for home gardeners and small-scale farmers. Whether you are a busy urban household or a STEM educator, PlantIQ enables you to reliably grow plants and food without requiring any agricultural expertise."
                visual={
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Image src="/images/plantiq-icon.png" alt="PlantIQ Device" width={280} height={280} style={{ objectFit: 'contain', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} priority />
                    </div>
                }
            >
                <CTAButton href="#reserve" variant="primary" size="large">
                    Join the Pilot Program
                </CTAButton>
                <CTAButton href="#features" variant="secondary" size="large">
                    See How It Works
                </CTAButton>
            </HeroSection>

            {/* ===== Problem vs Solution ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Stop Guessing. Start Growing.</h2>
                    </div>
                    <div className={styles.problemSolution}>
                        <div className={styles.problemSide}>
                            <p className={`${styles.psLabel} ${styles.psLabelProblem}`}>
                                The Problem
                            </p>
                            <h3>The struggle of plant care</h3>
                            <p>
                                Busy schedules, frequent travel, and a lack of plant knowledge
                                often make consistent plant care a struggle, contributing to
                                broader issues like food insecurity in urban areas.
                            </p>
                        </div>
                        <div className={styles.solutionSide}>
                            <p className={`${styles.psLabel} ${styles.psLabelSolution}`}>
                                The Solution
                            </p>
                            <h3>Automation made simple</h3>
                            <p>
                                PlantIQ removes the guesswork with affordable, beginner-friendly
                                automation built from locally sourced materials. Smart sensors
                                and solar power make it work anywhere.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Core Features ===== */}
            <section className="section section--light" id="features">
                <div className="container">
                    <div className="section-header">
                        <h2>Built for Sustainability and Convenience.</h2>
                        <p>
                            Advanced IoT technology meets practical, everyday gardening.
                        </p>
                    </div>
                    <div className={styles.featuresGrid}>
                        <FeatureCard
                            icon={<Droplet size={32} />}
                            title="Automated Watering"
                            description="Smart soil moisture sensors ensure your plants get exactly the water they need, exactly when they need it."
                            light
                        />
                        <FeatureCard
                            icon={<RefreshCw size={32} />}
                            title="Self-Refilling System"
                            description="Never worry about an empty tank. PlantIQ uses water level sensors linked directly to your main water source."
                            light
                        />
                        <FeatureCard
                            icon={<Sun size={32} />}
                            title="Solar & Battery Powered"
                            description="Fully rechargeable with solar integration and a massive 24,000 mAh battery capacity for uninterrupted, off-grid functionality."
                            light
                        />
                        <FeatureCard
                            icon={<Smartphone size={32} />}
                            title="IoT Mobile App"
                            description="Control your garden from anywhere. Get step-by-step planting guides and tailored care instructions right on your phone."
                            light
                        />
                    </div>
                </div>
            </section>

            {/* ===== Future Roadmap ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Beyond Watering: The Smart Mini Farm Ecosystem.</h2>
                        <p>
                            PlantIQ is just the beginning. Here&apos;s what&apos;s coming next.
                        </p>
                    </div>
                    <div className={styles.roadmap}>
                        <div className={styles.roadmapItem}>
                            <p className={styles.roadmapPhase}>Phase 1 — Now</p>
                            <h3>Smart Watering MVP</h3>
                            <p>
                                Core automated watering system with soil moisture sensing,
                                self-refilling, and solar power integration.
                            </p>
                        </div>
                        <div className={styles.roadmapItem}>
                            <p className={styles.roadmapPhase}>Phase 2 — Next</p>
                            <h3>AI Vision & Pest Detection</h3>
                            <p>
                                Computer vision capabilities for identifying plant diseases and
                                pest infestations in real-time.
                            </p>
                        </div>
                        <div className={styles.roadmapItem}>
                            <p className={styles.roadmapPhase}>Phase 3 — Future</p>
                            <h3>Modular Climate Sync</h3>
                            <p>
                                Expansion modules for temperature, humidity, and light control —
                                creating a complete indoor farming ecosystem.
                            </p>
                        </div>
                        <div className={styles.roadmapItem}>
                            <p className={styles.roadmapPhase}>Phase 4 — Vision</p>
                            <h3>In-App Marketplace</h3>
                            <p>
                                An exclusive marketplace for seeds, accessories, and community
                                knowledge sharing.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Bottom Pricing / Reserve ===== */}
            <section className="section section--dark" id="reserve">
                <div className="container">
                    <div className={styles.pricingBottom}>
                        <h2>Ready to Transform Your Space?</h2>
                        <p>
                            We are currently finalizing our MVP and preparing for a 500-unit
                            pilot launch. Secure your PlantIQ device today.
                        </p>
                        <p className={styles.priceTag}>
                            ₦80,000 <span>estimated</span>
                        </p>
                        <p className={styles.priceNote}>
                            Includes the PlantIQ device, solar panel, and mobile app access.
                        </p>
                        <CTAButton href="/contact" variant="primary" size="large">
                            Join the Waitlist
                        </CTAButton>
                    </div>
                </div>
            </section>
        </>
    );
}
