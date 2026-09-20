"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Linkedin, Facebook, Instagram } from "lucide-react";
import styles from "./Footer.module.css";
import { socialLinks, contactEmails, companyInfo } from "@/lib/siteConfig";

const Footer = () => {
    const pathname = usePathname();
    const isAiSolutions = pathname?.startsWith("/ai-solutions") ?? false;

    const contactEmail = isAiSolutions ? contactEmails.aiSolutions : contactEmails.general;

    const legalLinks = isAiSolutions
        ? [
              { href: "/ai-solutions/privacy", label: "Data & Privacy Policy" },
              { href: "/ai-solutions/terms", label: "Terms of Service" },
          ]
        : [
              { href: "/products/ace-acad/terms", label: "Terms of Service" },
              { href: "/products/ace-acad/privacy", label: "Privacy Policy (NDPA)" },
              { href: "/products/ace-acad/acceptable-use", label: "Academic & AI Policy" },
              { href: "/products/ace-acad/account-deletion", label: "Account Deletion" },
          ];

    const socials = pathname?.startsWith("/products/ace-acad")
        ? socialLinks.aceAcad
        : pathname?.startsWith("/products/plantiq")
            ? socialLinks.plantiq
            : socialLinks.wstar;

    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerBrand}>
                    <Image src="/images/wstar-logo-light.png" alt="WSTAR Logo" width={110} height={32} style={{ objectFit: 'contain' }} className={styles.footerLogo} />
                    <p>
                        WSTAR Technologies engineers deterministic AI, EdTech, AgriTech, and
                        CareerTech products — from autonomous industrial agents to AI-powered
                        career tools, built in Nigeria for global standards.
                    </p>
                </div>

                <div className={styles.footerCol}>
                    <h4>Company</h4>
                    <Link href="/about" className={styles.footerLink}>About Us</Link>
                    <Link href="/investors" className={styles.footerLink}>Investors</Link>
                    <Link href="/publications" className={styles.footerLink}>Publications</Link>
                    <Link href="/contact" className={styles.footerLink}>Contact</Link>
                </div>

                <div className={styles.footerCol}>
                    <h4>Products & Solutions</h4>
                    <Link href="/ai-solutions" className={styles.footerLink}>WSTAR AI Solutions</Link>
                    <Link href="/products/ace-acad" className={styles.footerLink}>Ace-Acad</Link>
                    <Link href="/products/plantiq" className={styles.footerLink}>PlantIQ</Link>
                    <Link href="/products/ace-opportunity" className={styles.footerLink}>Ace-Opportunity</Link>
                </div>

                <div className={styles.footerCol}>
                    <h4>Legal</h4>
                    {legalLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={styles.footerLink}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.footerCol}>
                    <h4>Connect</h4>
                    <a href={`mailto:${contactEmail}`} className={styles.footerLink}>
                        {contactEmail}
                    </a>
                    <span className={styles.footerLink}>ABU Zaria, Nigeria</span>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <span className={styles.footerCopyright}>
                    © {new Date().getFullYear()} {companyInfo.legalName} · {companyInfo.registrationNumber}. All rights reserved.
                </span>
                <div className={styles.footerSocials}>
                    {socials.linkedin && (
                        <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WSTAR on LinkedIn">
                            <Linkedin size={18} />
                        </a>
                    )}
                    {socials.facebook && (
                        <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WSTAR on Facebook">
                            <Facebook size={18} />
                        </a>
                    )}
                    {socials.instagram && (
                        <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WSTAR on Instagram">
                            <Instagram size={18} />
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
