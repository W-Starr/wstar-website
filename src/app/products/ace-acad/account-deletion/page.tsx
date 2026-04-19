"use client";

import React, { useState } from 'react';
import styles from './accountDeletion.module.css';

export default function AccountDeletionPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const SUPPORT_EMAIL = "support@wstartech.ng";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && username) {
            setIsSubmitted(true);
            const subject = encodeURIComponent('Account Deletion Request - ACE Academy');
            const body = encodeURIComponent(`Hello,\n\nPlease delete my ACE Academy account and all associated data.\n\nUsername: ${username}\nRegistered Email: ${email}\n\nThank you.`);
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
                            <h1 className={styles.title}>Delete Your Account</h1>
                            <p className={styles.description}>We're sorry to see you go. Submitting this request will permanently delete your ACE Academy account and all associated data.</p>
                        </div>

                        <div className={styles.warningBox}>
                            <p><strong>Warning:</strong> This action is irreversible. All your progress, subscriptions, and personal data will be wiped from our servers within 14 days.</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.formGroup}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username" className={styles.label}>Username</label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username"
                                    placeholder="your_username" 
                                    required 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Account Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    placeholder="you@example.com" 
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
                                Request Deletion
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
                        <p className={styles.description}>Your email client should now open to complete the request. If it didn't, please email us directly at <strong>{SUPPORT_EMAIL}</strong> from your registered email account.</p>
                        <button onClick={() => setIsSubmitted(false)} className={styles.goBackButton}>Go Back</button>
                    </div>
                )}
                <div className={styles.footer}>
                    &copy; 2026 ACE Academy. All rights reserved.
                </div>
            </div>
        </div>
    );
}
