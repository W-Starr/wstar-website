"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Video,
} from "lucide-react";
import styles from "./SandboxShowcase.module.css";

interface SandboxVideo {
  id: string;
  title: string;
  duration: string;
  isHero: boolean;
  category: string;
  summary: string;
  leftPanelTitle: string;
  rightPanelTitle: string;
  demoPoints: string[];
  /** When set, a real recorded video plays instead of the simulated terminal replay. */
  videoUrl?: string;
}

const VIDEOS: SandboxVideo[] = [
  {
    id: "procurement",
    title: "Autonomous Procurement Agent Sandbox (90s)",
    duration: "01:30",
    isHero: true,
    videoUrl: "/videos/procurement-agent-demo.mp4",
    category: "Hero Demonstration",
    summary:
      "Watch our completed Autonomous Procurement Agent process an unstructured multi-line RFQ from an industrial customer, cross-reference live ERP inventory, find a parametric substitute, and draft an approval-ready reply in real time.",
    leftPanelTitle: "RAW INBOX STREAM // Unstructured RFQ Email",
    rightPanelTitle: "NORMALIZED AGENT WORKSPACE // Parametric JSON & Draft",
    demoPoints: [
      "The agent normalizes messy data into a clean JSON structure and autonomously drafts a highly professional, contextual reply email.",
      "Autonomously queries live database to find a functionally identical substitute with matching dimensions or engineering specifications.",
      "Requires only a single human click to approve before sending directly from the existing sales inbox.",
    ],
  },
  {
    id: "rag",
    title: "B2B Support & Knowledge Retrieval (RAG) Sandbox (90s)",
    duration: "01:30",
    isHero: false,
    category: "Knowledge Sandbox",
    summary:
      "See how our context-aware RAG agent ingests proprietary OEM technical manuals and ASME schematics, instantaneously providing tier-one support with zero hallucinations.",
    leftPanelTitle: "INBOUND TECHNICAL TICKET // Tier-1 Escalation",
    rightPanelTitle: "INDEXED VECTOR RETRIEVAL // Bounded ASME Grounding",
    demoPoints: [
      "Indexes proprietary CAD schematics, SOP manuals, and historical warranty tickets in isolated secure storage.",
      "Acts as a tier-one support engineer for clients and an encyclopedic technical assistant for field staff.",
      "Instantly retrieves complex engineering answers, deflecting repetitive queries to protect workforce capacity.",
    ],
  },
  {
    id: "parametric",
    title: "Parametric Substitution & ERP Tolerance Engine (90s)",
    duration: "01:30",
    isHero: false,
    category: "Mechatronics Engine",
    summary:
      "Explore the physics-aware substitution algorithm comparing physical dimensions, pressure ratings, and flange diameters to prevent pipeline leakage.",
    leftPanelTitle: "OUT-OF-STOCK COMPONENT // SKU: HYD-VLV-400A",
    rightPanelTitle: "PARAMETRIC MATCH ENGINE // Verified Zero-Delta Substitute",
    demoPoints: [
      "Evaluates mechanical tolerances, pressure thresholds, and thread pitches with deterministic precision.",
      "Eliminates manual catalog scouring when supply chain delays disrupt primary product lines.",
      "Integrates directly with SAP, NetSuite, Epicor, and custom legacy SQL ERP databases.",
    ],
  },
];

