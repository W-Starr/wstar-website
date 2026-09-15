import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Instagram } from "lucide-react";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerBrand}>
                    <Image src="/images/wstar-logo-light.png" alt="WSTAR Logo" width={110} height={32} style={{ objectFit: 'contain' }} className={styles.footerLogo} />
                    <p>
                        A youth-led technology company building impactful EdTech and
                        AgriTech solutions for Africa. Global innovation, deeply rooted in
                        local realities.
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
                </div>

                <div className={styles.footerCol}>
                    <h4>Legal</h4>
                    <Link href="/products/ace-acad/terms" className={styles.footerLink}>Terms of Service</Link>
                    <Link href="/products/ace-acad/privacy" className={styles.footerLink}>Privacy Policy (NDPA)</Link>
                    <Link href="/products/ace-acad/acceptable-use" className={styles.footerLink}>Academic & AI Policy</Link>
                    <Link href="/products/ace-acad/account-deletion" className={styles.footerLink}>Account Deletion</Link>
                </div>

                <div className={styles.footerCol}>
                    <h4>Connect</h4>
                    <a href="mailto:wstar5552@gmail.com" className={styles.footerLink}>
                        wstar5552@gmail.com
                    </a>
                    <span className={styles.footerLink}>ABU Zaria, Nigeria</span>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <span className={styles.footerCopyright}>
                    © {new Date().getFullYear()} WSTAR. All rights reserved.
                </span>
                <div className={styles.footerSocials}>
                    <a href="#" className={styles.socialLink} aria-label="Twitter"><Twitter size={18} /></a>
                    <a href="#" className={styles.socialLink} aria-label="LinkedIn"><Linkedin size={18} /></a>
                    <a href="#" className={styles.socialLink} aria-label="Instagram"><Instagram size={18} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
