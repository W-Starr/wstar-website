"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Cpu,
  AlertCircle,
  Loader2,
} from "lucide-react";
import styles from "./AiSolutionsIntakeForm.module.css";

export default function AiSolutionsIntakeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    workEmail: "",
    company: "",
    erpInfrastructure: "",
    weeklyHours: "",
    manufacturingType: "",
    bottleneckDescription: "",
    website: "", // honeypot — real visitors never see or fill this in
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.workEmail.trim() ||
      !formData.company.trim() ||
      !formData.erpInfrastructure ||
      !formData.weeklyHours ||
      !formData.manufacturingType ||
      !formData.bottleneckDescription.trim()
    ) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "ai-solutions-intake",
          name: formData.name,
          email: formData.workEmail,
          website: formData.website,
          details: {
            company: formData.company,
            erpInfrastructure: formData.erpInfrastructure,
            weeklyHours: formData.weeklyHours,
            manufacturingType: formData.manufacturingType,
            bottleneckDescription: formData.bottleneckDescription,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      const generatedId = `SBX-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketId(generatedId);
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMessage("");
    setFormData({
      name: "",
      workEmail: "",
      company: "",
      erpInfrastructure: "",
      weeklyHours: "",
      manufacturingType: "",
      bottleneckDescription: "",
      website: "",
    });
  };

  if (submitted) {
    return (
      <div className={styles.confirmationCard}>
        <div className={styles.successIconWrap}>
          <CheckCircle2 size={36} />
        </div>
        <h3 className={styles.confirmationTitle}>
          Bottleneck Received — Solutions Architect Assigned
        </h3>
        <p className={styles.confirmationText}>
          Thank you, <strong>{formData.name}</strong>. We have logged your
          workflow constraints for <strong>{formData.company || "your enterprise"}</strong>.
          Our Mechatronics Solutions Architect is analyzing your{" "}
          <strong>{formData.erpInfrastructure}</strong> environment to construct
          your dedicated 90-second sandbox video prototype.
        </p>

        <div className={styles.ticketBadge}>
          <Cpu size={16} /> Ticket Reference: #{ticketId} • Priority: Sprint Ingest
        </div>

        <div>
          <button
            onClick={handleReset}
            className={styles.submitSecondaryBtn}
          >
            Submit Another Workflow Bottleneck
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.intakeWrapper} id="intake-form">
      {/* Targeted Intake Form */}
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {/* Honeypot field — hidden from real users, bots tend to fill every input */}
          <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
            <label htmlFor="ai-solutions-website">Website</label>
            <input
              id="ai-solutions-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className={styles.formGrid}>
            {/* Full Name */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Full Name <span className={styles.requiredStar}>*</span>
              </label>
              <input
                id="name"
                type="text"
                className={styles.formInput}
                placeholder="e.g. Marcus Vance"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Corporate Work Email */}
            <div className={styles.formGroup}>
              <label htmlFor="workEmail" className={styles.formLabel}>
                Corporate Work Email <span className={styles.requiredStar}>*</span>
              </label>
              <input
                id="workEmail"
                type="email"
                className={styles.formInput}
                placeholder="m.vance@industrial-corp.com"
                value={formData.workEmail}
                onChange={(e) =>
                  setFormData({ ...formData, workEmail: e.target.value })
                }
                required
              />
            </div>

            {/* Company / Facility */}
            <div className={styles.formGroup}>
              <label htmlFor="company" className={styles.formLabel}>
                Company / Enterprise <span className={styles.requiredStar}>*</span>
              </label>
              <input
                id="company"
                type="text"
                className={styles.formInput}
                placeholder="e.g. Apex Industrial Systems"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
            </div>

            {/* Required Field: Current ERP/CRM Infrastructure */}
            <div className={styles.formGroup}>
              <label htmlFor="erpInfrastructure" className={styles.formLabel}>
                Current ERP/CRM Infrastructure <span className={styles.requiredStar}>*</span>
              </label>
              <select
                id="erpInfrastructure"
                className={styles.formSelect}
                value={formData.erpInfrastructure}
                onChange={(e) =>
                  setFormData({ ...formData, erpInfrastructure: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Select your ERP/CRM system
                </option>
                <option value="SAP (S/4HANA or ECC)">SAP (S/4HANA or ECC)</option>
                <option value="Oracle NetSuite">Oracle NetSuite</option>
                <option value="Epicor Kinetic / Prophet 21">
                  Epicor (Kinetic / Prophet 21)
                </option>
                <option value="Infor CloudSuite / LN / M3">Infor (CloudSuite / LN / M3)</option>
                <option value="Microsoft Dynamics 365">
                  Microsoft Dynamics 365 (F&amp;O / BC)
                </option>
                <option value="Salesforce / HubSpot + Legacy ERP">
                  Salesforce / HubSpot + Legacy ERP
                </option>
                <option value="Custom SQL Database / On-Premise">
                  Custom SQL / On-Premise Legacy Database
                </option>
                <option value="Other / Proprietary Stack">
                  Other / Proprietary Industrial Stack
                </option>
              </select>
            </div>

            {/* Required Field: Estimated Weekly Hours Spent on Manual Quoting/Data Entry */}
            <div className={styles.formGroup}>
              <label htmlFor="weeklyHours" className={styles.formLabel}>
                Estimated Weekly Hours on Manual Quoting/Data Entry{" "}
                <span className={styles.requiredStar}>*</span>
              </label>
              <select
                id="weeklyHours"
                className={styles.formSelect}
                value={formData.weeklyHours}
                onChange={(e) =>
                  setFormData({ ...formData, weeklyHours: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Select estimated manual quoting hours
                </option>
                <option value="10 - 25 hours / week">10 – 25 hours / week</option>
                <option value="25 - 50 hours / week">25 – 50 hours / week</option>
                <option value="50 - 100 hours / week">50 – 100 hours / week</option>
                <option value="100+ hours / week (Enterprise Team)">
                  100+ hours / week (Multi-facility engineering/sales team)
                </option>
              </select>
            </div>

            {/* Required Field: Core Manufacturing Type */}
            <div className={styles.formGroup}>
              <label htmlFor="manufacturingType" className={styles.formLabel}>
                Core Manufacturing Type <span className={styles.requiredStar}>*</span>
              </label>
              <select
                id="manufacturingType"
                className={styles.formSelect}
                value={formData.manufacturingType}
                onChange={(e) =>
                  setFormData({ ...formData, manufacturingType: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Select core manufacturing model
                </option>
                <option value="Engineer-to-Order (ETO)">
                  Engineer-to-Order (ETO)
                </option>
                <option value="High-Mix / Low-Volume (HMLV)">
                  High-Mix / Low-Volume (HMLV)
                </option>
                <option value="Technical Wholesale & Industrial Distribution">
                  Technical Wholesale &amp; Industrial Distribution
                </option>
                <option value="Make-to-Order (MTO)">Make-to-Order (MTO)</option>
                <option value="Contract Precision Machining & Assembly">
                  Contract Precision Machining &amp; Assembly
                </option>
                <option value="Industrial Maintenance, Repair & Operations (MRO)">
                  Industrial Maintenance, Repair &amp; Operations (MRO)
                </option>
              </select>
            </div>

            {/* Bottleneck Description */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="bottleneck" className={styles.formLabel}>
                Workflow Bottleneck Description <span className={styles.requiredStar}>*</span>
              </label>
              <textarea
                id="bottleneck"
                className={styles.formTextarea}
                placeholder="Describe your current friction: e.g. Customer RFQs arrive with 40-line PDFs with out-of-date part numbers; our sales engineers waste 18 hours weekly cross-checking CAD specs and warehouse stock..."
                value={formData.bottleneckDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bottleneckDescription: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          {/* EXACT ASYNCHRONOUS PROMISE from CEO Spec directly above the submit button */}
          <div className={styles.asyncPromiseBox}>
            <Sparkles size={20} className={styles.asyncPromiseIcon} />
            <p className={styles.asyncPromiseText}>
              &quot;Submit your workflow bottleneck, and our Solutions Architect will deliver a custom 90-second sandbox prototype demonstrating the autonomous resolution directly to your inbox.&quot;
            </p>
          </div>

          {errorMessage && (
            <div className={styles.formErrorBox}>
              <AlertCircle size={16} /> <span>{errorMessage}</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className={styles.submitActions}>
            <button type="submit" className={styles.submitPrimaryBtn} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className={styles.spinnerIcon} /> Submitting...
                </>
              ) : (
                <>
                  <Send size={16} /> Request a Custom Sandbox
                </>
              )}
            </button>

            <Link
              href="#sprint"
              className={styles.submitSecondaryBtn}
            >
              Explore a Value Validation Sprint <ArrowRight size={14} />
            </Link>
          </div>
        </form>
      </div>

      {/* Side Context & Security Card */}
      <aside className={styles.intakeSideCard}>
        <div className={styles.guaranteeBox}>
          <h4 className={styles.guaranteeTitle}>The Sandbox Protocol</h4>
          <p className={styles.guaranteeText}>
            We do not pitch slideware or ask for open-ended exploratory calls.
            Within 24 business hours, our Mechatronics engineering team models
            your exact component constraints, spins up an isolated sandbox, and
            records an asynchronous 90-second Loom demonstration of your resolution.
          </p>

          <div className={styles.trustList}>
            <div className={styles.trustItem}>
              <CheckCircle2 size={18} className={styles.trustIcon} />
              <div>
                <div className={styles.trustItemTitle}>
                  Zero Disruption Sandbox
                </div>
                <p className={styles.trustItemDesc}>
                  No live ERP write access required. We test against simulated
                  or sanitized schema fixtures.
                </p>
              </div>
            </div>

            <div className={styles.trustItem}>
              <Lock size={18} className={styles.trustIcon} />
              <div>
                <div className={styles.trustItemTitle}>
                  Air-Gapped IP Isolation
                </div>
                <p className={styles.trustItemDesc}>
                  Your CAD drawings, pricing tiers, and vendor catalogs remain
                  strictly confidential and never train public models.
                </p>
              </div>
            </div>

            <div className={styles.trustItem}>
              <Clock size={18} className={styles.trustIcon} />
              <div>
                <div className={styles.trustItemTitle}>
                  90-Second Rapid Feasibility
                </div>
                <p className={styles.trustItemDesc}>
                  Clear, visual proof of deterministic accuracy before any
                  commercial commitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
