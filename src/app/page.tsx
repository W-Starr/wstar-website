import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { Rocket, Lightbulb, Target, Globe, BookOpen, Leaf, GraduationCap, Sprout, Users, Recycle } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* ===== Hero Section ===== */}
      <HeroSection
        label="Youth-Led Innovation"
        title={
          <>
            Empowering Africa.{" "}
            <span>Engineering the Future.</span>
          </>
        }
        description="We are WSTAR—a youth-led technology company building impactful EdTech and AgriTech solutions. From smarter study tools to automated smart farms, we solve real-world problems to position Nigeria as a global leader in innovation."
        visual={
          <div className={styles.heroMockupContainer}>
            <Image src="/images/ace-acad-mockup.png" alt="Ace-Acad App Preview" width={280} height={500} style={{ objectFit: 'contain', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderRadius: 'var(--radius-lg)' }} priority />
          </div>
        }
      >
        <CTAButton href="/contact" variant="primary" size="large">
          Partner With Us
        </CTAButton>
        <CTAButton href="#products" variant="secondary" size="large">
          Explore Our Products
        </CTAButton>
      </HeroSection>

      {/* ===== Mission & Identity Section ===== */}
      <section className="section section--light">
        <div className="container">
          <div className={styles.missionSection}>
            <div className={styles.missionImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rocket size={48} color="var(--bright-blue)" />
            </div>
            <div className={styles.missionContent}>
              <div className="glow-line" />
              <h2>Innovation Driven by Impact.</h2>
              <p>
                We harness interdisciplinary expertise and bold creativity to
                design, develop, and scale technology products. Our mission is to
                deliver measurable impact in education, agriculture, and
                sustainability while competing on the world stage.
              </p>
              <CTAButton href="/about" variant="primary" size="small">
                Meet the Team
              </CTAButton>
              <div className={styles.values}>
                <div className={styles.valueItem}>
                  <span className={styles.valueIcon}><Lightbulb size={24} /></span>
                  <span className={styles.valueLabel}>Innovation</span>
                </div>
                <div className={styles.valueItem}>
                  <span className={styles.valueIcon}><Target size={24} /></span>
                  <span className={styles.valueLabel}>Excellence</span>
                </div>
                <div className={styles.valueItem}>
                  <span className={styles.valueIcon}><Globe size={24} /></span>
                  <span className={styles.valueLabel}>Impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Flagship Products Section ===== */}
      <section className="section" id="products">
        <div className="container">
          <div className="section-header">
            <div className="glow-line glow-line--center" />
            <h2>Our Flagship Products</h2>
            <p>
              Transforming education and agriculture with technology built
              specifically for the African ecosystem.
            </p>
          </div>

          <div className={styles.productsGrid}>
            {/* Ace-Acad Card */}
            <div className={styles.productCard}>
              <div
                className={`${styles.productVisual} ${styles.productVisualEdtech}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <BookOpen size={48} />
              </div>
              <div className={styles.productContent}>
                <p className={styles.productTag}>EdTech</p>
                <h3>Ace-Acad: Smarter Studying, Simplified.</h3>
                <p>
                  A personal study assistant built for Nigerian undergraduates.
                  Featuring an offline-first e-library, flashcard quizzes, and
                  personalized study guides to help you ace your academics.
                </p>
                <CTAButton href="/products/ace-acad" variant="primary" size="small">
                  Join the Beta Waitlist
                </CTAButton>
              </div>
            </div>

            {/* PlantIQ Card */}
            <div className={styles.productCard}>
              <div
                className={`${styles.productVisual} ${styles.productVisualAgritech}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Leaf size={48} />
              </div>
              <div className={styles.productContent}>
                <p className={styles.productTag}>AgriTech</p>
                <h3>PlantIQ: Automated Smart Gardening.</h3>
                <p>
                  Grow plants and food reliably without the guesswork. PlantIQ is
                  an IoT-enabled, solar-ready device that automates watering and
                  plant care for urban households.
                </p>
                <CTAButton href="/products/plantiq" variant="primary" size="small">
                  Discover PlantIQ
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Social Impact Section ===== */}
      <section className="section section--dark">
        <div className="container">
          <div className="section-header">
            <div className="glow-line glow-line--center" />
            <h2>Transforming Challenges into Global Opportunities.</h2>
            <p>
              Technology is our tool; impact is our goal. We are bridging gaps
              and empowering communities across Africa.
            </p>
          </div>

          <div className={styles.impactGrid}>
            <div className={styles.impactItem}>
              <div className={styles.impactIcon}><GraduationCap size={32} /></div>
              <h3>Education Equity</h3>
              <p>Bridging the gap for under-resourced students with offline-first tools.</p>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactIcon}><Sprout size={32} /></div>
              <h3>Food Security</h3>
              <p>Empowering households to grow food locally in resource-constrained environments.</p>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactIcon}><Users size={32} /></div>
              <h3>Youth Empowerment</h3>
              <p>Built entirely by young Nigerian innovators, fostering local tech talent.</p>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactIcon}><Recycle size={32} /></div>
              <h3>Sustainability</h3>
              <p>Solar-powered IoT and locally sourced materials for a greener future.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Bottom Conversion / Investor CTA ===== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2>Join Us in Building the Future.</h2>
          <p>
            WSTAR is actively seeking partners, collaborators, investors, and
            institutions. Back a scalable, high-impact venture and help us bring
            world-class technological solutions to millions across Africa.
          </p>
          <div className={styles.ctaBtns}>
            <Link href="/investors" className={styles.ctaWhite}>
              Request Pitch Deck
            </Link>
            <Link href="/contact" className={styles.ctaGhost}>
              Contact the Founders
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
