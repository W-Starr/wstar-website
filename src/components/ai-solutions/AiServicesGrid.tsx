import React from "react";
import {
  Mail,
  FileCode,
  Layers,
  Send,
  Database,
  FileText,
  LifeBuoy,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Terminal,
  Cpu,
} from "lucide-react";
import styles from "./AiServicesGrid.module.css";

export default function AiServicesGrid() {
  return (
    <div className={styles.servicesSection}>
      {/* Service 1: Autonomous Procurement & Sales Agents */}
      <article className={styles.serviceCard} id="procurement-agent">
        <header className={styles.serviceHeader}>
          <div className={styles.serviceIndexRow}>
            <span className={styles.serviceBadge}>
              <Cpu size={14} /> Deterministic Pipeline • Production Ready
            </span>
            <span className={styles.serviceStatusIndicator}>
              <span className={styles.statusDot} /> Active Inbox Sandbox
            </span>
          </div>
          <h3 className={styles.serviceTitle}>
            1. Autonomous Procurement & Sales Agents
          </h3>
          <blockquote className={styles.serviceQuote}>
            Our procurement agents sit directly in front of your sales inbox to
            autonomously process chaotic, unstructured customer purchase orders
            and RFQs.
          </blockquote>
        </header>

        <div className={styles.serviceBody}>
          <div className={styles.pillarsList}>
            {/* Pillar 1: Instant Extraction */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconWrap}>
                <FileCode size={22} />
              </div>
              <div className={styles.pillarContent}>
                <h4>Instant Extraction</h4>
                <p>
                  The agent reads multi-line emails and messy PDFs, extracting
                  critical technical metadata into a clean, normalized
                  structure.
                </p>
              </div>
            </div>

            {/* Pillar 2: Parametric Substitution Logic */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconWrap}>
                <Layers size={22} />
              </div>
              <div className={styles.pillarContent}>
                <h4>Parametric Substitution Logic</h4>
                <p>
                  If a customer requests a component that is out-of-stock, the
                  agent autonomously queries your live database to find a
                  functionally identical substitute with matching dimensions or
                  engineering specifications.
                </p>
              </div>
            </div>

            {/* Pillar 3: Autonomous Execution */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconWrap}>
                <Send size={22} />
              </div>
              <div className={styles.pillarContent}>
                <h4>Autonomous Execution</h4>
                <p>
                  In seconds, the system drafts a highly professional, contextual
                  reply email confirming stock availability and gracefully
                  offering parameter-backed substitutes, requiring only a single
                  human click to approve.
                </p>
              </div>
            </div>
          </div>

          {/* Side Inspector: Live Procurement Pipeline Telemetry */}
          <aside className={styles.technicalPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>
                <Terminal size={14} className={styles.stepIcon} /> Deterministic Agent Execution
              </span>
              <span className={styles.panelMeta}>PIPELINE // ACTIVE</span>
            </div>

            <div className={styles.pipelineSteps}>
              <div className={styles.pipelineStep}>
                <div className={styles.stepLeft}>
                  <Mail size={15} className={styles.stepIcon} />
                  <span>Unstructured Ingest</span>
                </div>
                <span className={styles.stepValue}>PDF / RFC 822 Email</span>
              </div>
              <div className={styles.pipelineStep}>
                <div className={styles.stepLeft}>
                  <Database size={15} className={styles.stepIcon} />
                  <span>ERP Inventory Sync</span>
                </div>
                <span className={styles.stepValue}>Live Parametric SQL</span>
              </div>
              <div className={styles.pipelineStep}>
                <div className={styles.stepLeft}>
                  <Zap size={15} className={styles.stepIcon} />
                  <span>Turnaround Latency</span>
                </div>
                <span className={styles.stepValue}>&lt; 1.8s Autonomous</span>
              </div>
            </div>

            <div className={styles.codeSnippetBox}>
              <div className={styles.codeComment}>
                // Illustrative sandbox output — not a live client deployment
              </div>
              <div className={styles.codeComment}>// Parametric substitution payload</div>
              <div>&#123;</div>
              <div>&nbsp;&nbsp;<span className={styles.codeKey}>&quot;requested_sku&quot;</span>: <span className={styles.codeVal}>&quot;HYD-VLV-400A&quot;</span>,</div>
              <div>&nbsp;&nbsp;<span className={styles.codeKey}>&quot;stock_status&quot;</span>: <span className={styles.codeVal}>&quot;OUT_OF_STOCK&quot;</span>,</div>
              <div>&nbsp;&nbsp;<span className={styles.codeKey}>&quot;substitute_sku&quot;</span>: <span className={styles.codeVal}>&quot;HYD-VLV-400B-SS&quot;</span>,</div>
              <div>&nbsp;&nbsp;<span className={styles.codeKey}>&quot;tolerance_delta&quot;</span>: <span className={styles.codeVal}>&quot;0.000mm (Direct Match)&quot;</span>,</div>
              <div>&nbsp;&nbsp;<span className={styles.codeKey}>&quot;approval_gate&quot;</span>: <span className={styles.codeVal}>&quot;HUMAN_ONE_CLICK&quot;</span></div>
              <div>&#125;</div>
            </div>

            <div className={styles.panelFooter}>
              <span>Protocol: Zero Hallucination</span>
              <span className={styles.panelFooterHighlight}>
                <CheckCircle2 size={14} /> 100% Deterministic
              </span>
            </div>
          </aside>
        </div>
      </article>

      {/* Service 2: B2B Support & Knowledge Retrieval (RAG) Agents */}
      <article className={styles.serviceCard} id="rag-agent">
        <header className={styles.serviceHeader}>
          <div className={styles.serviceIndexRow}>
            <span className={styles.serviceBadge}>
              <Database size={14} /> Proprietary Context • Vector Grounded
            </span>
            <span className={styles.serviceStatusIndicator}>
              <span className={styles.statusDot} /> Multi-Tier Indexed
            </span>
          </div>
          <h3 className={styles.serviceTitle}>
            2. B2B Support & Knowledge Retrieval (RAG) Agents
          </h3>
          <blockquote className={styles.serviceQuote}>
            Stop forcing highly paid engineers to act as a manual help desk. We
            build context-aware Retrieval-Augmented Generation (RAG) agents
            trained exclusively on your proprietary internal data.
          </blockquote>
        </header>

        <div className={styles.serviceBody}>
          <div className={styles.pillarsList}>
            {/* Pillar 1: Enterprise-Grade Accuracy */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconWrap}>
                <ShieldCheck size={22} />
              </div>
              <div className={styles.pillarContent}>
                <h4>Enterprise-Grade Accuracy</h4>
                <p>
                  Deployed securely to index your specific technical manuals,
                  standard operating procedures, or historical support tickets.
                </p>
              </div>
            </div>

            {/* Pillar 2: Autonomous Triage */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconWrap}>
                <LifeBuoy size={22} />
              </div>
              <div className={styles.pillarContent}>
                <h4>Autonomous Triage</h4>
                <p>
                  Acts as a tier-one support engineer for external clients or an
                  internal encyclopedic assistant for your staff.
                </p>
              </div>
            </div>

            {/* Pillar 3: Capacity Protection */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconWrap}>
                <Zap size={22} />
              </div>
              <div className={styles.pillarContent}>
                <h4>Capacity Protection</h4>
                <p>
                  Rapidly deflects repetitive manual queries, instantly
                  retrieving complex technical answers so your human workforce
                  can focus on high-value problem-solving.
                </p>
              </div>
            </div>
          </div>

          {/* Side Inspector: Enterprise Knowledge Architecture */}
          <aside className={styles.technicalPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>
                <FileText size={14} className={styles.stepIcon} /> Proprietary Vector Store
              </span>
              <span className={styles.panelMeta}>ISOLATION // AIR-GAPPED</span>
            </div>

            <div className={styles.pipelineSteps}>
              <div className={styles.pipelineStep}>
                <div className={styles.stepLeft}>
                  <FileText size={15} className={styles.stepIcon} />
                  <span>CAD &amp; Engineering Specs</span>
                </div>
                <span className={styles.stepValue}>Dense Hybrid Embeddings</span>
              </div>
              <div className={styles.pipelineStep}>
                <div className={styles.stepLeft}>
                  <ShieldCheck size={15} className={styles.stepIcon} />
                  <span>Enterprise Data Isolation</span>
                </div>
                <span className={styles.stepValue}>Zero External Training</span>
              </div>
              <div className={styles.pipelineStep}>
                <div className={styles.stepLeft}>
                  <Cpu size={15} className={styles.stepIcon} />
                  <span>Tier-One Deflection</span>
                </div>
                <span className={styles.stepValue}>75%–85% Auto-Resolved (sandbox benchmark)</span>
              </div>
            </div>

            <div className={styles.codeSnippetBox}>
              <div className={styles.codeComment}>
                // Illustrative sandbox output — not a live client deployment
              </div>
              <div className={styles.codeComment}>// Verified citation grounding</div>
              <div>&#123;</div>
              <div>&nbsp;&nbsp;<span className={styles.codeKey}>&quot;grounding_source&quot;</span>: <span className={styles.codeVal}>&quot;SOP-MECH-712-REV4.pdf&quot;</span>,</div>
              <div>&nbsp;&nbsp;<span className={styles.codeKey}>&quot;section&quot;</span>: <span className={styles.codeVal}>&quot;Section 4.2.1 (Torque Specs)&quot;</span>,</div>
              <div>&nbsp;&nbsp;<span className={styles.codeKey}>&quot;confidence_metric&quot;</span>: <span className={styles.codeVal}>0.994</span>,</div>
              <div>&nbsp;&nbsp;<span className={styles.codeKey}>&quot;hallucination_risk&quot;</span>: <span className={styles.codeVal}>&quot;0.000 (Strictly Bounded)&quot;</span></div>
              <div>&#125;</div>
            </div>

            <div className={styles.panelFooter}>
              <span>Engineering Time Saved (Modeled Estimate)</span>
              <span className={styles.panelFooterHighlight}>
                <CheckCircle2 size={14} /> ~40+ Hrs / Engineer / Mo
              </span>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
