import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import FeatureCard from "@/components/FeatureCard";
import Image from "next/image";
import { Telescope, Target, Lightbulb, Trophy, Globe, GraduationCap, Sprout, Users } from "lucide-react";
import styles from "./about.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us — WSTAR",
    description:
        "Learn about WSTAR's vision, mission, core values, and the young innovators behind our EdTech and AgriTech solutions.",
};

export default function AboutPage() {
    return (
        <>
            {/* ===== Hero ===== */}
            <HeroSection
                label="About WSTAR"
                title={
                    <>
                        World of Science, Technology,{" "}
                        <span>Advancement & Research</span>
                    </>
                }
                description="A youth-led, innovation-driven technology company in Nigeria focused on solving real-world challenges through impactful EdTech and AgriTech solutions."
                compact
            >
                <CTAButton href="/contact" variant="primary">
                    Get In Touch
                </CTAButton>
            </HeroSection>

            {/* ===== Vision & Mission ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Purpose</h2>
                    </div>
                    <div className={styles.visionMission}>
                        <div className={styles.vmCard}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Telescope size={24} /> Vision</h3>
                            <p>
                                To position Nigeria and Africa as global leaders in technology
                                innovation by creating solutions that address critical
                                challenges in education, agriculture, and sustainability.
                            </p>
                        </div>
                        <div className={styles.vmCard}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Target size={24} /> Mission</h3>
                            <p>
                                To deliver measurable impact through interdisciplinary expertise
                                and bold creativity—designing, developing, and scaling technology
                                products that compete on the world stage.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Core Values ===== */}
            <section className="section section--light">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Core Values</h2>
                        <p>
                            The principles that drive every engineering decision, every product, and every
                            partnership at WSTAR.
                        </p>
                    </div>
                    <div className={styles.valuesGrid}>
                        <FeatureCard
                            icon={<Lightbulb size={32} />}
                            title="Innovation"
                            description="We push the boundaries of what's possible, combining emerging technologies with local insights to create grounded solutions."
                            light
                        />
                        <FeatureCard
                            icon={<Trophy size={32} />}
                            title="Excellence"
                            description="We hold ourselves to the highest standards in engineering, design, and execution — delivering products that rival global competitors."
                            light
                        />
                        <FeatureCard
                            icon={<Globe size={32} />}
                            title="Impact"
                            description="Every line of code, every circuit, and every partnership is driven by the goal of creating lasting, measurable change in people's lives."
                            light
                        />
                    </div>
                </div>
            </section>

            {/* ===== The Leadership Team ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Leadership Team</h2>
                        <p>
                            Young Nigerian innovators united by a shared vision to transform
                            Africa through world-class software engineering and hardware design.
                        </p>
                    </div>
                    <div className={styles.teamGrid} style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className={styles.teamCard}>
                            <div className={styles.teamPhoto} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Image src="/images/wstar-icon.png" alt="Ibrahim Abdulwahab" width={80} height={80} style={{ objectFit: 'contain' }} />
                            </div>
                            <div className={styles.teamInfo}>
                                <h3>Ibrahim Abdulwahab</h3>
                                <p className={styles.teamRole}>Founder & CEO</p>
                                <p>
                                    Leading WSTAR&apos;s product vision, institutional partnerships, and commercial strategy for African technology innovation.
                                </p>
                            </div>
                        </div>

                        <div className={styles.teamCard}>
                            <div className={styles.teamPhoto} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Image src="/images/wstar-icon.png" alt="Abdulaziz Abdulwahab" width={80} height={80} style={{ objectFit: 'contain' }} />
                            </div>
                            <div className={styles.teamInfo}>
                                <h3>Abdulaziz Abdulwahab</h3>
                                <p className={styles.teamRole}>Lead Technical Architect</p>
                                <p>
                                    Architecting the Ace Acad mobile engine, syllabus ingestion pipelines, offline SQLite synchronization, and Cloud Firestore infrastructure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Social Impact ===== */}
            <section className="section section--dark">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Social Impact</h2>
                        <p>
                            Global innovation, deeply rooted in local realities. We build for
                            the communities that need it most.
                        </p>
                    </div>
                    <div className={styles.valuesGrid}>
                        <FeatureCard
                            icon={<GraduationCap size={32} />}
                            title="Education Access"
                            description="Providing offline-first study tools to undergraduates who lack reliable internet access in university hostels."
                        />
                        <FeatureCard
                            icon={<Sprout size={32} />}
                            title="Food Security"
                            description="Enabling urban households to grow food locally with affordable IoT automation."
                        />
                        <FeatureCard
                            icon={<Users size={32} />}
                            title="Youth Empowerment"
                            description="Creating opportunities for young Nigerians to build, innovate, and lead in tech."
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
