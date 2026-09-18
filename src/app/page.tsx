import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Leaf,
  GraduationCap,
  Sprout,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Smartphone,
  Cpu,
} from "lucide-react";

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
        description="WSTAR is a youth-led technology company building impactful EdTech and AgriTech solutions. From offline-first study tools to automated smart farming, we solve real-world problems to position Africa as a global leader in innovation."
        visual={
          <div className={styles.heroMockupContainer}>
            <Image
              src="/images/ace-acad-mockup.png"
              alt="Ace-Acad App Preview"
              width={280}
              height={500}
              style={{
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                margin: '0 auto',
              }}
              priority
            />
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

      {/* ===== Mission & Impact Proof Section ===== */}
      <section className="section section--light">
        <div className="container">
          <div className={styles.missionSection}>
            {/* Left: Concrete Institutional Proof Points */}
            <div className={styles.missionMetrics}>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>13</div>
                <div className={styles.metricLabel}>Foundational Courses Ingested for 100L ABU Cohort</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>100%</div>
                <div className={styles.metricLabel}>Offline-First Local Sandboxed Study & Quiz Engine</div>
              </div>
              {/* TODO(Ibrahim): two stats removed pending accurate figures — see PR summary:
                  1) "12 ABU Faculties Supported Across Natural Sciences" contradicted the product
                     page (beta is scoped to Mechatronics/Faculty of Engineering) and conflated
                     "faculties" with "departments". Needs the real, correct number + noun.
                  2) "2.0 SRS Specification Milestone Achieved" is an internal engineering doc
                     version, not a user-facing metric. Replace with a real one (e.g. waitlist
                     signups, beta users) or leave removed. */}
            </div>

            {/* Right: Mission Statement */}
            <div className={styles.missionContent}>
              <h2>Innovation Driven by Measurable Impact.</h2>
              <p>
                We harness interdisciplinary engineering and bold creativity to design, develop, and scale software products tailored for African universities and agricultural ecosystems.
              </p>
              <CTAButton href="/about" variant="primary" size="small">
                Meet the Team
              </CTAButton>

              <div className={styles.valuesRow}>
                <div className={styles.valueItem}>
                  <div className={styles.valueTitle}>Pedagogical Depth</div>
                  <div className={styles.valueDesc}>Page-bounded reading sessions and spaced quizzes.</div>
                </div>
                <div className={styles.valueItem}>
                  <div className={styles.valueTitle}>Offline Resilience</div>
                  <div className={styles.valueDesc}>Zero data required during active hostel study sessions.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Flagship Products Section ===== */}
      <section className="section section--dark" id="products">
        <div className="container">
          <div className="section-header">
            <h2>Flagship Products &amp; Solutions</h2>
            <p>
              Engineering bespoke technology to solve high-friction bottlenecks across industrial workflows, higher education, and smart agriculture.
            </p>
          </div>

          <div className={styles.productsGrid}>
            {/* WSTAR AI Solutions Featured Card */}
            <div className={styles.featuredInitiativeCard}>
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

            {/* Ace-Acad Card */}
            <div className={styles.productCard}>
              <div className={styles.productHeader}>
                <div className={styles.productTag}>EdTech • Mobile Platform</div>
                <h3>Ace-Acad: Smarter Studying, Simplified.</h3>
                <p>
                  A personal study assistant for Nigerian undergraduates, built for the
                  Nigerian university curriculum. Currently live in beta for ABU Zaria
                  Engineering students, and expanding fast.
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
