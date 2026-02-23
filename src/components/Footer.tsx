import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerBrand}>
                    <h3>W★STAR</h3>
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
                    <Link href="/contact" className={styles.footerLink}>Contact</Link>
                </div>

                <div className={styles.footerCol}>
                    <h4>Products</h4>
                    <Link href="/products/ace-acad" className={styles.footerLink}>Ace-Acad</Link>
                    <Link href="/products/plantiq" className={styles.footerLink}>PlantIQ</Link>
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
                    <a href="#" className={styles.socialLink} aria-label="Twitter">𝕏</a>
                    <a href="#" className={styles.socialLink} aria-label="LinkedIn">in</a>
                    <a href="#" className={styles.socialLink} aria-label="Instagram">📷</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
