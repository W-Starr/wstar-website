"use client";

import { useState } from "react";
import { Briefcase, Building2, GraduationCap } from "lucide-react";
import CTAButton from "./CTAButton";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
    showContext?: boolean;
    light?: boolean;
}

const ContactForm = ({ showContext = true, light = false }: ContactFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        category: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submission logic would go here
        alert("Thank you for your message! We'll get back to you soon.");
        setFormData({ name: "", email: "", category: "", message: "" });
    };

    return (
        <div className={styles.formSection}>
            <form
                className={`${styles.form} ${light ? styles.formLight : ""}`}
                onSubmit={handleSubmit}
            >
                <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="category">I am a...</label>
                    <select
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                        required
                    >
                        <option value="" disabled>
                            Select an option
                        </option>
                        <option value="investor">Investor</option>
                        <option value="institution">Institution / NGO</option>
                        <option value="professional">Professional / Collaborator</option>
                        <option value="student">Student</option>
                        <option value="general">General Inquiry</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        placeholder="Tell us about your interest..."
                        value={formData.message}
                        onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                        }
                        required
                    />
                </div>
                <div className={styles.submitBtn}>
                    <CTAButton href="#" variant="primary">
                        Send Message
                    </CTAButton>
                </div>
            </form>

            {showContext && (
                <div className={styles.formContextBox}>
                    <p className={styles.contextTitle}>
                        We are always open to new connections. Reach out if you are:
                    </p>
                    <div className={styles.contextList}>
                        <div className={styles.contextItem}>
                            <span className={styles.contextIcon}><Briefcase size={18} /></span>
                            <div>
                                <p className={styles.contextItemTitle}>An Investor</p>
                                <p className={styles.contextItemDesc}>
                                    Looking to back scalable, high-impact ventures.
                                </p>
                            </div>
                        </div>
                        <div className={styles.contextItem}>
                            <span className={styles.contextIcon}><Building2 size={18} /></span>
                            <div>
                                <p className={styles.contextItemTitle}>An Institution or NGO</p>
                                <p className={styles.contextItemDesc}>
                                    Looking to adopt and scale tailored tech solutions.
                                </p>
                            </div>
                        </div>
                        <div className={styles.contextItem}>
                            <span className={styles.contextIcon}><GraduationCap size={18} /></span>
                            <div>
                                <p className={styles.contextItemTitle}>
                                    A Student or Professional
                                </p>
                                <p className={styles.contextItemDesc}>
                                    Wanting to contribute your skills and talent to our mission.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactForm;
