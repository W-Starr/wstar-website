import Image from "next/image";
import styles from "@/app/about/about.module.css";
import type { TeamMember } from "@/data/team";

function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

export default function TeamMemberCard({ member }: { member: TeamMember }) {
    return (
        <div className={styles.teamCard}>
            <div className={styles.teamPhoto}>
                {member.photoUrl ? (
                    <Image
                        src={member.photoUrl}
                        alt={member.name}
                        width={280}
                        height={280}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                ) : (
                    <span className={styles.teamInitials} aria-hidden="true">
                        {getInitials(member.name)}
                    </span>
                )}
            </div>
            <div className={styles.teamInfo}>
                <h3>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
                <p>{member.bio}</p>
            </div>
        </div>
    );
}
