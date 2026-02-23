import styles from "./FeatureCard.module.css";

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    light?: boolean;
}

const FeatureCard = ({
    icon,
    title,
    description,
    light = false,
}: FeatureCardProps) => {
    return (
        <div className={`${styles.card} ${light ? styles.cardLight : ""}`}>
            <div className={styles.icon}>{icon}</div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </div>
    );
};

export default FeatureCard;
