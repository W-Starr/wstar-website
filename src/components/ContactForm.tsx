"use client";

import { useState } from "react";
import { Briefcase, Building2, GraduationCap, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import ctaStyles from "./CTAButton.module.css";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
    showContext?: boolean;
    light?: boolean;
    formType?: "contact" | "investor";
}

type SubmitState = "idle" | "submitting" | "success" | "error";

const ContactForm = ({ showContext = true, light = false, formType = "contact" }: ContactFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        category: "",
        message: "",
        website: "", // honeypot — real visitors never see or fill this in
    });
    const [state, setState] = useState<SubmitState>("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setState("submitting");
        setErrorMessage("");

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    formType,
                    name: formData.name,
                    email: formData.email,
                    website: formData.website,
                    details: {
                        category: formData.category,
                        message: formData.message,
                    },
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || "Something went wrong. Please try again.");
            }

            setState("success");
            setFormData({ name: "", email: "", category: "", message: "", website: "" });
        } catch (err) {
            setState("error");
            setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        }
    };

    if (state === "success") {
        return (
            <div className={styles.formSection}>
                <div className={styles.successState}>
                    <CheckCircle2 size={40} />
                    <h3>Message Sent</h3>
                    <p>Thank you for reaching out — we&apos;ll get back to you soon.</p>
                    <button
                        type="button"
                        className={styles.sendAnotherBtn}
                        onClick={() => setState("idle")}
                    >
                        Send another message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formSection}>
            <form
                className={`${styles.form} ${light ? styles.formLight : ""}`}
                onSubmit={handleSubmit}
            >
                {/* Honeypot field — hidden from real users, bots tend to fill every input */}
                <div className={styles.honeypot} aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                        id="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                </div>

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

                {state === "error" && (
                    <div className={styles.errorState}>
                        <AlertCircle size={16} />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div className={styles.submitBtn}>
                    <button
                        type="submit"
                        className={`${ctaStyles.button} ${ctaStyles.primary}`}
                        disabled={state === "submitting"}
                    >
                        {state === "submitting" ? (
                            <>
                                <Loader2 size={16} className={styles.spinner} /> Sending...
                            </>
                        ) : (
                            "Send Message"
                        )}
                    </button>
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
