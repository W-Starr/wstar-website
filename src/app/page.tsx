import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import styles from "./page.module.css";
import Link from "next/link";
import {
  Cpu,
  Smartphone,
  ShieldCheck,
  Database,
  Target,
  FileCheck,
  Leaf,
  Layers,
  CheckCircle2,
  Users,
  ExternalLink,
  WifiOff,
  Code2,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WSTAR Technologies — Applied Artificial Intelligence Systems",
  description:
    "WSTAR Technologies is an Applied AI company engineering domain-specific intelligence systems across enterprise workflows, higher education, workforce readiness, and connected edge agronomy.",
};

export default function Home() {
  return (
    <>
      {/* ===== 1. Corporate Applied AI Hero ===== */}
      <HeroSection
        label="WSTAR Technologies • Applied Artificial Intelligence"
        title={
          <>
            Engineering Applied AI for{" "}
            <span>High-Stakes Frontiers.</span>
          </>
        }
        description="WSTAR Technologies is an Applied AI company. We design, train, and deploy deterministic intelligence systems across enterprise workflows, higher education, workforce readiness, and edge agronomy — engineered to operate reliably under strict real-world constraints."
        visual={
          <div className={styles.heroSystemsMatrix}>
            <div className={styles.heroSystemsHeader}>
              <span className={styles.heroSystemsTitle}>
                <Cpu size={16} color="var(--bright-blue)" /> Applied AI Core
              </span>
              <span className={styles.heroSystemsStatus}>
                <span className={styles.livePulse} /> 100% Schema Validated
              </span>
            </div>

            <div className={styles.heroSystemsNodes}>
              <div className={styles.systemNode}>
                <div className={styles.systemNodeHeader}>
                  <Cpu size={14} />
                  <span className={styles.systemNodeTitle}>Enterprise B2B</span>
                </div>
                <span className={styles.systemNodeDomain}>RFQ Normalization &amp; RAG</span>
              </div>

              <div className={styles.systemNode}>
                <div className={styles.systemNodeHeader}>
                  <Smartphone size={14} />
                  <span className={styles.systemNodeTitle}>Education AI</span>
                </div>
                <span className={styles.systemNodeDomain}>Ace-Acad Offline Student AI</span>
              </div>

              <div className={styles.systemNode}>
                <div className={styles.systemNodeHeader}>
                  <Target size={14} />
                  <span className={styles.systemNodeTitle}>Career AI</span>
                </div>
                <span className={styles.systemNodeDomain}>Ace-Opportunity Strategist</span>
              </div>

              <div className={styles.systemNode}>
                <div className={styles.systemNodeHeader}>
                  <Leaf size={14} />
                  <span className={styles.systemNodeTitle}>Edge Agronomy</span>
                </div>
                <span className={styles.systemNodeDomain}>PlantIQ IoT Telemetry</span>
              </div>
            </div>

            <div className={styles.heroSystemsFooter}>
              <span>ZERO PUBLIC MODEL TRAINING</span>
              <span>NDPA COMPLIANT</span>
            </div>
          </div>
        }
      >
        <CTAButton href="#ecosystem" variant="primary" size="large">
          Explore Applied AI Ecosystem
        </CTAButton>
        <CTAButton href="/ai-solutions" variant="secondary" size="large">
          Enterprise B2B Solutions
        </CTAButton>
      </HeroSection>

      {/* ===== 2. The Applied AI Thesis Section ===== */}
      <section className="section section--dark" id="thesis">
        <div className="container">
          <div className="section-header">
            <div className={styles.sectionSubheader}>The Applied AI Thesis</div>
            <h2>We Don&apos;t Build Generic Chatbots. We Engineer Applied Systems.</h2>
            <p>
              Statistical language models alone break down when applied to industrial supply chains, offline university campuses, or precision agriculture. WSTAR binds modern foundation models to strict schema validation, offline local databases, and domain-specific rules.
            </p>
          </div>

          <div className={styles.thesisGrid}>
            <div className={styles.thesisCard}>
              <div className={styles.thesisIconWrapper}>
                <Cpu size={24} />
              </div>
              <h3>Deterministic &amp; Schema-Bounded</h3>
              <p>
                Every agent decision and output is validated against rigid schemas and domain constraints before execution. Zero hallucination on critical catalog, financial, or academic data.
              </p>
            </div>

            <div className={styles.thesisCard}>
              <div className={styles.thesisIconWrapper}>
                <WifiOff size={24} />
              </div>
              <h3>Offline &amp; Low-Bandwidth Native</h3>
              <p>
                Engineered for emerging market infrastructure where power and cellular data are inconsistent. Our software embeds resilient local SQLite sync engines that never strand users.
              </p>
            </div>

            <div className={styles.thesisCard}>
              <div className={styles.thesisIconWrapper}>
                <ShieldCheck size={24} />
              </div>
              <h3>Absolute Data Sovereignty</h3>
              <p>
                Strict NDPA 2023 compliance with air-gapped data boundaries. Proprietary enterprise documents, student records, and operational logs are never used to train public models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. Unbundled Applied AI Ecosystem ===== */}
      <section className="section section--dark" id="ecosystem" style={{ borderTop: "1px solid var(--navy-border)" }}>
        <div className="container">
          <div className="section-header">
            <div className={styles.sectionSubheader}>Four Domains • One Unified Engineering Thesis</div>
            <h2>The WSTAR Applied AI Ecosystem</h2>
            <p>
              Explore our unbundled initiatives. Each platform operates as a focused, domain-specific Applied AI system solving high-stakes bottlenecks for its specific audience.
            </p>
          </div>

          <div className={styles.ecosystemGrid}>
            {/* Pillar 1: Enterprise AI Solutions */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarHeader}>
                <div className={styles.pillarTopMeta}>
                  <span className={styles.pillarTag}>Enterprise Systems • B2B Workflows</span>
                  <span className={`${styles.statusPill} ${styles.statusPillWarm}`}>Enterprise Pilot Ready</span>
                </div>
                <h3>WSTAR AI Solutions: Autonomous B2B Agents</h3>
                <p>
                  Eliminates administrative quoting bottlenecks for industrial distributors and manufacturers through deterministic RFQ normalization and air-gapped OEM knowledge retrieval.
                </p>
              </div>

              <div className={styles.pillarFeatures}>
                <div className={styles.pillarFeatureItem}>
                  <Cpu className={styles.pillarFeatureIcon} />
                  <span><strong>Autonomous Procurement Agents:</strong> Ingest messy RFQ emails, cross-reference ERP databases, and draft verified quotes.</span>
                </div>
                <div className={styles.pillarFeatureItem}>
                  <Database className={styles.pillarFeatureIcon} />
                  <span><strong>Air-Gapped B2B RAG:</strong> Secure vector indexing over proprietary OEM manuals and engineering SOPs for tier-one technical deflection.</span>
                </div>
                <div className={styles.pillarFeatureItem}>
                  <ShieldCheck className={styles.pillarFeatureIcon} />
                  <span><strong>1-Click Human Approval:</strong> Human-in-the-loop review gates ensure zero unverified actions leave your sales inbox.</span>
                </div>
              </div>

              <div className={styles.pillarFooter}>
                <CTAButton href="/ai-solutions" variant="primary" size="small">
                  Explore Enterprise AI Solutions
                </CTAButton>
                <CTAButton href="/ai-solutions#intake-form" variant="secondary" size="small">
                  Request Custom Sandbox
                </CTAButton>
              </div>
            </div>

            {/* Pillar 2: Ace-Acad */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarHeader}>
                <div className={styles.pillarTopMeta}>
                  <span className={styles.pillarTag}>Higher Education • Mobile Platform</span>
                  <span className={styles.statusPill}>Active Beta · ABU Zaria</span>
                </div>
                <h3>Ace-Acad: Offline-First Student AI</h3>
                <p>
                  A personalized academic companion for Nigerian undergraduates. Aligned with Nigerian university curricula, delivering intelligent study paths and flashcard quizzes 100% offline.
                </p>
              </div>

              <div className={styles.pillarFeatures}>
                <div className={styles.pillarFeatureItem}>
                  <Smartphone className={styles.pillarFeatureIcon} />
                  <span><strong>Offline-First SQLite Engine:</strong> Complete access to syllabus-aligned study guides, quizzes, and notes with zero cellular data required.</span>
                </div>
                <div className={styles.pillarFeatureItem}>
                  <FileCheck className={styles.pillarFeatureIcon} />
                  <span><strong>Curriculum Intelligence:</strong> Department-specific question generation and spaced-repetition testing built for local university standards.</span>
                </div>
                <div className={styles.pillarFeatureItem}>
                  <CheckCircle2 className={styles.pillarFeatureIcon} />
                  <span><strong>Field Tested:</strong> Currently deployed across 100L cohorts at Ahmadu Bello University (ABU Zaria), expanding rapidly.</span>
                </div>
              </div>

              <div className={styles.pillarFooter}>
                <CTAButton href="/products/ace-acad" variant="primary" size="small">
                  Explore Ace-Acad Platform
                </CTAButton>
                <CTAButton href="/products/ace-acad#early-access" variant="secondary" size="small">
                  Join Beta Waitlist
                </CTAButton>
              </div>
            </div>

            {/* Pillar 3: Ace-Opportunity */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarHeader}>
                <div className={styles.pillarTopMeta}>
                  <span className={styles.pillarTag}>Workforce &amp; Talent • CareerTech</span>
                  <span className={styles.statusPill}>Active Beta</span>
                </div>
                <h3>Ace-Opportunity: AI Career Strategist</h3>
                <p>
                  An autonomous agent that indexes real internships, jobs, scholarships, and fellowships — then helps students and job seekers prepare, practice, and win them.
                </p>
              </div>

              <div className={styles.pillarFeatures}>
                <div className={styles.pillarFeatureItem}>
                  <Target className={styles.pillarFeatureIcon} />
                  <span><strong>Grounded Match Engine:</strong> Indexes verified opportunities matched strictly to candidate course of study, verified skills, and academic level.</span>
                </div>
                <div className={styles.pillarFeatureItem}>
                  <CheckCircle2 className={styles.pillarFeatureIcon} />
                  <span><strong>Interactive Mock Interviews:</strong> Real-time role-play interviews and fact-checked CV review grounded exclusively in candidate data.</span>
                </div>
                <div className={styles.pillarFeatureItem}>
                  <Layers className={styles.pillarFeatureIcon} />
                  <span><strong>Time-Boxed Skill Coaching:</strong> Generates concrete step-by-step roadmaps to bridge critical technical and soft-skill gaps.</span>
                </div>
              </div>

              <div className={styles.pillarFooter}>
                <CTAButton href="/products/ace-opportunity" variant="primary" size="small">
                  View CareerTech Details
                </CTAButton>
                <CTAButton href="https://ace-opportunity.onrender.com" variant="secondary" size="small" external>
                  Launch App <ExternalLink size={13} style={{ marginLeft: 4 }} />
                </CTAButton>
              </div>
            </div>

            {/* Pillar 4: PlantIQ */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarHeader}>
                <div className={styles.pillarTopMeta}>
                  <span className={styles.pillarTag}>AgriTech • IoT Edge Hardware</span>
                  <span className={`${styles.statusPill} ${styles.statusPillMuted}`}>R&amp;D Hardware Lab</span>
                </div>
                <h3>PlantIQ: Smart Edge Hydration &amp; Telemetry</h3>
                <p>
                  A modular, solar-ready IoT device integrating microcontroller sensor telemetry with predictive soil hydration models for urban households and smallholder farmers.
                </p>
              </div>

              <div className={styles.pillarFeatures}>
                <div className={styles.pillarFeatureItem}>
                  <Leaf className={styles.pillarFeatureIcon} />
                  <span><strong>Sensor Telemetry:</strong> Microcontroller-driven monitoring of soil moisture, ambient humidity, and thermal fluctuations.</span>
                </div>
                <div className={styles.pillarFeatureItem}>
                  <Cpu className={styles.pillarFeatureIcon} />
                  <span><strong>Predictive Irrigation Relays:</strong> Automated pump control algorithms that optimize water use in water-scarce urban micro-climates.</span>
                </div>
                <div className={styles.pillarFeatureItem}>
                  <Database className={styles.pillarFeatureIcon} />
                  <span><strong>Autonomous Edge Logic:</strong> Retains full irrigation schedules locally even during prolonged cellular or cloud disconnects.</span>
                </div>
              </div>

              <div className={styles.pillarFooter}>
                <CTAButton href="/products/plantiq" variant="secondary" size="small">
                  Explore PlantIQ Hardware
                </CTAButton>
                <CTAButton href="/products/plantiq#reserve" variant="primary" size="small">
                  Join Pilot Program
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. Engineering Rigor & Operating Standards ===== */}
      <section className="section section--dark" style={{ borderTop: "1px solid var(--navy-border)" }}>
        <div className="container">
          <div className="section-header">
            <div className={styles.sectionSubheader}>Engineering Discipline</div>
            <h2>Built for Rigor, Compliance, and Real-World Reliability</h2>
            <p>
              Whether deploying an autonomous procurement agent or an offline university study engine, all WSTAR systems adhere to uncompromising engineering standards.
            </p>
          </div>

          <div className={styles.principlesGrid}>
            <div className={styles.principleCard}>
              <div className={styles.principleIconWrapper}>
                <Code2 size={22} />
              </div>
              <h3>Deterministic Schemas</h3>
              <p>
                Strict schema validation on every input and output. Zero silent failures, unbounded hallucination, or unformatted responses.
              </p>
            </div>

            <div className={styles.principleCard}>
              <div className={styles.principleIconWrapper}>
                <WifiOff size={22} />
              </div>
              <h3>Resilient Offline Sync</h3>
              <p>
                Software engineered to thrive under intermittent connectivity, volatile bandwidth, and local infrastructure interruptions.
              </p>
            </div>

            <div className={styles.principleCard}>
              <div className={styles.principleIconWrapper}>
                <ShieldCheck size={22} />
              </div>
              <h3>Zero-Leakage Privacy</h3>
              <p>
                Full statutory compliance with the Nigeria Data Protection Act (NDPA 2023). Complete tenant data isolation.
              </p>
            </div>

            <div className={styles.principleCard}>
              <div className={styles.principleIconWrapper}>
                <Users size={22} />
              </div>
              <h3>Human-in-the-Loop</h3>
              <p>
                Autonomous systems execute with clear, single-click human sign-off gates for high-consequence business actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. Leadership & Engineering Foundations ===== */}
      <section className="section section--dark" style={{ borderTop: "1px solid var(--navy-border)" }}>
        <div className="container">
          <div className="section-header">
            <div className={styles.sectionSubheader}>Company Leadership</div>
            <h2>Built by Engineers on Home Soil</h2>
            <p>
              WSTAR Technologies was founded in Nigeria by innovators combining Mechatronics Engineering foundations with modern full-stack systems architecture.
            </p>
          </div>

          <div className={styles.leadershipGrid}>
            <div className={styles.leaderCard}>
              <div className={styles.leaderHeader}>
                <div className={styles.leaderAvatar}>IA</div>
                <div className={styles.leaderMeta}>
                  <h3>Ibrahim Abdulwahab</h3>
                  <span className={styles.leaderRole}>Founder &amp; Chief Executive Officer</span>
                </div>
              </div>
              <p className={styles.leaderBio}>
                Directs WSTAR&apos;s Applied AI product vision, institutional partnerships, and commercial deployment strategy. Grounded in Mechatronics Engineering principles, focusing on deterministic AI for industrial and mission-critical workflows.
              </p>
            </div>

            <div className={styles.leaderCard}>
              <div className={styles.leaderHeader}>
                <div className={styles.leaderAvatar}>AA</div>
                <div className={styles.leaderMeta}>
                  <h3>Abdulaziz Abdulwahab</h3>
                  <span className={styles.leaderRole}>Co-Founder &amp; Lead Technical Architect</span>
                </div>
              </div>
              <p className={styles.leaderBio}>
                Architects WSTAR&apos;s core technical infrastructure, offline-first SQLite sync engines, edge AI pipelines, and the internal Company Operating System (WSTAR OS). Specializes in high-reliability software for constrained environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. Institutional Institutional Conversion CTA ===== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2>Partner with WSTAR Applied AI.</h2>
          <p>
            Whether you are an enterprise seeking autonomous B2B workflow agents, an academic institution looking to deploy Ace-Acad, or an investor backing African technology innovation — let&apos;s build together.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/ai-solutions#intake-form" className={styles.ctaPrimary}>
              Request Enterprise Sandbox
            </Link>
            <Link href="/products/ace-acad" className={styles.ctaSecondary}>
              Explore Ace-Acad Beta
            </Link>
            <Link href="/investors" className={styles.ctaSecondary}>
              Investor Relations
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
