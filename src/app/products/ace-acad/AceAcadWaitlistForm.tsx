"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import styles from "./aceacad.module.css";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function AceAcadWaitlistForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        yearOfStudy: "",
        website: "", // honeypot
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
                    formType: "ace-acad-waitlist",
                    name: formData.name,
                    email: formData.email,
                    website: formData.website,
                    details: {
                        department: formData.department,
                        yearOfStudy: formData.yearOfStudy,
                    },
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || "Something went wrong. Please try again.");
            }

            setState("success");
            setFormData({ name: "", email: "", department: "", yearOfStudy: "", website: "" });
        } catch (err) {
            setState("error");
            setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        }
    };

    if (state === "success") {
        return (
            <div className={styles.waitlistSuccess}>
                <CheckCircle2 size={32} />
                <p>You&apos;re on the list! We&apos;ll email you as soon as your access is ready.</p>
            </div>
        );
    }

    return (
        <form className={styles.waitlistForm} onSubmit={handleSubmit}>
            {/* Honeypot field — hidden from real users, bots tend to fill every input */}
            <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
                <label htmlFor="ace-acad-website">Website</label>
                <input
                    id="ace-acad-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
            </div>

            <div className={styles.waitlistGrid}>
                <input
                    type="text"
                    placeholder="Full name"
                    className={styles.emailInput}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Enter your email"
                    className={styles.emailInput}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Department / Faculty"
                    className={styles.emailInput}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                />
                <select
                    className={styles.emailInput}
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    required
                >
                    <option value="" disabled>Year of study</option>
                    <option value="100L">100 Level</option>
                    <option value="200L">200 Level</option>
                    <option value="300L">300 Level</option>
                    <option value="400L">400 Level</option>
                    <option value="500L+">500 Level+</option>
                </select>
            </div>

            {state === "error" && (
                <div className={styles.waitlistError}>
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                </div>
            )}

            <button type="submit" className={styles.waitlistSubmitBtn} disabled={state === "submitting"}>
                {state === "submitting" ? (
                    <>
                        <Loader2 size={16} className={styles.spinnerIcon} /> Submitting...
                    </>
                ) : (
                    "Claim Early Access"
                )}
            </button>
        </form>
    );
}
