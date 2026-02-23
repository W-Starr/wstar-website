import styles from "./HeroSection.module.css";

interface HeroSectionProps {
    label?: string;
    title: React.ReactNode;
    description: string;
    children?: React.ReactNode; /* CTA buttons */
    visual?: React.ReactNode;
    compact?: boolean;
}

const HeroSection = ({
    label,
    title,
    description,
    children,
    visual,
    compact = false,
}: HeroSectionProps) => {
    return (
        <section className={`${styles.hero} ${compact ? styles.heroCompact : ""}`}>
            <div className={styles.heroInner}>
                <div className={styles.heroContent}>
                    {label && <span className={styles.heroLabel}>{label}</span>}
                    <h1 className={styles.heroTitle}>{title}</h1>
                    <p className={styles.heroDescription}>{description}</p>
                    {children && <div className={styles.heroCtas}>{children}</div>}
                </div>
                {visual && <div className={styles.heroVisual}>{visual}</div>}
            </div>
        </section>
    );
};

export default HeroSection;
