import HeroSection from "@/components/HeroSection";
import ContactForm from "@/components/ContactForm";
import { MapPin, Mail, Globe } from "lucide-react";
import styles from "./contact.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us — WSTAR",
    description:
        "Get in touch with the WSTAR team. We're seeking partners, collaborators, investors, and institutions to build the future of African tech.",
};

export default function ContactPage() {
    return (
        <>
            {/* ===== Hero ===== */}
            <HeroSection
                label="Get In Touch"
                title={
                    <>
                        Get in Touch with <span>WSTAR.</span>
                    </>
                }
                description="We are actively seeking partners, collaborators, investors, and institutions to join us in transforming Africa's challenges into global opportunities. Whether you want to back high-impact ventures or adopt tailored solutions, let's build the future together."
                compact
            />

            {/* ===== Direct Contact Info ===== */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Reach Out Directly</h2>
                    </div>
                    <div className={styles.contactInfoGrid}>
                        <div className={styles.contactCard}>
                            <div className={styles.contactIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={40} color="var(--bright-blue)" />
                            </div>
                            <h3>Head Office</h3>
                            <p>Ahmadu Bello University, Zaria, Nigeria</p>
                        </div>
                        <div className={styles.contactCard}>
                            <div className={styles.contactIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={40} color="var(--bright-blue)" />
                            </div>
                            <h3>Email</h3>
                            <p>
                                <a href="mailto:wstar5552@gmail.com">wstar5552@gmail.com</a>
                            </p>
                        </div>
                        <div className={styles.contactCard}>
                            <div className={styles.contactIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Globe size={40} color="var(--bright-blue)" />
                            </div>
                            <h3>Website</h3>
                            <p>
                                <a href="https://www.wstartech.ng" target="_blank" rel="noopener noreferrer">
                                    www.wstartech.ng
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Contact Form ===== */}
            <section className="section section--dark">
                <div className="container">
                    <div className="section-header">
                        <h2>Send Us a Message</h2>
                    </div>
                    <ContactForm />
                </div>
            </section>
        </>
    );
}
