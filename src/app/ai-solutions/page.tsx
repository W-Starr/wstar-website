import React from "react";
import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import AiServicesGrid from "@/components/ai-solutions/AiServicesGrid";
import SandboxShowcase from "@/components/ai-solutions/SandboxShowcase";
import AiSolutionsIntakeForm from "@/components/ai-solutions/AiSolutionsIntakeForm";
import {
  Cpu,
  ShieldCheck,
  Sliders,
  Boxes,
} from "lucide-react";
import styles from "./ai-solutions.module.css";

export const metadata: Metadata = {
  title: "WSTAR AI Solutions — Autonomous Agentic AI for Industrial & B2B Workflows",
  description:
    "WSTAR AI Solutions is a specialized technical initiative operated by WSTAR Technologies. We engineer bespoke, autonomous operational agents driven by Mechatronics Engineering principles for scaling mid-market B2B enterprises.",
};

export default function AiSolutionsPage() {
  return (
    <>
      {/* ===== 1. Hero Section & Core Differentiator ===== */}
      <HeroSection
        label="WSTAR AI Solutions"
        title={
          <>
            Engineering Agentic AI for{" "}
            <span>Industrial &amp; B2B Workflows.</span>
          </>
        }
        description="We engineer bespoke, autonomous operational agents that eliminate massive administrative bottlenecks for scaling mid-market B2B enterprises. Driven by advanced Mechatronics Engineering principles, we build physics-aware AI systems that inherently understand complex manufacturing constraints, supply chain logistics, and strict engineering tolerances."
        visual={
          <div className={styles.heroArchitectureCard}>
            <div className={styles.heroCardHeader}>
              <span className={styles.heroCardTitle}>
                <Cpu size={15} color="var(--bright-blue)" /> Mechatronics AI Core
              </span>
              <span className={styles.heroCardStatus}>
                <span className={styles.livePulse} /> 100% Deterministic
              </span>
            </div>

            <div className={styles.heroMetricsGrid}>
              <div className={styles.heroMetricItem}>
                <span className={styles.metricValue}>0.00mm</span>
                <span className={styles.metricLabel}>Parametric Tolerance Delta</span>
              </div>
              <div className={styles.heroMetricItem}>
                <span className={styles.metricValue}>&lt; 1.8s</span>
                <span className={styles.metricLabel}>RFQ Normalization Latency</span>
              </div>
              <div className={styles.heroMetricItem}>
                <span className={styles.metricValue}>2,400+</span>
                <span className={styles.metricLabel}>Reclaimed Hours / Desk / Yr</span>
              </div>
              <div className={styles.heroMetricItem}>
                <span className={styles.metricValue}>1-Click</span>
                <span className={styles.metricLabel}>Human-in-the-Loop Signoff</span>
              </div>
            </div>

            <p className={styles.heroMetricsCaption}>
              Sandbox-modeled projections — not yet verified client outcomes.
            </p>

            <div className={styles.heroArchitectureBadge}>
              <span>PROTOCOL: AIR-GAPPED ERP BRIDGE</span>
              <span>ZERO HALLUCINATION</span>
            </div>
          </div>
        }
      >
        <CTAButton href="#intake-form" variant="primary" size="large">
          Request a Custom Sandbox
        </CTAButton>
        <CTAButton href="#sprint" variant="secondary" size="large">
          Explore a Value Validation Sprint
        </CTAButton>
      </HeroSection>

      {/* ===== 2. "About" Section Copy (Plug-and-Play) ===== */}
      <section className="section section--dark" id="about-initiative">
        <div className="container">
          <div className={styles.aboutInitiativeBox}>
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--bright-blue)",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Core Differentiator: Mechatronics Engineering
              </div>
              <h2 style={{ marginBottom: "20px" }}>
                About WSTAR AI Solutions
              </h2>
              <p className={styles.aboutLead}>
                WSTAR AI Solutions is a specialized technical initiative
                operated by WSTAR Technologies. We engineer bespoke, autonomous
                operational agents that eliminate massive administrative
                bottlenecks for scaling mid-market B2B enterprises. Driven by
                advanced Mechatronics Engineering principles, we do not just
                write code—we build physics-aware AI systems that inherently
                understand complex manufacturing constraints, supply chain
                logistics, and strict engineering tolerances. By replacing manual
                data entry with deterministic Agentic AI, we help distributors,
                manufacturers, and service teams reclaim thousands of
                engineering hours and stop unworked pipeline leakage.
              </p>

              <CTAButton href="#intake-form" variant="primary" size="small">
                Request a Custom Sandbox
              </CTAButton>
            </div>

            <div className={styles.aboutPrinciplesGrid}>
              <div className={styles.principleItem}>
                <div className={styles.principleIconWrap}>
                  <Sliders size={20} />
                </div>
                <div>
                  <h4 className={styles.principleTitle}>Physics-Aware Intelligence</h4>
                  <p className={styles.principleDesc}>
                    Unlike generic LLMs, our agents validate material grades,
                    ASME/ISO standards, thread tolerances, and pressure ratings.
                  </p>
                </div>
              </div>

              <div className={styles.principleItem}>
                <div className={styles.principleIconWrap}>
                  <Boxes size={20} />
                </div>
                <div>
                  <h4 className={styles.principleTitle}>Pipeline Leakage Elimination</h4>
                  <p className={styles.principleDesc}>
                    Stop leaving high-value multi-line RFQs unquoted. Turn chaotic
                    inbound requests into verified quotes in seconds.
                  </p>
                </div>
              </div>

              <div className={styles.principleItem}>
                <div className={styles.principleIconWrap}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className={styles.principleTitle}>Enterprise Isolation</h4>
                  <p className={styles.principleDesc}>
                    Zero training on public models. Deployed behind secure,
                    air-gapped middleware with role-based founder access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2b. Founder / Team Credibility ===== */}
      {/* TODO(Ibrahim): replace with real founder/team credibility copy —
          this section shell is placeholder-only. */}
      <section className="section section--light" id="engineering-behind">
        <div className="container">
          <div className={styles.credibilityBox}>
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--medium-blue)",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Why Mechatronics
            </div>
            <h2 style={{ color: "var(--deep-navy)", marginBottom: "16px" }}>
              The Engineering Behind the Agents
            </h2>
            <p style={{ color: "var(--ink-secondary)" }}>
              [PLACEHOLDER — Ibrahim to supply founder/team credibility copy:
              who is behind the Mechatronics Engineering claim, relevant
              credentials, and why that background translates into
              physics-aware, deterministic AI systems rather than generic
              LLM wrappers.]
            </p>
          </div>
        </div>
      </section>

      {/* ===== 3. Core Specialized AI Services (Plug-and-Play Copy) ===== */}
      <section className="section section--light" id="services">
        <div className="container">
          <div className="section-header">
            <h2 style={{ color: "var(--deep-navy)" }}>Our Specialized AI Services</h2>
            <p style={{ color: "var(--ink-secondary)" }}>
              Deterministic, physics-aware autonomous agents designed specifically
              for mid-market manufacturing, industrial distribution, and technical
              service enterprises.
            </p>
          </div>

          <AiServicesGrid />
        </div>
      </section>

      {/* ===== 4. The "Show, Don't Tell" Prototype Gallery ===== */}
      <section className="section section--dark" id="gallery">
        <div className="container">
          <div className="section-header">
            <h2>The &quot;Show, Don&apos;t Tell&quot; Prototype Gallery</h2>
            <p>
              Visual proof over abstract claims. Watch 90-second Loom recordings
              demonstrating our sandbox environments autonomously resolving complex
              industrial workflows.
            </p>
          </div>

          <SandboxShowcase />
        </div>
      </section>

      {/* ===== 5. Value Validation Sprint Section ===== */}
      <section className="section section--dark" id="sprint">
        <div className="container">
          <div className="section-header">
            <h2>Explore a Value Validation Sprint</h2>
            <p>
              A focused, two-week engagement to demonstrate deterministic accuracy
              against a sanitized slice of your actual ERP data and inbox flow.
            </p>
          </div>

          <div className={styles.sprintGrid}>
            <div className={styles.sprintCard}>
              <div>
                <span className={styles.sprintPhaseTag}>Phase 1 • Days 1 – 4</span>
                <h3 className={styles.sprintCardTitle}>
                  Workflow Ingest &amp; Constraint Modeling
                </h3>
                <p className={styles.sprintCardDesc}>
                  Our Mechatronics Solutions Architect models your unique
                  engineering tolerances, catalog parameters, and ERP schema. We
                  sanitize and ingest sample RFQ emails and PDF drawings.
                </p>
              </div>
              <div className={styles.sprintDeliverable}>
                <strong>Deliverable:</strong>
                Custom Schema Normalizer &amp; Parametric Constraint Matrix
              </div>
            </div>

            <div className={styles.sprintCard}>
              <div>
                <span className={styles.sprintPhaseTag}>Phase 2 • Days 5 – 9</span>
                <h3 className={styles.sprintCardTitle}>
                  Sandbox Deployment &amp; Live Simulation
                </h3>
                <p className={styles.sprintCardDesc}>
                  We spin up an isolated, air-gapped agent sandbox running the
                  autonomous inbox listener, live parametric substitution, and
                  1-click human approval pipeline.
                </p>
              </div>
              <div className={styles.sprintDeliverable}>
                <strong>Deliverable:</strong>
                Private 90-Second Walkthrough Video + Interactive Sandbox Environment
              </div>
            </div>

            <div className={styles.sprintCard}>
              <div>
                <span className={styles.sprintPhaseTag}>Phase 3 • Days 10 – 14</span>
                <h3 className={styles.sprintCardTitle}>
                  Benchmarking &amp; Production Roadmap
                </h3>
                <p className={styles.sprintCardDesc}>
                  Side-by-side audit comparing agent extraction accuracy,
                  substitution fidelity, and response speed against your team&apos;s
                  historical baseline.
                </p>
              </div>
              <div className={styles.sprintDeliverable}>
                <strong>Deliverable:</strong>
                Deterministic ROI Audit &amp; Full Production Integration Plan
              </div>
            </div>
          </div>

          <div className={styles.sprintSummaryBanner}>
            <div className={styles.summaryLeft}>
              <h4>Ready to Validate Autonomous Execution?</h4>
              <p>
                Zero disruption to your day-to-day operations. No production write
                access needed. Submit your workflow bottleneck to initiate a
                validation sprint.
              </p>
            </div>
            <div>
              <CTAButton href="#intake-form" variant="primary" size="large">
                Request a Custom Sandbox
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. Contact and Conversion Intake Flow ===== */}
      <section className="section section--dark" id="intake">
        <div className="container">
          <div className="section-header">
            <h2>Request a Custom Sandbox</h2>
            <p>
              Replace manual quoting, data entry, and help-desk friction with
              deterministic Agentic AI. Share your bottleneck below for rapid
              asynchronous evaluation.
            </p>
          </div>

          <p className={styles.pricingQualifier}>
            Engagements are structured as fixed-fee Value Validation Sprints
            followed by full deployment, typically ranging from $15,000 to
            $85,000+ depending on scope.
          </p>

          <AiSolutionsIntakeForm />
        </div>
      </section>
    </>
  );
}
