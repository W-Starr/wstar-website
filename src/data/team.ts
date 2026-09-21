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
        bio: "Directs WSTAR's Applied AI product vision, institutional partnerships, and enterprise deployment strategy. Grounded in Mechatronics Engineering principles, focusing on deterministic AI for industrial and mission-critical workflows.",
    },
    {
        name: "Abdulaziz Abdulwahab",
        role: "Co-Founder & Lead Technical Architect",
        bio: "Architects WSTAR's core technical infrastructure, offline-first SQLite sync engines, edge AI pipelines, and the internal Company Operating System (WSTAR OS). Specializes in high-reliability software for constrained environments.",
    },
];
