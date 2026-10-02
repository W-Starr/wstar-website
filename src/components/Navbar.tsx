"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import styles from "./Navbar.module.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
            <div className={styles.navbarInner}>
                <Link href="/" className={styles.logo} onClick={closeMenu}>
                    <Image src="/images/wstar-logo-light.png" alt="WSTAR Logo" width={110} height={32} style={{ objectFit: 'contain' }} />
                </Link>

                <div
                    className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span />
                    <span />
                    <span />
                </div>

                <div className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
                    <Link href="/" className={styles.navLink} onClick={closeMenu}>
                        Home
                    </Link>
                    <Link href="/about" className={styles.navLink} onClick={closeMenu}>
                        About
                    </Link>
                    <Link href="/ai-solutions" className={styles.navLink} onClick={closeMenu}>
                        Enterprise AI
                    </Link>
                    <div className={styles.navDropdown}>
                        <span className={`${styles.navLink} ${styles.dropdownTrigger}`}>
                            Applied AI Products <ChevronDown size={14} className={styles.dropdownArrow} />
                        </span>
                        <div className={styles.dropdownMenu}>
                            <Link
                                href="/products/ace-acad"
                                className={styles.dropdownItem}
                                onClick={closeMenu}
                            >
                                Ace-Acad (Higher Education AI)
                            </Link>
                            <Link
                                href="/products/ace-opportunity"
                                className={styles.dropdownItem}
                                onClick={closeMenu}
                            >
                                Ace-Opportunity (Career Intelligence)
                            </Link>
                            <Link
                                href="/products/plantiq"
                                className={styles.dropdownItem}
                                onClick={closeMenu}
                            >
                                PlantIQ (Edge Agronomy IoT)
                            </Link>
                        </div>
                    </div>
                    <Link
                        href="/investors"
                        className={styles.navLink}
                        onClick={closeMenu}
                    >
                        Investors
                    </Link>
                    <Link
                        href="/publications"
                        className={styles.navLink}
                        onClick={closeMenu}
                    >
                        Publications
                    </Link>
                    <Link href="/contact" className={styles.navLink} onClick={closeMenu}>
                        Contact
                    </Link>
                    <Link href="/ai-solutions#intake-form" className={styles.navCta} onClick={closeMenu}>
                        Request Sandbox
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
