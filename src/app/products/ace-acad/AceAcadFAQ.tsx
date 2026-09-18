"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./aceacad.module.css";

interface FAQItem {
    question: string;
    answer: string;
}

// Rollout timeline (Q3) reflects what's already stated on this page — confirm the
// specific expansion timeline with Ibrahim before treating it as a firm date.
const FAQ_ITEMS: FAQItem[] = [
    {
        question: "Does Ace-Acad use my data bundle?",
        answer:
            "No — Ace-Acad is built offline-first. Once your course materials, study guides, and quizzes are downloaded, you can read, review, and test yourself with zero additional data required. You only need a connection to sync new content or updates.",
    },
    {
        question: "Is Ace-Acad really free?",
        answer:
            "Yes. The current beta is 100% free, with no payment information collected. A premium tier is planned for the future, but pricing hasn't been finalized — it will be clearly disclosed before it launches, and the free tier will remain available.",
    },
    {
        question: "When is Ace-Acad coming to my department/university?",
        answer:
            "We're currently live in beta for undergraduates across all departments at Ahmadu Bello University, Zaria. We're expanding to more universities as the beta matures — join the waitlist below and we'll notify you as soon as access opens up for you.",
    },
    {
        question: "Is my data safe?",
        answer:
            "Yes — Ace-Acad is built to comply with the Nigeria Data Protection Act (NDPA) 2023. See our full Privacy Policy for exactly what's collected, how it's used, and your rights as a data subject.",
    },
    {
        question: "How do I get early access?",
        answer:
            "Fill out the waitlist form below with your name, email, and department. We'll email you as soon as your access is ready.",
    },
];

export default function AceAcadFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className={styles.faqList}>
            {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div key={item.question} className={styles.faqItem}>
                        <button
                            type="button"
                            className={styles.faqQuestion}
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            aria-expanded={isOpen}
                        >
                            <span>{item.question}</span>
                            <ChevronDown
                                size={18}
                                className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ""}`}
                            />
                        </button>
                        {isOpen && <p className={styles.faqAnswer}>{item.answer}</p>}
                    </div>
                );
            })}
        </div>
    );
}