export default function SandboxShowcase() {
  const [activeVideoId, setActiveVideoId] = useState("procurement");
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerCardRef = useRef<HTMLDivElement>(null);

  const activeVideo =
    VIDEOS.find((v) => v.id === activeVideoId) || VIDEOS[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => (prev >= 90 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (playerCardRef.current?.requestFullscreen) {
          await playerCardRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle unavailable:", err);
    }
  };

  const handleSelectVideo = (videoId: string) => {
    setActiveVideoId(videoId);
    setSecondsElapsed(0);
    setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = (secondsElapsed / 90) * 100;

  return (
    <div className={styles.galleryContainer}>
      {/* Demonstration mode badge */}
      <div className={styles.illustrativeBadge}>
        <Video size={14} />
        {activeVideo.videoUrl
          ? "Live Agent Demonstration // Screen Capture"
          : "Workflow Architecture Walkthrough // Systems Model"}
      </div>

      {/* Video Gallery Tabs */}
      <div className={styles.galleryTabs} role="tablist">
        {VIDEOS.map((video) => (
          <button
            key={video.id}
            role="tab"
            aria-selected={activeVideo.id === video.id}
            className={`${styles.galleryTab} ${
              activeVideo.id === video.id ? styles.galleryTabActive : ""
            }`}
            onClick={() => handleSelectVideo(video.id)}
          >
            <Video size={16} />
            <span>{video.title}</span>
            {video.isHero && (
              <span className={styles.heroAssetBadge}>Featured Demo</span>
            )}
          </button>
        ))}
      </div>

      {/* Video Player & Architecture Frame */}
      <div className={styles.videoPlayerCard} ref={playerCardRef}>
        <div className={styles.videoPlayerTopBar}>
          <div className={styles.videoTopLeft}>
            <div className={styles.windowControls}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.videoTitle}>{activeVideo.title}</span>
          </div>

          <div className={styles.loomTag}>
            {activeVideo.videoUrl ? (
              <><span style={{ fontWeight: 800 }}>Live Recording</span> • End-to-End Agent Execution</>
            ) : (
              <><span style={{ fontWeight: 800 }}>Architecture</span> • Interactive Pipeline Flow</>
            )}
          </div>
        </div>

        {activeVideo.videoUrl ? (
          <video
            key={activeVideo.id}
            className={styles.realVideoPlayer}
            src={activeVideo.videoUrl}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
        <>
        {/* Video Canvas Stage */}
        <div className={styles.videoStage}>
          <div className={styles.watermark}>
            <Image
              src="/images/wstar-logo-light.png"
              alt="WSTAR Logo"
              width={70}
              height={20}
              style={{ objectFit: "contain" }}
            />
            <span>AI SANDBOX</span>
          </div>

          {/* Simulated Sandbox Terminal View */}
          <div className={styles.sandboxScreen}>
            {/* Left Screen: Inbound Unstructured Request */}
            <div className={styles.sandboxWindow}>
              <div className={styles.windowTitle}>
                <span>{activeVideo.leftPanelTitle}</span>
                <span className={styles.windowBadge}>RAW INPUT</span>
              </div>
              <div className={styles.windowContent}>
                {activeVideo.id === "procurement" ? (
                  <>
                    <div className={styles.emailSubject}>
                      Subject: Urgent Quote Request: 14x Hydraulic Valves &amp; Couplings
                    </div>
                    <div className={styles.emailSender}>
                      From: procurement@apex-manufacturing.com (Attachments: RFQ_PO_Scan.pdf)
                    </div>
                    <div>
                      &quot;Hi Team, we need 14 units of part #HYD-VLV-400A by
                      next Friday for our line overhaul. If not in stock, what is
                      a compatible high-pressure valve that fits the same 3/4&quot;
                      flange without drilling? Please confirm ASAP.&quot;
                    </div>
                    <div style={{ marginTop: 12, color: "#94A3B8" }}>
                      &gt; Ingesting RFC 822 stream... <span className={styles.emailHighlight}>14x HYD-VLV-400A [OUT OF STOCK]</span>
                    </div>
                  </>
                ) : activeVideo.id === "rag" ? (
                  <>
                    <div className={styles.emailSubject}>
                      Support Query #TKT-9912: Tolerance Deviation on Rotor Pin
                    </div>
                    <div className={styles.emailSender}>
                      Submitted by: lead_tech@continental-turbines.com
                    </div>
                    <div>
                      &quot;During field assembly of unit B-49, the thermal
                      clearance measured 0.042mm against ambient 38°C. Does this
                      violate Section 6.1 torque limits? Need sign-off before hot
                      restart.&quot;
                    </div>
                    <div style={{ marginTop: 12, color: "#94A3B8" }}>
                      &gt; Vector search over 450-page OEM Service Manual...
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.emailSubject}>
                      Parametric Constraint Matrix: Hydraulic Valve Class 300
                    </div>
                    <div className={styles.emailSender}>
                      Target SKU: HYD-VLV-400A | Flange: 3/4&quot; SAE | Pressure: 5,000 PSI
                    </div>
                    <div>
                      Live ERP Query: 0 on-shelf at Midwest Distribution Hub.
                      Executing parametric tolerance algorithm across 12,400
                      catalog items...
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Screen: Autonomous Normalized Agent Execution */}
            <div className={styles.sandboxWindow}>
              <div className={styles.windowTitle}>
                <span>{activeVideo.rightPanelTitle}</span>
                <span
                  className={styles.windowBadge}
                  style={{
                    color: "#10B981",
                    background: "rgba(16, 185, 129, 0.15)",
                  }}
                >
                  DETERMINISTIC
                </span>
              </div>
              <div className={styles.windowContent}>
                {activeVideo.id === "procurement" ? (
                  <>
                    <div>
                      <span className={styles.jsonKey}>&quot;extracted_metadata&quot;</span>: &#123;
                    </div>
                    <div>
                      &nbsp;&nbsp;<span className={styles.jsonKey}>&quot;target_sku&quot;</span>: <span className={styles.jsonString}>&quot;HYD-VLV-400A&quot;</span>,
                    </div>
                    <div>
                      &nbsp;&nbsp;<span className={styles.jsonKey}>&quot;qty&quot;</span>: <span className={styles.jsonNum}>14</span>,
                    </div>
                    <div>
                      &nbsp;&nbsp;<span className={styles.jsonKey}>&quot;substitute_sku&quot;</span>: <span className={styles.jsonString}>&quot;HYD-VLV-400B-SS&quot;</span>,
                    </div>
                    <div>
                      &nbsp;&nbsp;<span className={styles.jsonKey}>&quot;dimension_match&quot;</span>: <span className={styles.jsonString}>&quot;Exact 3/4in Flange (0.00mm delta)&quot;</span>
                    </div>
                    <div>&#125;,</div>
                    <div style={{ marginTop: 8, color: "#38BDF8" }}>
                      &gt; Drafted Contextual Reply Generated:
                    </div>
                    <div style={{ color: "#E2E8F0", fontSize: "0.71rem" }}>
                      &quot;Dear Apex Team, HYD-VLV-400A is currently on backorder, but we have 22 units of the 100% parameter-backed HYD-VLV-400B-SS in stock for immediate dispatch tomorrow...&quot;
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        display: "inline-block",
                        background: "#10B981",
                        color: "#0A0D17",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: "0.68rem",
                      }}
                    >
                      ✓ 1-CLICK HUMAN APPROVAL READY
                    </div>
                  </>
                ) : activeVideo.id === "rag" ? (
                  <>
                    <div style={{ color: "#10B981", fontWeight: 700 }}>
                      ✓ Bounded Citation Found: Manual DOC-TURB-2024 (P. 142)
                    </div>
                    <div style={{ marginTop: 8 }}>
                      &quot;Per Section 6.1.4, thermal clearance at 38°C allows
                      up to 0.045mm before torque compensation is required. 0.042mm
                      is within certified tolerance. Proceed with standard torque
                      sequence at 65 Nm.&quot;
                    </div>
                    <div style={{ marginTop: 12, color: "#38BDF8" }}>
                      Resolution Time: 1.2 seconds • Zero Tier-2 escalation needed.
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ color: "#38BDF8" }}>
                      Candidate Substitutes Evaluated: 38
                    </div>
                    <div style={{ color: "#10B981", marginTop: 6 }}>
                      Parametric Match Confirmed:
                    </div>
                    <div style={{ fontSize: "0.71rem", marginTop: 4 }}>
                      • Part: HYD-VLV-400B-SS (316 Stainless)<br />
                      • Flange: 3/4&quot; SAE Code 61 (Exact)<br />
                      • Pressure Rating: 6,000 PSI (+1,000 PSI safety factor)<br />
                      • Stock: 22 units available in Local Hub
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Scrubber & Playback Controls */}
        <div className={styles.videoControlsBar}>
          <button
            className={styles.playPauseBtn}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause 90s Sandbox Video" : "Play 90s Sandbox Video"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
          </button>

          <div
            className={styles.timelineTrack}
            role="slider"
            tabIndex={0}
            aria-label="Video timeline scrubber"
            aria-valuemin={0}
            aria-valuemax={90}
            aria-valuenow={secondsElapsed}
            aria-valuetext={`${formatTime(secondsElapsed)} of 01:30`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
              setSecondsElapsed(Math.round(newPercent * 90));
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                setSecondsElapsed((prev) => Math.max(0, prev - 5));
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                setSecondsElapsed((prev) => Math.min(90, prev + 5));
              }
            }}
          >
            <div
              className={styles.timelineProgress}
              style={{ width: `${progressPercent}%` }}
            >
              <div className={styles.timelineHandle} />
            </div>
          </div>

          <div className={styles.timeDisplay}>
            {formatTime(secondsElapsed)} / 01:30
          </div>

          <button
            className={styles.volumeBtn}
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            className={styles.fullscreenBtn}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
        </>
        )}
      </div>

      {/* Video Description & Demonstration Points from CEO Spec */}
      <div className={styles.videoDescriptionCard}>
        <div className={styles.descLeft}>
          <div
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--bright-blue)",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {activeVideo.category} • 90-Second Walkthrough
          </div>
          <h4>{activeVideo.title}</h4>
          <p className={styles.descText}>{activeVideo.summary}</p>
        </div>

        <div className={styles.demoPointsList}>
          {activeVideo.demoPoints.map((point, idx) => (
            <div key={idx} className={styles.demoPointItem}>
              <CheckCircle2 size={18} className={styles.demoPointIcon} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
