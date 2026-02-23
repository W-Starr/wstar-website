import styles from "./PricingCard.module.css";
import CTAButton from "./CTAButton";

interface PricingCardProps {
    plan: string;
    price: string;
    period?: string;
    description: string;
    features: string[];
    ctaText: string;
    ctaHref: string;
    highlighted?: boolean;
    badge?: string;
    light?: boolean;
}

const PricingCard = ({
    plan,
    price,
    period,
    description,
    features,
    ctaText,
    ctaHref,
    highlighted = false,
    badge,
    light = false,
}: PricingCardProps) => {
    return (
        <div
            className={`${styles.card} ${highlighted ? styles.cardHighlighted : ""} ${light ? styles.cardLight : ""
                }`}
        >
            {badge && <span className={styles.badge}>{badge}</span>}
            <p className={styles.planName}>{plan}</p>
            <p className={styles.price}>
                {price}
                {period && <span> / {period}</span>}
            </p>
            <p className={styles.priceDescription}>{description}</p>
            <div className={styles.featureList}>
                {features.map((feature, i) => (
                    <div key={i} className={styles.feature}>
                        <span className={styles.featureCheck}>✓</span>
                        {feature}
                    </div>
                ))}
            </div>
            <CTAButton
                href={ctaHref}
                variant={highlighted ? "primary" : "secondary"}
            >
                {ctaText}
            </CTAButton>
        </div>
    );
};

export default PricingCard;
