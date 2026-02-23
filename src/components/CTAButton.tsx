import Link from "next/link";
import styles from "./CTAButton.module.css";

interface CTAButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    size?: "small" | "default" | "large";
    external?: boolean;
}

const CTAButton = ({
    href,
    children,
    variant = "primary",
    size = "default",
    external = false,
}: CTAButtonProps) => {
    const className = `${styles.button} ${styles[variant]} ${size !== "default" ? styles[size] : ""
        }`;

    if (external) {
        return (
            <a
                href={href}
                className={className}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
};

export default CTAButton;
