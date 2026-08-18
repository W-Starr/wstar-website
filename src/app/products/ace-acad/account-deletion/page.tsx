"use client";

import React, { useState } from 'react';
import styles from './accountDeletion.module.css';

export default function AccountDeletionPage() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const SUPPORT_EMAIL = "privacy@wstartech.ng";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && fullName) {
            setIsSubmitted(true);
            const subject = encodeURIComponent('Account Deletion Request - Ace Acad (NDPA Sec 34)');
            const body = encodeURIComponent(
                `Hello WSTAR Data Protection Team,\n\n` +
                `Pursuant to Section 34(1)(d) of the Nigeria Data Protection Act 2023, I request the permanent deletion of my Ace Acad user account and all associated personal data.\n\n` +
                `Full Name: ${fullName}\n` +
                `Registered Email: ${email}\n\n` +
                `I understand this action is permanent and will remove my enrollments, study progress, and authentication profile.\n\n` +
                `Thank you.`
            );
            window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {!isSubmitted ? (
                    <div id="requestForm">
                        <div className={styles.header}>
                            <div className={styles.logoPlaceholder}>A</div>
                            <h1 className={styles.title}>Delete Your Ace Acad Account</h1>
                            <p className={styles.description}>
                                We are committed to honoring your right to erasure under the Nigeria Data Protection Act 2023 (NDPA).
                            </p>
                        </div>

                        <div className={styles.warningBox}>
                            <p>
                                <strong>Important:</strong> Account deletion is permanent. All course enrollments, study progress, quiz scores, and profile records will be permanently wiped within 14 calendar days.
                            </p>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                💡 <em>Tip: You can also instantly delete your account self-service inside the Ace Acad mobile app under <strong>More &gt; Privacy Rights &gt; Delete Account</strong>.</em>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.formGroup}>
                            <div className={styles.formGroup}>
                                <label htmlFor="fullName" className={styles.label}>Full Name</label>
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    name="fullName"
                                    placeholder="Your Full Name" 
                                    required 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Registered Account Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    placeholder="you@student.abu.edu.ng" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            
                            <button type="submit" className={styles.button}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Submit Deletion Request
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h1 className={styles.title}>Request Initialized</h1>
                        <p className={styles.description}>
                            Your email client should now open to dispatch your verified deletion request. If it did not open automatically, please send an email directly to <strong>{SUPPORT_EMAIL}</strong> from your registered account.
                        </p>
                        <button onClick={() => setIsSubmitted(false)} className={styles.goBackButton}>Go Back</button>
                    </div>
                )}
                <div className={styles.footer}>
                    &copy; 2026 WSTAR (Ace Acad). All rights reserved.
                </div>
            </div>
        </div>
    );
}
