import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import styles from "./page.module.css";
import Link from "next/link";
import {
  BookOpen,
  Leaf,
  GraduationCap,
  Sprout,
  Users,
  ShieldCheck,
  Database,
  Smartphone,
  Cpu,
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* ===== Hero Section (AI Solutions-led per Task 8) ===== */}
      <HeroSection
        label="WSTAR AI Solutions"
        title={
          <>
            Deterministic AI for{" "}
            <span>Industrial &amp; B2B Workflows.</span>
          </>
        }
        description="WSTAR Technologies engineers bespoke, physics-aware autonomous agents that eliminate administrative bottlenecks for mid-market distributors, manufacturers, and technical service teams — alongside our EdTech and AgriTech ventures below."
        visual={
          <div className={styles.heroAiCard}>
            <div className={styles.heroAiCardHeader}>
              <span className={styles.heroAiCardTitle}>
                <Cpu size={15} color="var(--bright-blue)" /> Mechatronics AI Core
              </span>
              <span className={styles.heroAiCardStatus}>
                <span className={styles.livePulse} /> 100% Deterministic
              </span>
            </div>
            <div className={styles.heroAiMetricsGrid}>
              <div className={styles.heroAiMetricItem}>
                <span className={styles.heroAiMetricValue}>0.00mm</span>
                <span className={styles.heroAiMetricLabel}>Parametric Tolerance Delta</span>
              </div>
              <div className={styles.heroAiMetricItem}>
                <span className={styles.heroAiMetricValue}>&lt; 1.8s</span>
                <span className={styles.heroAiMetricLabel}>RFQ Normalization Latency</span>
              </div>
            </div>
            <p className={styles.heroAiCaption}>Sandbox-modeled projections — not yet verified client outcomes.</p>
          </div>
        }
      >
        <CTAButton href="/ai-solutions#intake-form" variant="primary" size="large">
          Request a Custom Sandbox
        </CTAButton>
        <CTAButton href="/ai-solutions" variant="secondary" size="large">
          Explore AI Solutions
        </CTAButton>
      </HeroSection>

      {/* ===== WSTAR AI Solutions — Flagship Section ===== */}
      <section className="section section--dark" id="ai-solutions-highlight">
        <div className="container">
          <div className={styles.featuredInitiativeCard} style={{ gridColumn: "unset" }}>
            <div className={styles.productHeader}>
              <div className={styles.productTag}>
                Enterprise AI Initiative • Industrial &amp; B2B Workflows
              </div>
              <h3>WSTAR AI Solutions: Autonomous Industrial Agents</h3>
              <p>
                Engineering bespoke, physics-aware operational agents driven by Mechatronics principles.
                We replace manual quoting and administrative bottlenecks with deterministic AI for mid-market
                distributors, manufacturers, and technical service teams.
              </p>
            </div>

            <div className={styles.productFeatures}>
              <div className={styles.featureItem}>
                <Cpu className={styles.featureIcon} />
                <span>Autonomous Procurement Agents: Ingest messy RFQs, match parametric CAD tolerances, and draft 1-click replies</span>
              </div>
              <div className={styles.featureItem}>
                <Database className={styles.featureIcon} />
                <span>B2B Knowledge RAG Agents: Air-gapped indexing of OEM manuals and SOPs for tier-one deflection</span>
              </div>
              <div className={styles.featureItem}>
                <ShieldCheck className={styles.featureIcon} />
                <span>Deterministic Execution: Zero public model training, strict engineering tolerances, and 1-click human approval</span>
              </div>
            </div>

            <div className={styles.productFooter} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <CTAButton href="/ai-solutions#intake-form" variant="primary" size="small">
                Request a Custom Sandbox
              </CTAButton>
              <CTAButton href="/ai-solutions" variant="secondary" size="small">
                Explore Architecture
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Also Building: Ace-Acad & PlantIQ ===== */}
      <section className="section section--dark" id="products">
        <div className="container">
          <div className="section-header">
            <h2>Also Building</h2>
            <p>
              Beyond AI Solutions, WSTAR engineers offline-first EdTech and automated AgriTech
              for African markets.
            </p>
          </div>

          <div className={styles.productsGrid}>
            {/* Ace-Acad Card */}
            <div className={styles.productCard}>
              <div className={styles.productHeader}>
                <div className={styles.productTag}>EdTech • Mobile Platform</div>
                <h3>Ace-Acad: Smarter Studying, Simplified.</h3>
                <p>
                  A personal study assistant for Nigerian undergraduates, built for the
                  Nigerian university curriculum. Currently live in beta across all
                  departments at ABU Zaria, and expanding fast.
                </p>
              </div>

              <div className={styles.productFeatures}>
                <div className={styles.featureItem}>
                  <Smartphone className={styles.featureIcon} />
                  <span>Offline-first e-library — study anywhere, no data required</span>
                </div>
                <div className={styles.featureItem}>
                  <BookOpen className={styles.featureIcon} />
                  <span>Curriculum-aligned study paths and flashcard quizzes</span>
                </div>
                <div className={styles.featureItem}>
                  <ShieldCheck className={styles.featureIcon} />
                  <span>Built and trusted for Nigerian students&apos; data privacy</span>
                </div>
              </div>

              <div className={styles.productFooter}>
                <p className={styles.miniStat}>
                  Live in beta across all departments at ABU Zaria · 100% offline-first
                </p>
                <CTAButton href="/products/ace-acad" variant="primary" size="small">
                  View Product Details
                </CTAButton>
              </div>
            </div>

            {/* PlantIQ Card */}
            <div className={styles.productCard}>
              <div className={styles.productHeader}>
                <div className={styles.productTag}>AgriTech • IoT Hardware</div>
                <h3>PlantIQ: Automated Smart Gardening.</h3>
                <p>
                  Grow crops and plants reliably without guesswork. PlantIQ is an
                  IoT-enabled, solar-ready device that automates irrigation and
                  monitors soil conditions for urban households and farms.
                </p>
              </div>

              <div className={styles.productFeatures}>
                <div className={styles.featureItem}>
                  <Cpu className={styles.featureIcon} />
                  <span>Microcontroller sensor telemetry and automated pump relay</span>
                </div>
                <div className={styles.featureItem}>
                  <Leaf className={styles.featureIcon} />
                  <span>Soil moisture, ambient humidity, and thermal monitoring</span>
                </div>
                <div className={styles.featureItem}>
                  <Database className={styles.featureIcon} />
                  <span>Cloud telemetry & automated scheduling engine</span>
                </div>
              </div>

              <div className={styles.productFooter}>
                <CTAButton href="/products/plantiq" variant="secondary" size="small">
                  Explore PlantIQ
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
            <h2>Transforming Challenges into Opportunities.</h2>
            <p>
              Technology is our tool; sustainable human development is our mission.
            </p>
          </div>

          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <div className={styles.impactIconWrapper}>
                <GraduationCap size={22} />
              </div>
              <h3>Education Equity</h3>
              <p>Bridging the resource divide for Nigerian undergraduates through offline-first digital learning.</p>
            </div>

            <div className={styles.impactCard}>
              <div className={styles.impactIconWrapper}>
                <Sprout size={22} />
              </div>
              <h3>Food Security</h3>
              <p>Empowering local households to cultivate food reliably in water-scarce urban environments.</p>
            </div>

            <div className={styles.impactCard}>
              <div className={styles.impactIconWrapper}>
                <Users size={22} />
              </div>
              <h3>Youth Tech Talent</h3>
              <p>Founded and developed by young Nigerian innovators building world-class technology on home soil.</p>
            </div>

            <div className={styles.impactCard}>
              <div className={styles.impactIconWrapper}>
                <ShieldCheck size={22} />
              </div>
              <h3>Privacy by Design</h3>
              <p>Strict NDPA compliance ensuring African student data is safeguarded and hosted ethically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Bottom Conversion / Investor CTA ===== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2>Join Us in Engineering the Future.</h2>
          <p>
            WSTAR is actively partnering with academic institutions, angel investors, and enterprise collaborators to scale high-impact solutions across Nigeria and West Africa.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/investors" className={styles.ctaPrimary}>
              Request Pitch Deck
            </Link>
            <Link href="/contact" className={styles.ctaSecondary}>
              Contact the Founders
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
