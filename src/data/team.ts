export interface TeamMember {
    name: string;
    role: string;
    bio: string;
    /** Optional path to a real photo (e.g. "/images/team/ibrahim.jpg"). Falls back to an initials avatar when omitted. */
    photoUrl?: string;
}

// Add new team members here — each entry renders automatically with an
// initials-avatar fallback until a real photo is supplied via `photoUrl`.
export const team: TeamMember[] = [
    {
        name: "Ibrahim Abdulwahab",
        role: "Founder & CEO",
        bio: "Leading WSTAR's product vision, institutional partnerships, and commercial strategy for African technology innovation.",
    },
    {
        name: "Abdulaziz Abdulwahab",
        role: "Lead Technical Architect",
        bio: "Architecting the Ace-Acad mobile engine, syllabus ingestion pipelines, offline SQLite synchronization, and Cloud Firestore infrastructure.",
    },
];
