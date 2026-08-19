import {
  Product,
  ProductArea,
  WorkItem,
  Decision,
  FeedbackItem,
  Project,
  RoadmapItem,
  ActivityItem,
  Proposal,
} from '../types'

export const initialProducts: Product[] = [
  {
    id: 'ace-acad',
    name: 'Ace Acad',
    tagline: 'Smart Academic Companion for Nigerian University Students',
    description:
      'A structured mobile learning companion pairing curated institutional course materials with guided study paths, session quizzes, and offline Drift SQLite caching.',
    status: 'beta',
    targetAudience: '100L Undergraduate Students at Ahmadu Bello University (ABU), Zaria',
    version: '1.0.0+3',
    healthStatus: 'healthy',
    areas: [
      'area-auth',
      'area-library',
      'area-study-path',
      'area-quiz',
      'area-storage',
      'area-feedback',
      'area-analytics',
      'area-ugc',
      'area-ai-pipeline',
    ],
  },
  {
    id: 'plantiq',
    name: 'PlantIQ',
    tagline: 'AI-Driven Smart Agriculture & Crop Disease Detection',
    description:
      'Precision agriculture mobile and IoT diagnostic suite empowering African smallholder farmers with early crop pathology detection.',
    status: 'planning',
    targetAudience: 'Agronomists and Commercial Farming Clusters in Northern Nigeria',
    version: '0.1.0-alpha',
    healthStatus: 'healthy',
    areas: ['area-plantiq-core'],
  },
  {
    id: 'wstar-core',
    name: 'WSTAR Core & Corporate HQ',
    tagline: 'Enterprise Operating System, Governance & Brand Infrastructure',
    description:
      'Corporate governance, NDPA/FCCPA statutory filings, marketing web properties, founder agreements, and investor relations.',
    status: 'live',
    targetAudience: 'Internal WSTAR Leadership, Institutional Partners, and Investors',
    version: '1.0.0',
    healthStatus: 'healthy',
    areas: ['area-wstar-ops', 'area-wstar-web'],
  },
]

export const initialProductAreas: ProductArea[] = [
  {
    id: 'area-auth',
    productId: 'ace-acad',
    name: 'Auth, Profile & NDPA Hub',
    description:
      'Firebase Auth, ABU 12-faculty profiling, NDPA 2023 versioned consent, JSON data export, and self-service account deletion.',
    maturity: 90,
    owner: 'Abdulaziz',
    iconName: 'ShieldCheck',
  },
  {
    id: 'area-library',
    productId: 'ace-acad',
    name: 'E-Library & Course Catalog',
    description:
      '100L–500L Level/Semester filtered courseware catalog with Dio background downloader and storage cleaner.',
    maturity: 90,
    owner: 'Abdulaziz',
    iconName: 'BookOpen',
  },
  {
    id: 'area-study-path',
    productId: 'ace-acad',
    name: 'Study Paths & Bounded Reading',
    description:
      'Sequential topic syllabus pathways, pdfrx native PDF study sessions with topic boundary overflow guards.',
    maturity: 80,
    owner: 'Abdulaziz',
    iconName: 'Route',
  },
  {
    id: 'area-quiz',
    productId: 'ace-acad',
    name: 'Quizzes & Knowledge Checks',
    description:
      'Multiple-choice knowledge verification engine with real-time feedback and score-gated topic completion.',
    maturity: 75,
    owner: 'Abdulaziz',
    iconName: 'CheckCircle2',
  },
  {
    id: 'area-storage',
    productId: 'ace-acad',
    name: 'Offline Drift SQLite Sandbox',
    description:
      'Type-safe SQLite database for downloaded PDF metadata and device sandbox isolation.',
    maturity: 80,
    owner: 'Abdulaziz',
    iconName: 'Database',
  },
  {
    id: 'area-feedback',
    productId: 'ace-acad',
    name: 'Feedback & Support Channel',
    description:
      'In-app user qualitative feedback intake mapped directly to Cloud Firestore feedback collection.',
    maturity: 95,
    owner: 'Abdulaziz',
    iconName: 'MessageSquare',
  },
  {
    id: 'area-analytics',
    productId: 'ace-acad',
    name: 'Telemetry & User Analytics',
    description:
      'Firebase Analytics screen tracking and demographic user property tagging (Faculty, Dept, Year).',
    maturity: 85,
    owner: 'Abdulaziz',
    iconName: 'BarChart2',
  },
  {
    id: 'area-ugc',
    productId: 'ace-acad',
    name: 'Cohort UGC & Class Rep Hub',
    description:
      'Decentralized class shared drives (Uni > Dept > Level), Class Rep upload permissions, Ghostscript compression, and Safe Harbor legal hosting.',
    maturity: 25,
    owner: 'Abdulaziz & Ibrahim',
    iconName: 'UploadCloud',
  },
  {
    id: 'area-ai-pipeline',
    productId: 'ace-acad',
    name: 'AI Study Paths & SM-2 Engine',
    description:
      'One-time Gemini 2.0 Flash batch syllabus parsing ($0.02/course) and client-side SM-2 spaced repetition review scheduler.',
    maturity: 30,
    owner: 'Abdulaziz',
    iconName: 'Sparkles',
  },
  {
    id: 'area-postmvp',
    productId: 'ace-acad',
    name: 'Post-MVP Modules (GPA & Timetable)',
    description:
      '5.0 CGPA Scenario Calculator, Study Timetable Builder, and UGC marketplace enhancements.',
    maturity: 15,
    owner: 'Abdulaziz',
    iconName: 'Calendar',
  },
  {
    id: 'area-plantiq-core',
    productId: 'plantiq',
    name: 'PlantIQ Diagnostics & Agronomy Core',
    description:
      'Crop pathology dataset ingestion, sensor IoT architecture, grant fundraising, and investor pitch deck.',
    maturity: 40,
    owner: 'Ibrahim',
    iconName: 'Leaf',
  },
  {
    id: 'area-wstar-ops',
    productId: 'wstar-core',
    name: 'Corporate Ops, Legal & Compliance',
    description:
      'Founders agreement, NDPC DCMI registrations, CAC corporate affairs, and investor fundraising pipeline.',
    maturity: 90,
    owner: 'Ibrahim',
    iconName: 'ShieldCheck',
  },
  {
    id: 'area-wstar-web',
    productId: 'wstar-core',
    name: 'Public Web Properties & AI Solutions',
    description:
      'wstartech.ng marketing site, Next.js OS dashboard, Sanity CMS studio, and AI Solutions showcase.',
    maturity: 95,
    owner: 'Abdulaziz',
    iconName: 'Globe',
  },
]

export const initialProposals: Proposal[] = [
  {
    id: 'prop-1',
    proposalNumber: 'PROP-001',
    slug: 'cohort-based-ugc-class-rep',
    title: 'Cohort-Based UGC & The "Class Rep" Model',
    subtitle:
      'Decentralizing university courseware scaling via isolated class shared drives & Bridge Program ambassadors',
    category: 'Content Scaling & UGC',
    status: 'approved_for_scoping',
    date: '2026-08-18',
    authors: ['Ibrahim Abdulwahab (CEO)', 'Abdulaziz Abdulwahab (Lead Architect)'],
    relatedDocuments: ['User-Generated Content Upload System — Comprehensive Proposal (March 2026)'],
    filename: 'Product Strategy Memo_ Cohort-Based UGC & The _Class Rep_ Model.md',
    executiveSummary:
      'To scale across 100+ university departments in Nigeria, Ace Acad pivots from a centralized manual curation bottleneck to a Google Drive-like shared cohort workspace. Designated Class Reps upload course materials for their private cohort (Uni > Dept > Level), bypassing internal operational bottlenecks and providing safe harbor copyright protection.',
    problemStatement: [
      {
        painPoint: 'Centralized Curation Bottleneck',
        impact:
          'Sourcing, vetting, and drafting JSON for 100+ departments requires massive manpower and stalls expansion.',
      },
      {
        painPoint: 'Direct Publisher Liability',
        impact:
          'Acting as the direct publisher of course materials exposes Ace Acad to copyright infringement claims.',
      },
      {
        painPoint: 'Admin Review Overload',
        impact:
          'The March 2026 proposal required Ace Acad admins to manually review every single upload before publishing.',
      },
    ],
    proposedSolution:
      'Create isolated cohort workspaces (e.g. ABU > Mechatronics > 200L). Designated Class Reps upload course PDFs. Content self-moderates within the class cohort. Platform runs automated compression, OCR, and AI study path generation.',
    strategicAdvantages: [
      {
        title: 'Safe Harbor Legal Protection',
        description:
          'Ace Acad shifts from content publisher to content host (like Google Drive), insulating the platform from direct copyright liability.',
      },
      {
        title: 'Zero-Manpower Expansion Autopilot',
        description:
          'Launching a new university or department only requires acquiring a single Class Rep to kickstart that cohort, rather than sourcing full curricula internally.',
      },
      {
        title: 'Bridge Program Synergy & Grassroots GTM',
        description:
          'Onboard Bridge Program alumni as University General Managers / Campus Ambassadors to recruit Class Reps across federal universities.',
      },
    ],
    recommendedTierOrApproach: {
      name: 'Cohort Shared Drive + Bridge Ambassador Model',
      rationale:
        'Eliminates manual admin review bottlenecks and provides legal safe harbor protection while accelerating multi-university expansion.',
      estimatedCost: '~$0.00 marginal cost (community-driven)',
      roi: '10x expansion velocity across 100+ Nigerian departments',
    },
    keyRisks: [
      {
        risk: 'Class Rep inactivity or lack of upload incentive',
        likelihood: 'Medium',
        impact: 'High',
        mitigation:
          'Gamified rep recognition, academic partner incentives, and Bridge Program manager oversight.',
      },
      {
        risk: 'Inappropriate or non-academic uploads',
        likelihood: 'Low',
        impact: 'Medium',
        mitigation:
          'Cohort student flagging tools, file type/hash verification, and mandatory Terms of Service checkboxes.',
      },
    ],
    phases: [
      {
        phaseNumber: 1,
        title: 'Technical Scoping & Demographics Routing',
        duration: '1 week',
        deliverable: 'Database schema update for Uni > Dept > Level and updated signup dropdown flow.',
        tasks: [
          'Update Firestore schema for strict Cohort mapping',
          'Wireframe demographic onboarding dropdowns (Uni, Dept, Level)',
          'Add Class Rep role authorization flags in Firebase Auth',
        ],
      },
      {
        phaseNumber: 2,
        title: 'Class Rep Upload Interface & Compression',
        duration: '2 weeks',
        deliverable: 'Contributor upload screen with client-side bounds check & storage handoff.',
        tasks: [
          'Build Class Rep upload screen with PDF bounds check',
          'Deploy Firebase Storage rules for cohort isolation',
          'Integrate Ghostscript compression Cloud Function',
        ],
      },
      {
        phaseNumber: 3,
        title: 'Bridge Ambassador Program & GTM Launch',
        duration: '1 week',
        deliverable: 'Playbook and pitch script for University General Managers.',
        tasks: [
          'Draft Bridge Program ambassador pitch deck',
          'Create Class Rep onboarding cheat sheet & video guide',
          'Deploy first 5 departmental pilot cohorts at ABU Zaria',
        ],
      },
    ],
    actionItems: [
      'Review and update Firestore database schema to support strict Cohorts (Uni > Dept > Level) and Class Rep roles',
      'Wireframe updated onboarding flow (dropdowns for Uni/Dept/Level) and contributor upload UI',
      'Formalize General Manager ambassador program for Bridge Program contacts and draft Class Rep recruitment script',
    ],
    linkedWorkItemIds: ['item-13', 'item-14'],
    linkedDecisionIds: ['dec-5'],
  },
  {
    id: 'prop-2',
    proposalNumber: 'PROP-002',
    slug: 'ai-study-paths-revamp',
    title: 'AI Study & Study Paths Revamp (Tier 2 Hybrid AI)',
    subtitle:
      'Replacing manual JSON authoring with one-time Gemini 2.0 Flash ingestion & SM-2 Spaced Repetition adaptivity',
    category: 'AI & Adaptive Learning',
    status: 'recommended_tier2',
    date: '2026-03-13',
    authors: ['Abdulaziz Abdulwahab (Lead Architect)', 'WSTAR Engineering Team'],
    relatedDocuments: ['Ace Acad SRS Module 3.3 & Module 3.6', 'User-Generated Content Upload System Proposal'],
    filename: 'AI Study & Study Paths Revamp — Proposal.md',
    executiveSummary:
      'Replaces the manual 5-hour-per-course JSON authoring bottleneck with a hybrid AI pipeline. Evaluated 3 architectural tiers and recommends Tier 2 (Hybrid AI): one-time batch Gemini 2.0 Flash PDF ingestion ($0.02/course) paired with deterministic client-side SM-2 spaced repetition for full offline resilience.',
    problemStatement: [
      {
        painPoint: 'Manual JSON Authoring Bottleneck',
        impact:
          'Writing StudyPath -> Module -> Topic JSON manually takes 5+ hours per course and blocks catalog scaling beyond 13 courses.',
      },
      {
        painPoint: 'Linear Non-Adaptive Paths',
        impact:
          'Every student sees the exact same linear path with no proficiency tracking, review scheduling, or score-based guidance.',
      },
      {
        painPoint: 'Handcrafted Quiz Creation',
        impact:
          'Manually drafting 50+ question banks per course slows down content publishing significantly.',
      },
    ],
    proposedSolution:
      'A 3-phase hybrid architecture. Phase 1: Cloud Function + Gemini 2.0 Flash multimodal text extraction + admin review tool. Phase 2: UserProficiency model + SM-2 spaced repetition engine. Phase 3 (optional): Contextual reading AI companion.',
    strategicAdvantages: [
      {
        title: 'Near-Zero Ingestion Cost',
        description:
          'Gemini 2.0 Flash costs ~$0.02 per course (~$0.26 for all 13 courses; $0.00 under Gemini free tier).',
      },
      {
        title: '100% Offline Resilience',
        description:
          'AI runs exclusively during content ingestion; student app runs offline with Drift SQLite and local SM-2 scheduler.',
      },
      {
        title: 'Pedagogical Adaptivity',
        description:
          'Dynamically schedules review quizzes and inserts remediation topics based on individual student mastery.',
      },
    ],
    recommendedTierOrApproach: {
      name: 'Tier 2: Hybrid AI (Phases 1 & 2 Recommended)',
      rationale:
        'Eliminates manual JSON work, adds adaptive spaced repetition, and costs almost nothing without recurring per-request runtime LLM billing.',
      estimatedCost: '~$0.26 one-time for 13 courses + ~$5-15/mo Firebase at 500 users',
      roi: 'Reduces course setup time from 5 hours to 30 minutes',
    },
    keyRisks: [
      {
        risk: 'Image-based scanned PDFs fail text parsing',
        likelihood: 'High',
        impact: 'Medium',
        mitigation:
          'Gemini multimodal vision OCR with PyMuPDF text-layer check as fallback.',
      },
      {
        risk: 'AI-generated quiz question inaccuracies',
        likelihood: 'Medium',
        impact: 'Medium',
        mitigation:
          'Admin review dashboard prior to publishing and in-app question flag button for students.',
      },
    ],
    phases: [
      {
        phaseNumber: 1,
        title: 'Foundation & Smart Generation',
        duration: 'Weeks 1-3',
        deliverable: 'New courses can be ingested and published in ~30 minutes instead of ~5 hours.',
        tasks: [
          'PDF text extraction pipeline using PyMuPDF & Gemini multimodal',
          'Design & test structured StudyPath JSON extraction prompts',
          'AI quiz question generation Cloud Function',
          'Admin review web UI for one-click path verification & approval',
        ],
      },
      {
        phaseNumber: 2,
        title: 'Proficiency & Spaced Repetition',
        duration: 'Weeks 4-6',
        deliverable: 'Study paths dynamically adapt to quiz scores with SM-2 spaced repetition.',
        tasks: [
          'UserProficiency model & Firestore writes on quiz submission',
          'SM-2 spaced repetition scheduler implementation in Flutter/Dart',
          'Adaptive review badges and weak-area alerts on StudySessionScreen',
        ],
      },
      {
        phaseNumber: 3,
        title: 'AI Reading Assistant (Optional Post-MVP)',
        duration: 'Weeks 7-10',
        deliverable: 'Contextual AI study companion accessible while reading course PDFs.',
        tasks: [
          'AI Chat Cloud Function proxy to Gemini Flash with page context',
          'Floating study companion button on StudySessionScreen',
          'Rate limiting and response caching to prevent cost overruns',
        ],
      },
    ],
    actionItems: [
      'Build Cloud Function PDF extraction with PyMuPDF and Gemini 2.0 Flash',
      'Implement SM-2 spaced repetition algorithm in Dart local_database.dart',
      'Create Admin Review dashboard for one-click path approval',
    ],
    linkedWorkItemIds: ['item-15', 'item-16'],
    linkedDecisionIds: ['dec-6'],
  },
  {
    id: 'prop-3',
    proposalNumber: 'PROP-003',
    slug: 'ugc-upload-staging-system',
    title: 'User-Generated Content (UGC) Upload & Staging System',
    subtitle:
      'Quarantined 3-zone storage architecture with Ghostscript compression and Gemini OCR pipeline',
    category: 'Architecture & Ingestion',
    status: 'staged_for_execution',
    date: '2026-03-13',
    authors: ['Abdulaziz Abdulwahab (Lead Architect)', 'WSTAR Engineering Team'],
    relatedDocuments: ['Ace Acad SRS Module 3.10', 'AI Study & Study Paths Revamp Proposal'],
    filename: 'User-Generated Content Upload System — Proposal.md',
    executiveSummary:
      'Architects a secure, quarantined staging pipeline for student and Class Rep PDF uploads. Implements 3 storage zones (Staging Raw -> Staging Processed -> Production Materials), automated Ghostscript/pdf-lib compression, Gemini OCR for scanned notes, and seamless handoff into the AI Study Path generator.',
    problemStatement: [
      {
        painPoint: 'Closed Content Library',
        impact:
          'Team must source every handout; students cannot contribute valuable lecture notes, summaries, or past questions.',
      },
      {
        painPoint: 'Unvetted Content & Security Risks',
        impact:
          'Allowing unvetted uploads directly into the library could spread inaccurate notes, break paths, or upload 100MB uncompressed scans.',
      },
      {
        painPoint: 'Mobile Bandwidth Inflation',
        impact:
          'Uncompressed PDFs inflate download times and mobile data costs for Nigerian students in university hostels.',
      },
    ],
    proposedSolution:
      'Quarantined staging pipeline: uploads go to staging/{userId}/{uploadId}/, trigger Cloud Function compression (Ghostscript) + OCR check, move to staging_processed, and promote to production upon approval.',
    strategicAdvantages: [
      {
        title: '70%+ Storage & Bandwidth Reduction',
        description:
          'Ghostscript / pdf-lib compression optimizes large scans from ~45MB down to ~5MB.',
      },
      {
        title: 'Smart OCR Cost Optimization',
        description:
          'PyMuPDF text-layer check skips Gemini OCR for text PDFs, cutting OCR cloud costs by 50%.',
      },
      {
        title: 'Quarantined Security & Safe Harbor',
        description:
          'Strict Firebase Storage rules prevent public access to unapproved staging files.',
      },
    ],
    recommendedTierOrApproach: {
      name: '3-Zone Quarantined Staging + Ghostscript Compression',
      rationale:
        'Guarantees storage safety, small file sizes for hostel downloads, and automated OCR handoff.',
      estimatedCost: '~$5-8/mo for 100 uploads; ~$20-35/mo for 500 uploads',
      roi: 'Scales content catalog 10x while maintaining pristine library quality',
    },
    keyRisks: [
      {
        risk: 'Storage cost growth over time',
        likelihood: 'Low',
        impact: 'Medium',
        mitigation:
          'Auto-delete unapproved staging files after 30 days; 5 uploads/day per user cap.',
      },
      {
        risk: 'OCR failures on handwritten notes',
        likelihood: 'Medium',
        impact: 'Medium',
        mitigation:
          'Gemini Flash OCR fallback with manual metadata editing in admin review.',
      },
    ],
    phases: [
      {
        phaseNumber: 1,
        title: 'Upload UI & Basic Staging',
        duration: 'Weeks 1-2',
        deliverable: 'Users can upload PDFs, admin reviews in-app, materials appear in Community tab.',
        tasks: [
          'Deploy Firebase Storage rules for staging/{userId}/*',
          'Build Upload Screen with Course/Level selector in Flutter',
          'Create pending_uploads Firestore tracking collection',
          'Build In-App Admin Review Screen',
        ],
      },
      {
        phaseNumber: 2,
        title: 'Processing Pipeline: Compression + OCR',
        duration: 'Weeks 3-4',
        deliverable: 'Uploads are automatically compressed and OCR-processed before review.',
        tasks: [
          'Ghostscript/pdf-lib Cloud Function compression',
          'PyMuPDF text-layer detection and Gemini OCR fallback',
          'Duplicate detection via SHA-256 file hash matching',
        ],
      },
      {
        phaseNumber: 3,
        title: 'AI Study Path Integration',
        duration: 'Week 5',
        deliverable: 'Approved uploads automatically trigger AI study path and quiz generation.',
        tasks: [
          'Trigger AI study path Cloud Function on material approval',
          'Past question to quiz question converter',
        ],
      },
      {
        phaseNumber: 4,
        title: 'Community Features & Promotion (Post-MVP)',
        duration: 'Weeks 6-7',
        deliverable: 'Star rating, student flagging, and community leaderboard.',
        tasks: [
          'Community star rating UI and Firestore subcollection',
          'Student content flagging queue',
          'Top contributor leaderboard and academic badges',
        ],
      },
    ],
    actionItems: [
      'Deploy Firebase Storage staging rules (allow write to staging/{uid}/*)',
      'Build Cloud Function Ghostscript compression & OCR pipeline',
      'Connect approved UGC to AI Study Path generation pipeline',
    ],
    linkedWorkItemIds: ['item-17', 'item-18'],
    linkedDecisionIds: ['dec-5'],
  },
]

export const initialWorkItems: WorkItem[] = [
  // ==========================================
  // P0 CRITICAL BUGS & ACTIVE FLUTTER STABILIZATION
  // ==========================================
  {
    id: 'item-1',
    itemNumber: 'BUG-001',
    title: 'Broken Starter Unit Test crashes `flutter test` CI',
    type: 'bug',
    status: 'done',
    priority: 'critical',
    productId: 'ace-acad',
    productAreaId: 'area-auth',
    assignee: 'abdulaziz',
    codeReference: 'test/widget_test.dart:14-29',
    description:
      'The boilerplate widget test pumps `const MyApp()` without initializing Firebase or Riverpod ProviderScope, immediately failing CI pipelines. Replaced with isolated AppTheme and widget smoke test.',
    bugMetadata: {
      reproductionSteps: 'Run `flutter test` from repo root.',
      expectedBehavior: 'All unit/widget tests pass cleanly.',
      actualBehavior: 'Throws Unhandled Exception on Firebase initialization in test environment.',
      severity: 'critical',
      environment: 'Flutter 3.x / GitHub Actions CI',
    },
    createdAt: '2026-08-17T08:00:00Z',
    updatedAt: '2026-08-19T10:25:00Z',
  },
  {
    id: 'item-2',
    itemNumber: 'BUG-002',
    title: 'Undownloaded Topic navigates to legacy DownloadManagerScreen',
    type: 'bug',
    status: 'done',
    priority: 'critical',
    productId: 'ace-acad',
    productAreaId: 'area-study-path',
    assignee: 'abdulaziz',
    codeReference: 'lib/features/library/presentation/screens/study_path_screen.dart:268-272',
    description:
      'When tapping an undownloaded topic in the syllabus path, show an in-line contextual download confirmation dialog before taking action.',
    bugMetadata: {
      reproductionSteps: 'Open any enrolled course study path with un-downloaded PDFs and tap on Topic 1.',
      expectedBehavior: 'Modal bottom sheet pops asking to download the required chapter PDF.',
      actualBehavior: 'Hard navigates away to DownloadManagerScreen.',
      severity: 'critical',
      environment: 'Android / iOS',
    },
    createdAt: '2026-08-17T08:05:00Z',
    updatedAt: '2026-08-19T10:25:00Z',
  },
  {
    id: 'item-3',
    itemNumber: 'BUG-003',
    title: 'Firestore `.update()` exception on new course enrollment progress',
    type: 'bug',
    status: 'done',
    priority: 'critical',
    productId: 'ace-acad',
    productAreaId: 'area-study-path',
    assignee: 'abdulaziz',
    codeReference: 'lib/features/library/presentation/screens/study_path_screen.dart:139-148',
    description:
      'Attempting to `.update({\'lastStudiedAt\': ...})` throws `NOT_FOUND` on brand new user enrollments where the progress document does not yet exist. Fixed with `.set(..., SetOptions(merge: true))`.',
    createdAt: '2026-08-17T08:10:00Z',
    updatedAt: '2026-08-19T10:25:00Z',
  },
  {
    id: 'item-4',
    itemNumber: 'BUG-004',
    title: 'Active Course cards in Dashboard missing `onTap` callback',
    type: 'bug',
    status: 'done',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-library',
    assignee: 'abdulaziz',
    codeReference: 'lib/features/dashboard/presentation/widgets/active_courses_list.dart:113-197',
    description:
      'Tapping an active course in the Home Dashboard now opens `StudyPathScreen` via responsive `InkWell` press interaction.',
    createdAt: '2026-08-17T08:15:00Z',
    updatedAt: '2026-08-19T10:25:00Z',
  },
  {
    id: 'item-5',
    itemNumber: 'BUG-005',
    title: 'Firestore `whereIn` limit crash on quizzes with > 30 questions',
    type: 'bug',
    status: 'done',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-quiz',
    assignee: 'abdulaziz',
    codeReference: 'lib/features/quiz/presentation/screens/quiz_screen.dart:50-53',
    description:
      'Firestore SDK restricts `whereIn` queries to 30 items maximum. Fixed by chunking question IDs into sub-batches of 30 and combining query snapshots.',
    createdAt: '2026-08-17T08:20:00Z',
    updatedAt: '2026-08-19T10:25:00Z',
  },
  {
    id: 'item-6',
    itemNumber: 'DEBT-001',
    title: 'Protect `serviceAccountKey.json` and `*.pem` in `.gitignore`',
    type: 'tech_debt',
    status: 'done',
    priority: 'critical',
    productId: 'ace-acad',
    productAreaId: 'area-auth',
    assignee: 'abdulaziz',
    codeReference: 'ace_acad_mobile/.gitignore',
    description:
      'Firebase Admin SDK private service keys and Android keystore release certificates are explicitly ignored in `.gitignore` to prevent credential exposure.',
    createdAt: '2026-08-17T08:25:00Z',
    updatedAt: '2026-08-19T10:25:00Z',
  },
  {
    id: 'item-7',
    itemNumber: 'DEBT-002',
    title: 'Remove orphaned `home_screen.dart` and accidental IDE import folder',
    type: 'tech_debt',
    status: 'done',
    priority: 'medium',
    productId: 'ace-acad',
    productAreaId: 'area-library',
    assignee: 'abdulaziz',
    codeReference: 'lib/features/library/presentation/screens/package.cloud_firestore/cloud_firestore.dart',
    description:
      'Deleted accidental IDE import directory `package.cloud_firestore`.',
    createdAt: '2026-08-17T08:30:00Z',
    updatedAt: '2026-08-19T10:25:00Z',
  },

  // ==========================================
  // NOTION MASTER TASKS DATABASE IMPORT (Ace Acad MVP)
  // ==========================================
  {
    id: 'item-8',
    itemNumber: 'FEAT-001',
    title: 'Ingest and verify all 13 core 100L courses in Firestore',
    type: 'feature',
    status: 'in_progress',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-library',
    assignee: 'abdulaziz',
    codeReference: 'scripts/all_new_courses.json',
    description:
      '13 foundational ABU Zaria courses (MATH 101, CHEM 101, PHYS 101, GENS 101, BIO 101, COSC 101, etc.) must be ingested into Firestore with valid PDF storage pointers and module topic boundaries.',
    subtasks: [
      { id: 'st-1', title: 'Verify MATH 101 & MATH 102 JSONs', completed: true },
      { id: 'st-2', title: 'Verify CHEM 101 & CHEM 111 JSONs', completed: true },
      { id: 'st-3', title: 'Ingest PHYS 101, PHYS 102, GENS 101', completed: false },
      { id: 'st-4', title: 'Ingest BIO 101, COSC 101, STAT 101', completed: false },
    ],
    createdAt: '2026-08-17T08:35:00Z',
    updatedAt: '2026-08-17T08:35:00Z',
  },
  {
    id: 'item-9',
    itemNumber: 'FEAT-002',
    title: '5.0 CGPA Scenario Calculator (Post-MVP)',
    type: 'feature',
    status: 'backlog',
    priority: 'medium',
    productId: 'ace-acad',
    productAreaId: 'area-postmvp',
    assignee: 'abdulaziz',
    description:
      'SRS Section 3.7 Module: Interactive GPA calculator using standard Nigerian 5.0 scale with credit unit weighting and target class-of-degree scenario planning.',
    createdAt: '2026-08-17T08:40:00Z',
    updatedAt: '2026-08-17T08:40:00Z',
  },
  {
    id: 'item-10',
    itemNumber: 'FEAT-003',
    title: 'Weekly Study Timetable Builder (Post-MVP)',
    type: 'feature',
    status: 'backlog',
    priority: 'medium',
    productId: 'ace-acad',
    productAreaId: 'area-postmvp',
    assignee: 'abdulaziz',
    description:
      'SRS Section 3.8 Module: Visual weekly calendar (Mon-Sun) allowing students to block class times and generate automated study sessions.',
    createdAt: '2026-08-17T08:40:00Z',
    updatedAt: '2026-08-17T08:40:00Z',
  },
  {
    id: 'item-11',
    itemNumber: 'COMP-001',
    title: 'File NDPC DCMI Data Controller Registration upon 200+ ABU Students',
    type: 'task',
    status: 'backlog',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-auth',
    assignee: 'ibrahim',
    description:
      'Under NDPA 2023 Section 65 and NDPC Guidance Notice, crossing 200 registered students in Nigeria requires filing formal DCMI registration within 6 months.',
    createdAt: '2026-08-17T08:40:00Z',
    updatedAt: '2026-08-17T08:40:00Z',
  },
  {
    id: 'item-12',
    itemNumber: 'TASK-101',
    title: 'Review Pilot Monetization Strategy with CEO',
    type: 'task',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-auth',
    assignee: 'ibrahim',
    description:
      'Align on post-pilot subscription tiers (term pass vs annual license) and select payment gateway (Paystack / Flutterwave) for Nigerian university market.',
    createdAt: '2026-08-17T08:40:00Z',
    updatedAt: '2026-08-17T08:40:00Z',
  },
  {
    id: 'item-13',
    itemNumber: 'FEAT-004',
    title: 'Wireframe Class Rep Cohort Onboarding & Dropdown Routing',
    type: 'feature',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-ugc',
    assignee: 'abdulaziz',
    codeReference: 'proposals/Product Strategy Memo_ Cohort-Based UGC & The _Class Rep_ Model.md',
    description:
      'From PROP-001 / Notion: Implement granular demographic onboarding routing (University > Faculty > Department > Admission Year/Level) so students are automatically attached to their departmental cohort workspace.',
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-18T16:00:00Z',
  },
  {
    id: 'item-14',
    itemNumber: 'TASK-102',
    title: 'Draft Bridge Program Campus Ambassador Playbook & Pitch Deck',
    type: 'task',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-ugc',
    assignee: 'ibrahim',
    codeReference: 'proposals/Product Strategy Memo_ Cohort-Based UGC & The _Class Rep_ Model.md',
    description:
      'From PROP-001 / Notion: Formalize the University General Manager role for Bridge Program contacts and write the pitch/onboarding script for recruiting departmental Class Reps.',
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-18T16:00:00Z',
  },
  {
    id: 'item-15',
    itemNumber: 'FEAT-005',
    title: 'Build Cloud Function PDF Text Extraction with PyMuPDF & Gemini Flash',
    type: 'feature',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-ai-pipeline',
    assignee: 'abdulaziz',
    dueDate: '2026-04-05',
    codeReference: 'proposals/AI Study & Study Paths Revamp — Proposal.md',
    description:
      'From Notion ("Backend implementation of AI Study logic"): Deploy Cloud Function pipeline using Gemini 2.0 Flash to extract topic boundaries, summaries, and 5 quiz questions per topic at ~$0.02 per course.',
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-18T16:00:00Z',
  },
  {
    id: 'item-16',
    itemNumber: 'FEAT-006',
    title: 'Implement SM-2 Spaced Repetition Engine in Flutter/Dart Local DB',
    type: 'feature',
    status: 'backlog',
    priority: 'medium',
    productId: 'ace-acad',
    productAreaId: 'area-ai-pipeline',
    assignee: 'abdulaziz',
    codeReference: 'lib/core/database/local_database.dart',
    description:
      'From PROP-002 Phase 2: Implement SuperMemo-2 (SM-2) algorithm in Drift SQLite to track topic ease factors, repetition intervals, and schedule review knowledge checks without internet connectivity.',
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-18T16:00:00Z',
  },
  {
    id: 'item-17',
    itemNumber: 'FEAT-007',
    title: 'Deploy Firebase Storage 3-Zone Rules & Staging Quarantine',
    type: 'feature',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-ugc',
    assignee: 'abdulaziz',
    dueDate: '2026-03-27',
    codeReference: 'storage.rules',
    description:
      'From Notion ("Setup storage integration for uploaded docs"): Configure Firebase Storage rules for staging/{userId}/{uploadId}/ with 30-day quarantine retention, 5-upload daily caps, and production separation.',
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-18T16:00:00Z',
  },
  {
    id: 'item-18',
    itemNumber: 'COMP-002',
    title: 'Draft UGC Safe Harbor Terms of Service & User Flagging Mechanism',
    type: 'task',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-ugc',
    assignee: 'ibrahim',
    codeReference: 'proposals/User-Generated Content Upload System — Proposal.md',
    description:
      'From PROP-001 & PROP-003: Draft platform terms of service explicitly framing Ace Acad as a content hosting intermediary (Google Drive model) with copyright reporting and takedown procedures.',
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-18T16:00:00Z',
  },
  {
    id: 'item-19',
    itemNumber: 'FEAT-008',
    title: 'Wireframe/Design UI for Revamped Study Paths & AI Engine',
    type: 'feature',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-ai-pipeline',
    assignee: 'abdulaziz',
    dueDate: '2026-03-27',
    description:
      'From Notion Master Tasks: Design intuitive mobile screens for AI-generated study paths, module topic bounds, and adaptive review cards.',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'item-20',
    itemNumber: 'TASK-103',
    title: 'Scope and Document Tier 2 AI Study & Study Paths Architecture',
    type: 'task',
    status: 'done',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-ai-pipeline',
    assignee: 'abdulaziz',
    dueDate: '2026-03-22',
    codeReference: 'proposals/AI Study & Study Paths Revamp — Proposal.md',
    description:
      'From Notion Master Tasks: Comprehensive technical architecture comparing Tier 1 (rule-based), Tier 2 (hybrid batch AI), and Tier 3 (runtime LLM).',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-22T18:00:00Z',
  },
  {
    id: 'item-21',
    itemNumber: 'FEAT-009',
    title: 'Update Empty State Text to "Coming Soon" in Course Library',
    type: 'feature',
    status: 'done',
    priority: 'low',
    productId: 'ace-acad',
    productAreaId: 'area-library',
    assignee: 'abdulaziz',
    dueDate: '2026-03-14',
    codeReference: 'lib/features/library/presentation/screens/course_catalog_screen.dart',
    description:
      'From Notion Master Tasks: Replace harsh "no courses available" text with a polished "Coming Soon for Your Department" empty state card.',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-14T14:00:00Z',
  },
  {
    id: 'item-22',
    itemNumber: 'FEAT-010',
    title: 'Build Frontend UI for User Document Upload Screen',
    type: 'feature',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-ugc',
    assignee: 'abdulaziz',
    dueDate: '2026-03-21',
    description:
      'From Notion Master Tasks: Contributor document upload interface in Flutter with file picker, PDF page count validator, and departmental tagging.',
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'item-23',
    itemNumber: 'FEAT-011',
    title: 'Build Ghostscript Compression & Gemini Flash OCR Cloud Pipeline',
    type: 'feature',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-ugc',
    assignee: 'abdulaziz',
    dueDate: '2026-04-03',
    codeReference: 'proposals/User-Generated Content Upload System — Proposal.md',
    description:
      'From Notion Master Tasks: Automated Cloud Function pipeline compressing 45MB scans to ~5MB with PyMuPDF text checks and Gemini Flash OCR fallback.',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'item-24',
    itemNumber: 'BUG-006',
    title: 'Investigate and Fix Broken "Weekly Rhythm" Study Logic',
    type: 'bug',
    status: 'done',
    priority: 'medium',
    productId: 'ace-acad',
    productAreaId: 'area-study-path',
    assignee: 'abdulaziz',
    dueDate: '2026-03-17',
    description:
      'From Notion Master Tasks: Resolved weekly rhythm calculation date offset in study streak computation.',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-17T16:00:00Z',
  },
  {
    id: 'item-25',
    itemNumber: 'COMP-003',
    title: 'Draft and Finalize Ace Acad App Privacy Policy (NDPA 2023 Compliant)',
    type: 'task',
    status: 'done',
    priority: 'critical',
    productId: 'ace-acad',
    productAreaId: 'area-auth',
    assignee: 'ibrahim',
    dueDate: '2026-03-17',
    codeReference: 'Privacy policy for ace acad.md',
    description:
      'From Notion Master Tasks: Published comprehensive NDPA 2023 privacy policy with data subject rights, consent versioning, and DCO contact info.',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-17T12:00:00Z',
  },
  {
    id: 'item-26',
    itemNumber: 'COMP-004',
    title: 'Draft and Finalize Terms of Service (ToS) with FCCPA Protections',
    type: 'task',
    status: 'done',
    priority: 'critical',
    productId: 'ace-acad',
    productAreaId: 'area-auth',
    assignee: 'ibrahim',
    dueDate: '2026-03-17',
    codeReference: 'src/app/products/ace-acad/terms/page.tsx',
    description:
      'From Notion Master Tasks: Comprehensive terms of service covering license terms, acceptable use, and educational disclaimer.',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-17T12:00:00Z',
  },
  {
    id: 'item-27',
    itemNumber: 'TASK-104',
    title: 'Upload Ace Acad App Bundle (.aab) to Play Store Console Internal Track',
    type: 'task',
    status: 'done',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-auth',
    assignee: 'ibrahim',
    dueDate: '2026-03-24',
    description:
      'From Notion Master Tasks: Successfully uploaded signed release App Bundle to Google Play Console for internal testing.',
    createdAt: '2026-03-18T10:00:00Z',
    updatedAt: '2026-03-24T15:00:00Z',
  },
  {
    id: 'item-28',
    itemNumber: 'TASK-105',
    title: 'Complete Google Play Developer Account Verification with CAC Certificate',
    type: 'task',
    status: 'done',
    priority: 'critical',
    productId: 'wstar-core',
    productAreaId: 'area-wstar-ops',
    assignee: 'ibrahim',
    dueDate: '2026-03-19',
    description:
      'From Notion Master Tasks: Verified Google Play corporate developer identity with Nigerian Corporate Affairs Commission (CAC) business documentation.',
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-03-19T14:00:00Z',
  },
  {
    id: 'item-29',
    itemNumber: 'TASK-106',
    title: 'Create Ace Acad Launch Marketing Plan & Campus Social Media Assets',
    type: 'task',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-auth',
    assignee: 'ibrahim',
    dueDate: '2026-03-27',
    description:
      'From Notion Master Tasks: Produce WhatsApp student broadcast flyers, Instagram launch carousels, and campus ambassador marketing kit.',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'item-30',
    itemNumber: 'FEAT-013',
    title: 'Setup Firebase Analytics Screen Telemetry & User Demographic Tagging',
    type: 'feature',
    status: 'in_progress',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-analytics',
    assignee: 'abdulaziz',
    dueDate: '2026-03-15',
    codeReference: 'lib/core/services/analytics_service.dart',
    description:
      'From Notion Master Tasks ("Setup User Tracking"): Event logging for study sessions, quiz submissions, and demographic properties (Faculty, Department, Level).',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-15T11:00:00Z',
  },
  {
    id: 'item-31',
    itemNumber: 'TASK-110',
    title: 'Scope User Upload Staging Pipeline, Compression & Quarantine Rules',
    type: 'task',
    status: 'done',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-ugc',
    assignee: 'abdulaziz',
    dueDate: '2026-03-15',
    codeReference: 'proposals/User-Generated Content Upload System — Proposal.md',
    description:
      'From Notion Master Tasks ("Scope user uploads"): Detailed technical specification covering 3-zone Firebase storage, Ghostscript compression, and Gemini OCR.',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-15T17:00:00Z',
  },
  {
    id: 'item-32',
    itemNumber: 'FEAT-014',
    title: 'Add Timed Semester Mock Exam Simulation Mode',
    type: 'feature',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-quiz',
    assignee: 'abdulaziz',
    dueDate: '2026-08-13',
    description:
      'From Notion Master Tasks: Timed exam simulation with customizable question count, countdown clock, and instantaneous grading analysis.',
    createdAt: '2026-08-13T09:00:00Z',
    updatedAt: '2026-08-13T09:00:00Z',
  },
  {
    id: 'item-33',
    itemNumber: 'BUG-007',
    title: 'Expand Flashcard Question Bank & Fix Flip State Persistence',
    type: 'bug',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-quiz',
    assignee: 'abdulaziz',
    dueDate: '2026-08-13',
    description:
      'From Notion Master Tasks: Populate foundational flashcard decks for 100L courses and ensure card flip animations do not desynchronize during quick swipe.',
    createdAt: '2026-08-13T09:15:00Z',
    updatedAt: '2026-08-13T09:15:00Z',
  },
  {
    id: 'item-34',
    itemNumber: 'FEAT-015',
    title: 'Ingest 10-Year ABU Past Examination Question Papers (PQs) into Library',
    type: 'feature',
    status: 'todo',
    priority: 'high',
    productId: 'ace-acad',
    productAreaId: 'area-library',
    assignee: 'abdulaziz',
    dueDate: '2026-08-14',
    description:
      'From Notion Master Tasks ("Use PQs and Add them to the app"): Collect, clean, and attach past examination papers with solution annotations to course modules.',
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-14T10:00:00Z',
  },
  {
    id: 'item-35',
    itemNumber: 'FEAT-016',
    title: 'Update Marketing Website to Feature Enterprise AI Engineering & Solutions',
    type: 'feature',
    status: 'in_progress',
    priority: 'high',
    productId: 'wstar-core',
    productAreaId: 'area-wstar-web',
    assignee: 'abdulaziz',
    dueDate: '2026-08-18',
    codeReference: 'src/app/page.tsx',
    description:
      'From Notion Master Tasks: Update wstartech.ng landing page to showcase WSTAR technology solutions, institutional metrics, and leadership.',
    createdAt: '2026-08-18T08:00:00Z',
    updatedAt: '2026-08-18T16:00:00Z',
  },

  // ==========================================
  // NOTION MASTER TASKS DATABASE IMPORT (PlantIQ MVP & WSTAR Operations)
  // ==========================================
  {
    id: 'item-36',
    itemNumber: 'TASK-107',
    title: 'Review and Execute WSTAR Founders Agreement & Equity Vesting Schedule',
    type: 'task',
    status: 'in_progress',
    priority: 'critical',
    productId: 'wstar-core',
    productAreaId: 'area-wstar-ops',
    assignee: 'ibrahim',
    dueDate: '2026-03-20',
    description:
      'From Notion Master Tasks (Operations): Finalize and sign co-founders equity vesting agreement, IP assignment terms, and company governance bylaws.',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-20T11:00:00Z',
  },
  {
    id: 'item-37',
    itemNumber: 'TASK-108',
    title: 'Build PlantIQ AgriTech Pitch Deck & Executive Summary for Investors',
    type: 'task',
    status: 'done',
    priority: 'high',
    productId: 'plantiq',
    productAreaId: 'area-plantiq-core',
    assignee: 'ibrahim',
    dueDate: '2026-03-26',
    description:
      'From Notion Master Tasks (PlantIQ MVP): 12-slide pitch deck highlighting Northern Nigerian agricultural pathology challenge, IoT diagnostic suite, and market sizing.',
    createdAt: '2026-03-18T10:00:00Z',
    updatedAt: '2026-03-26T17:00:00Z',
  },
  {
    id: 'item-38',
    itemNumber: 'FEAT-012',
    title: 'Draft IoT Sensor Architecture & UX Wireframes for PlantIQ V2',
    type: 'feature',
    status: 'todo',
    priority: 'medium',
    productId: 'plantiq',
    productAreaId: 'area-plantiq-core',
    assignee: 'ibrahim',
    dueDate: '2026-04-02',
    description:
      'From Notion Master Tasks (PlantIQ MVP): System architecture connecting field soil moisture/pathogen sensors to cloud diagnostic inference API.',
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'item-39',
    itemNumber: 'TASK-109',
    title: 'Compile Target List of AgriTech Grants, Accelerators & African Seed Funds',
    type: 'task',
    status: 'in_progress',
    priority: 'high',
    productId: 'plantiq',
    productAreaId: 'area-plantiq-core',
    assignee: 'ibrahim',
    dueDate: '2026-03-30',
    description:
      'From Notion Master Tasks (PlantIQ MVP): Comprehensive list of agricultural innovation grant programs (USAID, Gates AgOne, Tony Elumelu, Google for Startups Africa).',
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-30T14:00:00Z',
  },
  {
    id: 'item-40',
    itemNumber: 'TASK-111',
    title: 'Ingest Agronomy Crop Dataset & Pathology Guidelines (crop_data.xlsx)',
    type: 'task',
    status: 'done',
    priority: 'medium',
    productId: 'plantiq',
    productAreaId: 'area-plantiq-core',
    assignee: 'ibrahim',
    dueDate: '2026-04-30',
    description:
      'From Notion Master Tasks (PlantIQ MVP by Moses Mshelia): Processed crop_data.xlsx, plant_guideline.docx, and watering_guideline.docx into diagnostic training bank.',
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-04-30T16:00:00Z',
  },
]

export const initialDecisions: Decision[] = [
  {
    id: 'dec-1',
    decisionNumber: 'DEC-001',
    title: 'Use "Wizard of Oz" Curated Study Paths over Live ML Models for MVP',
    decision:
      'Study sequences, reading topic page bounds, and quiz banks are pre-curated manually by the editorial team for initial 100L launch.',
    reason:
      'Guarantees 100% academic factual accuracy for ABU 100L curriculum, eliminates recurring per-token cloud API costs, and enables full offline operation in low-bandwidth university environments.',
    status: 'accepted',
    participants: ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
    date: '2025-08-05',
    productId: 'ace-acad',
    consequences:
      'Requires upfront content ingestion using scripts/extract_pdf.py before each course launch until PROP-002 Tier 2 AI is deployed.',
  },
  {
    id: 'dec-2',
    decisionNumber: 'DEC-002',
    title: 'Target 100L ABU Zaria Freshmen Exclusively for Initial MVP Cohort',
    decision:
      'Scope the initial mobile release strictly to 100-level students at Ahmadu Bello University across ~13 core science and general courses.',
    reason:
      'Provides a tightly focused, homogenous cohort with identical curriculum challenges (overcrowded lecture theatres, WhatsApp PDF chaos), enabling rapid iteration and feedback collection.',
    status: 'accepted',
    participants: ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
    date: '2025-08-05',
    productId: 'ace-acad',
    consequences:
      'Higher level courses (200L–500L) and other institutions are sequenced in the post-MVP roadmap.',
  },
  {
    id: 'dec-3',
    decisionNumber: 'DEC-003',
    title: 'Free Pilot Launch Prior to Payment Gateway Integration',
    decision:
      'Launch the initial Android APK distribution as a completely free pilot with zero payment SDKs in the codebase.',
    reason:
      'Reduces onboarding friction, maximizes student adoption, and ensures strict FCCPA/NDPA compliance before processing financial transactions.',
    status: 'accepted',
    participants: ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
    date: '2026-08-17',
    productId: 'ace-acad',
    consequences:
      'Monetization will be phased in post-pilot following user retention analysis.',
  },
  {
    id: 'dec-4',
    decisionNumber: 'DEC-004',
    title: 'Use Sanity CMS for Structured WSTAR Operating System Data',
    decision:
      'Use standalone Sanity Studio (`studio-wstar`) connected to project `qx20j59l` as the authoritative structured content layer for WSTAR OS, bridged to Next.js with local optimistic caching.',
    reason:
      'Enables clean schema modeling, live preview, multi-user collaboration, and portable data architecture without rebuilding custom database admin dashboards.',
    status: 'accepted',
    participants: ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
    date: '2026-08-17',
    consequences:
      'Next.js OS views consume structured Sanity schemas and maintain local browser fallback during offline sessions.',
  },
  {
    id: 'dec-5',
    decisionNumber: 'DEC-005',
    title: 'Adopt Cohort-Based "Class Rep" Model for UGC & Legal Safe Harbor',
    decision:
      'Pivot from centralized admin curation to isolated departmental class drives where designated Class Reps upload materials, establishing Ace Acad as a content host (Google Drive model) rather than publisher.',
    reason:
      'Eliminates the scaling bottleneck of manually sourcing 100+ university departments, insulates WSTAR from direct copyright infringement liability, and enables organic grassroots adoption via Bridge Program campus ambassadors.',
    status: 'accepted',
    participants: ['Ibrahim Abdulwahab', 'Abdulaziz Abdulwahab'],
    date: '2026-08-18',
    productId: 'ace-acad',
    consequences:
      'Requires updating onboarding with Uni > Dept > Level demographic routing and implementing 3-zone Firebase Storage quarantine rules.',
    alternativesConsidered: [
      'Centralized manual editorial curation (rejected: unscalable beyond ~13 courses)',
      'Open unvetted public uploads (rejected: copyright risk and spam pollution)',
    ],
  },
  {
    id: 'dec-6',
    decisionNumber: 'DEC-006',
    title: 'Select Tier 2 Hybrid AI (Gemini 2.0 Flash Batch + Local SM-2) for Study Paths',
    decision:
      'Adopt Tier 2 Hybrid AI architecture for automated study path and quiz generation, utilizing Gemini 2.0 Flash for one-time batch ingestion ($0.02/course) and client-side SM-2 spaced repetition for offline runtime adaptivity.',
    reason:
      'Reduces course setup time from 5 hours to 30 minutes, avoids expensive recurring per-token runtime LLM billing, and preserves 100% offline study functionality for university hostels.',
    status: 'accepted',
    participants: ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
    date: '2026-08-18',
    productId: 'ace-acad',
    consequences:
      'Deploys Cloud Function extraction pipeline with PyMuPDF text checks and builds in-app admin review dashboard.',
    alternativesConsidered: [
      'Tier 1 Rule-based with manual ToC entry (rejected: still too slow)',
      'Tier 3 Full Runtime LLM Chatbot (rejected: costly recurring API bills and breaks offline mode)',
    ],
  },
]

export const initialFeedback: FeedbackItem[] = [
  {
    id: 'fdbk-1',
    subject: 'CHEM 101 Module 2 quiz answer explanation clarification',
    type: 'Bug Report',
    description:
      'Question 4 on atomic orbital transitions marks Option B as correct but the explanation cites page 14 where Option C is described. Please review.',
    userId: 'user_abu_chem101_student',
    timestamp: '2026-08-16T14:32:00Z',
    status: 'new',
  },
  {
    id: 'fdbk-2',
    subject: 'Add dark mode toggle on the study session reader',
    type: 'Feature Request',
    description:
      'The app theme switches to dark mode nicely, but when reading PDFs at night in the hostel, a high-contrast inverted PDF mode would save battery and reduce eye strain.',
    userId: 'user_abu_physics_100l',
    timestamp: '2026-08-15T21:10:00Z',
    status: 'triaged',
  },
  {
    id: 'fdbk-3',
    subject: 'Love the step-by-step study paths!',
    type: 'Praise',
    description:
      'This helped me prepare for my MATH101 continuous assessment so much better than reading endless 200-page handouts. Thank you WSTAR!',
    userId: 'user_abu_math101_scholar',
    timestamp: '2026-08-14T11:05:00Z',
    status: 'triaged',
  },
]

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Ace Acad 100L MVP Stabilization & ABU Launch',
    summary:
      'Complete remaining P0 bugs, finalize 13 course ingestions, and distribute initial Android APK to ABU freshmen cohort.',
    productId: 'ace-acad',
    status: 'active',
    targetDate: '2026-09-01',
    lead: 'Abdulaziz',
    progress: 85,
    milestones: [
      { id: 'm-1', projectId: 'proj-1', title: 'Fix P0 CI unit test & navigation bugs', dueDate: '2026-08-20', completed: false },
      { id: 'm-2', projectId: 'proj-1', title: 'Ingest all 13 launch course JSONs & PQs', dueDate: '2026-08-25', completed: false },
      { id: 'm-3', projectId: 'proj-1', title: 'Upload Signed Release App Bundle to Google Play Console', dueDate: '2026-09-01', completed: true },
    ],
  },
  {
    id: 'proj-2',
    name: 'Legal, Compliance & NDPA Governance Hub',
    summary:
      'Maintain full statutory compliance under NDPA 2023, FCCPA 2018, and prepare NDPC DCMI filing.',
    productId: 'ace-acad',
    status: 'active',
    targetDate: '2026-09-15',
    lead: 'Ibrahim',
    progress: 95,
    milestones: [
      { id: 'm-4', projectId: 'proj-2', title: 'Publish versioned Terms & Privacy on web', dueDate: '2026-08-17', completed: true },
      { id: 'm-5', projectId: 'proj-2', title: 'Self-service account deletion & export', dueDate: '2026-08-17', completed: true },
      { id: 'm-6', projectId: 'proj-2', title: 'NDPC DCMI registration upon 200 users', dueDate: '2026-10-01', completed: false },
    ],
  },
  {
    id: 'proj-3',
    name: 'UGC Staging & Class Rep Expansion Engine',
    summary:
      'Implement demographic cohort onboarding, Class Rep upload dashboard, Ghostscript compression, and Safe Harbor terms.',
    productId: 'ace-acad',
    status: 'planned',
    targetDate: '2026-10-15',
    lead: 'Abdulaziz & Ibrahim',
    progress: 25,
    milestones: [
      { id: 'm-7', projectId: 'proj-3', title: 'Deploy Firebase Storage 3-zone staging rules', dueDate: '2026-09-15', completed: false },
      { id: 'm-8', projectId: 'proj-3', title: 'Build Class Rep upload & compression Cloud Function', dueDate: '2026-10-01', completed: false },
      { id: 'm-9', projectId: 'proj-3', title: 'Launch Bridge Program Campus Ambassador recruitment', dueDate: '2026-10-15', completed: false },
    ],
  },
  {
    id: 'proj-4',
    name: 'PlantIQ MVP & Agricultural Diagnostics',
    summary:
      'Precision agronomy IoT diagnostics, crop dataset ingestion, grant fundraising, and investor pitch deck.',
    productId: 'plantiq',
    status: 'active',
    targetDate: '2026-10-30',
    lead: 'Ibrahim',
    progress: 55,
    milestones: [
      { id: 'm-10', projectId: 'proj-4', title: 'Ingest agronomy crop dataset & pathology guidelines', dueDate: '2026-04-30', completed: true },
      { id: 'm-11', projectId: 'proj-4', title: 'Build PlantIQ investor pitch deck', dueDate: '2026-03-26', completed: true },
      { id: 'm-12', projectId: 'proj-4', title: 'Compile target grant & accelerator list', dueDate: '2026-03-30', completed: false },
      { id: 'm-13', projectId: 'proj-4', title: 'Draft IoT sensor architecture wireframes for V2', dueDate: '2026-10-30', completed: false },
    ],
  },
  {
    id: 'proj-5',
    name: 'WSTAR Corporate Operations & Governance',
    summary:
      'Corporate entity filings, founders agreements, Google Play developer verification, and enterprise website.',
    productId: 'wstar-core',
    status: 'active',
    targetDate: '2026-09-30',
    lead: 'Ibrahim & Abdulaziz',
    progress: 88,
    milestones: [
      { id: 'm-14', projectId: 'proj-5', title: 'Complete Google Play Developer CAC verification', dueDate: '2026-03-19', completed: true },
      { id: 'm-15', projectId: 'proj-5', title: 'Review and sign Founders Agreement', dueDate: '2026-03-20', completed: false },
      { id: 'm-16', projectId: 'proj-5', title: 'Launch WSTAR OS Company Operating System', dueDate: '2026-08-18', completed: true },
    ],
  },
]

export const initialRoadmap: RoadmapItem[] = [
  {
    id: 'road-1',
    title: 'Ace Acad 100L ABU Zaria Pilot Launch',
    horizon: 'now',
    productId: 'ace-acad',
    description: 'Release MVP APK for 13 foundational courses to 100L students.',
    targetQuarter: 'Q3 2026',
    category: 'Core Launch',
  },
  {
    id: 'road-2',
    title: 'Cohort-Based UGC & Class Rep Workspaces (PROP-001)',
    horizon: 'next',
    productId: 'ace-acad',
    description: 'Decentralized class shared drives for 200L+ courses across ABU departments.',
    targetQuarter: 'Q4 2026',
    category: 'Content Scaling',
  },
  {
    id: 'road-3',
    title: 'Tier 2 Hybrid AI Ingestion & Spaced Repetition (PROP-002)',
    horizon: 'next',
    productId: 'ace-acad',
    description: 'Gemini 2.0 Flash automated syllabus ingestion and SM-2 local review scheduler.',
    targetQuarter: 'Q4 2026',
    category: 'Adaptive Learning',
  },
  {
    id: 'road-4',
    title: '5.0 CGPA Calculator & Scenario Planner',
    horizon: 'next',
    productId: 'ace-acad',
    description: 'Interactive grade forecasting and credit unit planning tool.',
    targetQuarter: 'Q4 2026',
    category: 'Academic Tools',
  },
  {
    id: 'road-5',
    title: 'Study Timetable Builder & Calendar Sync',
    horizon: 'next',
    productId: 'ace-acad',
    description: 'Weekly schedule planner with ABU calendar event push notifications.',
    targetQuarter: 'Q4 2026',
    category: 'Productivity',
  },
  {
    id: 'road-6',
    title: 'Multi-University Expansion (UNILAG, UI, OAU)',
    horizon: 'later',
    productId: 'ace-acad',
    description: 'Expand course catalog and institutional selector across federal universities.',
    targetQuarter: 'Q2 2027',
    category: 'Scale',
  },
  {
    id: 'road-7',
    title: 'PlantIQ AgriTech Pilot Deployment',
    horizon: 'later',
    productId: 'plantiq',
    description: 'Smart crop disease diagnostics with Kaduna agricultural clusters.',
    targetQuarter: 'Q2 2027',
    category: 'AgriTech',
  },
]

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    actor: 'Abdulaziz',
    action: 'imported Notion database',
    targetTitle: '25 Master Tasks & Projects Synchronized',
    targetType: 'task',
    timestamp: '2026-08-18T17:15:00Z',
    badgeColor: 'purple',
  },
  {
    id: 'act-2',
    actor: 'Ibrahim & Abdulaziz',
    action: 'approved proposal',
    targetTitle: 'PROP-001 (Cohort UGC & Class Rep Model)',
    targetType: 'proposal',
    timestamp: '2026-08-18T16:15:00Z',
    badgeColor: 'blue',
  },
  {
    id: 'act-3',
    actor: 'Abdulaziz',
    action: 'recommended tier',
    targetTitle: 'PROP-002 (Tier 2 Hybrid AI Study Paths)',
    targetType: 'proposal',
    timestamp: '2026-08-18T16:10:00Z',
    badgeColor: 'purple',
  },
  {
    id: 'act-4',
    actor: 'Abdulaziz',
    action: 'created',
    targetTitle: 'BUG-001 (Broken CI Unit Test)',
    targetType: 'bug',
    timestamp: '2026-08-17T08:42:00Z',
    badgeColor: 'red',
  },
  {
    id: 'act-5',
    actor: 'Ibrahim',
    action: 'decided',
    targetTitle: 'DEC-005 (Safe Harbor & Class Rep Hosting)',
    targetType: 'decision',
    timestamp: '2026-08-18T16:05:00Z',
    badgeColor: 'emerald',
  },
]

export const initialSources: import('@/os/types').Source[] = [
  {
    id: 'src-1',
    sourceNumber: 'SRC-001',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'Proposal: Cohort-Based UGC & The "Class Rep" Model',
    summary:
      'Decentralized course material aggregation delegating folder curation to verified departmental Class Reps across Nigerian universities (ABU Zaria, UNILAG, UI).',
    externalId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    externalUrl:
      'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Abdulaziz Abdulwahab',
    relatedProductId: 'ace-acad',
    relatedProposalIds: ['prop-1'],
    relatedDecisionIds: ['dec-5'],
    aiStatus: 'analyzed',
    aiSummary:
      'Comprehensive product strategy and technical architecture proposal pivoting Ace Acad from centralized manual document ingestion to a decentralized Class Rep cohort model. Outlines safe harbor legal shielding, Google Drive integration, and verified student contributor incentives.',
    extractedEntities: {
      summary:
        'Pivots Ace Acad content scaling from internal bottlenecks to a self-sustaining student-led upload pipeline.',
      proposedInitiative: {
        title: 'Class Rep Ambassador & Cohort Material Hub',
        description:
          'Recruit 50 foundational Class Reps across Northern and South-Western Nigerian universities to pilot semester pack curation.',
        targetQuarter: 'Q3-Q4 2026',
        selected: true,
      },
      workstreams: [
        {
          id: 'ws-tech',
          name: 'Technical Architecture & Google Drive API',
          description:
            'Class Rep Google Drive integration, automated virus scanning, and drift offline cache sync.',
          suggestedLead: 'abdulaziz',
          tasks: [
            {
              title: 'Build Google Drive Shared Folder webhooks and background metadata sync',
              type: 'task',
              priority: 'high',
              productId: 'ace-acad',
              assignee: 'abdulaziz',
              selected: true,
            },
            {
              title: 'Implement NDPA-compliant file virus scanning and PDF integrity validator',
              type: 'task',
              priority: 'high',
              productId: 'ace-acad',
              assignee: 'abdulaziz',
              selected: true,
            },
          ],
        },
        {
          id: 'ws-growth',
          name: 'Growth & Campus Ambassador Operations',
          description: 'Class Rep recruitment, compensation model, and campus rollouts.',
          suggestedLead: 'ibrahim',
          tasks: [
            {
              title: 'Draft Class Rep incentive structure (Free Premium Access + ₦15,000 semester stipend)',
              type: 'task',
              priority: 'high',
              productId: 'ace-acad',
              assignee: 'ibrahim',
              selected: true,
            },
            {
              title: 'Prepare Class Rep onboarding kit and Terms of Contribution agreement',
              type: 'task',
              priority: 'medium',
              productId: 'ace-acad',
              assignee: 'ibrahim',
              selected: true,
            },
          ],
        },
      ],
      decisions: [
        {
          title: 'Decentralized Cohort Folders vs Centralized Cloud Storage',
          decision:
            'Store large binary PDFs on Class Rep Google Drives and index references in Ace Acad rather than hosting unvetted files directly.',
          reason:
            'Provides immediate safe harbor copyright protection, zero hosting bandwidth cost, and high departmental relevance.',
          selected: true,
        },
      ],
      risks: [
        {
          risk: 'Class Rep inactivity or graduation abandoning cohort folders',
          impact: 'High',
          mitigation:
            'Establish co-rep succession pairing and automated health checks on folder activity.',
        },
        {
          risk: 'Low-quality or non-syllabus compliant past question uploads',
          impact: 'Medium',
          mitigation:
            'Community upvoting and required peer verification before materials appear in Study Paths.',
        },
      ],
      dependencies: [
        'Google Picker API & Drive File OAuth client credentials',
        'Ace Acad Flutter PDF viewer (pdfrx) remote streaming verification',
      ],
      openQuestions: [
        'Should Class Reps receive direct bank transfers or in-app wallet credits?',
        'How do we handle multi-campus variations of universal courses like MTH 101?',
      ],
      assumptions: [
        'Most Nigerian university departments have an active WhatsApp group and designated Class Rep.',
        'Students already share course PDFs via Google Drive links.',
      ],
      deadlines: ['2026-09-15: Finalize Class Rep pilot onboarding'],
      peopleAndOwners: ['Abdulaziz (Tech)', 'Ibrahim (Operations & GTM)'],
      referencedDocuments: [
        'Software Requirements Specification: Ace-Acad 2.0',
        'March 2026 UGC Staging System Architecture Spec',
      ],
      supersededProposalNotes:
        'Supersedes March 2026 Centralized Ingestion proposal which relied on full internal manual scanning.',
    },
    tags: ['Strategy', 'UGC', 'Google Drive', 'Class Rep', 'Q3-2026'],
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-19T09:00:00Z',
  },
  {
    id: 'src-2',
    sourceNumber: 'SRC-002',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'WSTAR Master Business Plan & Board Strategy 2026',
    summary:
      'Authoritative corporate strategy document outlining WSTAR mission to become Nigeria’s Tech Giant, five-year financial roadmap, revenue model across EdTech & AgriTech, and founder equity.',
    externalUrl: 'https://docs.google.com/document/d/1WSTAR_BusinessPlan_2026_ExecutiveStrategy/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Abdulaziz Abdulwahab & Ibrahim Abdulwahab',
    relatedProductId: 'wstar-core',
    aiStatus: 'analyzed',
    aiSummary:
      'High-level corporate strategic plan establishing WSTAR leadership, corporate roadmap, and commercial scaling targets across tertiary education and solar smart agriculture.',
    tags: ['Executive', 'Strategy', 'Business Plan', 'Board'],
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-19T10:00:00Z',
  },
  {
    id: 'src-3',
    sourceNumber: 'SRC-003',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'Proposal: AI Study & Study Paths Revamp (Tier 2 Hybrid Engine)',
    summary:
      'Hybrid AI tutoring architecture combining client-side deterministic study progress with Gemini Flash API for on-demand question explanations, reducing app bundle size and latency.',
    externalUrl: 'https://docs.google.com/document/d/1Cy_8Nmk_AiStudyPathsRevamp2026/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Abdulaziz Abdulwahab',
    relatedProductId: 'ace-acad',
    aiStatus: 'analyzed',
    aiSummary:
      'Technical architecture for cost-optimized AI study guidance. Evaluates local on-device LLMs vs cloud API, recommending Tier 2 Gemini Flash with strict token budget limits.',
    tags: ['AI', 'Architecture', 'Gemini Flash', 'Study Paths'],
    createdAt: '2026-08-18T11:00:00Z',
    updatedAt: '2026-08-18T16:10:00Z',
  },
  {
    id: 'src-4',
    sourceNumber: 'SRC-004',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'Legal & Privacy Readiness Report (NDPA 2023 & GDPR)',
    summary:
      'Corporate regulatory compliance checklist for Nigerian Data Protection Act (NDPA 2023) and global student privacy standards.',
    externalUrl: 'https://docs.google.com/document/d/1WSTAR_LegalPrivacyReadinessReport_NDPA2023/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Ibrahim Abdulwahab',
    relatedProductId: 'wstar-core',
    aiStatus: 'analyzed',
    aiSummary:
      'Legal readiness audit covering data processing agreements, student consent for under-18 users, and NDPC registration obligations.',
    tags: ['Legal', 'NDPA 2023', 'Compliance', 'Privacy'],
    createdAt: '2026-08-10T14:00:00Z',
    updatedAt: '2026-08-16T18:00:00Z',
  },
  {
    id: 'src-5',
    sourceNumber: 'SRC-005',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'WSTAR Organizational Structure & Role Blueprints',
    summary:
      'Complete organizational hierarchy and role specifications across Executive Leadership, Technical Engineering, Brand/Growth, and Campus Ambassador networks.',
    externalUrl: 'https://docs.google.com/document/d/1WSTAR_OrgStructure_RoleBlueprints_HR/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Ibrahim Abdulwahab',
    relatedProductId: 'wstar-core',
    aiStatus: 'analyzed',
    aiSummary:
      'HR blueprint establishing core founder roles, lead engineer responsibilities, and operational reporting lines for future technical hires.',
    tags: ['HR', 'Roles', 'Org Structure', 'Operations'],
    createdAt: '2026-08-08T10:00:00Z',
    updatedAt: '2026-08-18T15:00:00Z',
  },
  {
    id: 'src-6',
    sourceNumber: 'SRC-006',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'WSTAR Grant Ready Room & Pitch Decks (Tony Elumelu Foundation)',
    summary:
      'Institutional grant applications, competitive market sizing for Nigerian EdTech/AgriTech, and financial projections for TEF and tech accelerators.',
    externalUrl: 'https://docs.google.com/document/d/1WSTAR_TEF_GrantPitchDeck_ReadyRoom/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Ibrahim Abdulwahab',
    relatedProductId: 'wstar-core',
    aiStatus: 'analyzed',
    aiSummary:
      'Comprehensive pitch deck dossier detailing market problem, solution architecture, traction metrics, and grant fund utilization.',
    tags: ['Grants', 'Funding', 'Pitch Deck', 'TEF'],
    createdAt: '2026-08-12T12:00:00Z',
    updatedAt: '2026-08-18T19:00:00Z',
  },
  {
    id: 'src-7',
    sourceNumber: 'SRC-007',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'Proposal: User-Generated Content (UGC) Upload & Staging System (Legacy Spec)',
    summary:
      'Historical March 2026 architecture specifying centralized file quarantine, manual admin review, and cloud storage hosting before shifting to the Class Rep model.',
    externalUrl: 'https://docs.google.com/document/d/1Mar2026_UGC_CentralizedStagingArch/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Abdulaziz Abdulwahab',
    relatedProductId: 'ace-acad',
    aiStatus: 'analyzed',
    aiSummary:
      'Historical baseline proposal for UGC file ingestion. Superseded by August 2026 Class Rep model to minimize server bandwidth costs.',
    tags: ['Legacy', 'UGC', 'Architecture', 'Diffing'],
    createdAt: '2026-03-12T09:00:00Z',
    updatedAt: '2026-03-20T14:00:00Z',
  },
  {
    id: 'src-8',
    sourceNumber: 'SRC-008',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'WSTAR Growth Playbook & 30-Day Content Strategy',
    summary:
      'Comprehensive campus outreach playbook, viral social mechanics for Nigerian student communities, and thought-leadership calendar.',
    externalUrl: 'https://docs.google.com/document/d/1WSTAR_GrowthPlaybook_Month1_ContentStrategy/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Ibrahim Abdulwahab',
    relatedProductId: 'wstar-core',
    aiStatus: 'analyzed',
    aiSummary:
      'Tactical organic growth roadmap detailing university WhatsApp channel distribution, meme marketing, and student influencer partnerships.',
    tags: ['Growth', 'Playbook', 'Content Strategy', 'Marketing'],
    createdAt: '2026-08-14T09:00:00Z',
    updatedAt: '2026-08-18T14:30:00Z',
  },
  {
    id: 'src-9',
    sourceNumber: 'SRC-009',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'Software Requirements Specification: Ace-Acad 2.0 (SRS & SAD)',
    summary:
      'Master engineering and system architecture specification defining 13 core 100L university courses, offline Drift SQLite sync, authentication, and testing criteria.',
    externalUrl: 'https://docs.google.com/document/d/1AceAcad2_SRS_SAD_TechnicalSpec/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Abdulaziz Abdulwahab',
    relatedProductId: 'ace-acad',
    aiStatus: 'analyzed',
    aiSummary:
      'Baseline engineering and product requirements specification. Outlines core user flows, technical constraints, campus syllabus compliance, and performance metrics.',
    tags: ['SRS', 'Requirements', 'Engineering', 'Flutter', 'Drift'],
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
  },
  {
    id: 'src-10',
    sourceNumber: 'SRC-010',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'PlantIQ Solar IoT Firmware & Circuit Hardware Specification',
    summary:
      'Hardware design dossier, Proteus circuit schematics, solar MPPT battery management specs, and ESP32 crop pathology diagnostic firmware.',
    externalUrl: 'https://docs.google.com/document/d/1PlantIQ_SolarIoT_HardwareSchematic_FirmwareSpec/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Abdulaziz Abdulwahab',
    relatedProductId: 'plantiq',
    aiStatus: 'analyzed',
    aiSummary:
      'Complete hardware engineering blueprint for off-grid smart farm monitoring, edge sensor telemetry, and solar battery power resilience.',
    tags: ['PlantIQ', 'AgriTech', 'Solar IoT', 'Hardware'],
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-08-15T16:00:00Z',
  },
  {
    id: 'src-11',
    sourceNumber: 'SRC-011',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'Autonomous Procurement Agent PRD & Enterprise AI Solutions',
    summary:
      'Technical requirements for WSTAR AI enterprise procurement agency, autonomous vendor negotiation agents, and automated invoice verification.',
    externalUrl: 'https://docs.google.com/document/d/1WSTAR_EnterpriseAI_ProcurementAgent_PRD/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Abdulaziz Abdulwahab',
    relatedProductId: 'wstar-core',
    aiStatus: 'analyzed',
    aiSummary:
      'Product requirements document for enterprise B2B AI workflows, automating supplier bidding, contract compliance, and invoice reconciliation.',
    tags: ['AI Solutions', 'Enterprise', 'B2B', 'Procurement'],
    createdAt: '2026-08-11T13:00:00Z',
    updatedAt: '2026-08-17T18:00:00Z',
  },
  {
    id: 'src-12',
    sourceNumber: 'SRC-012',
    sourceType: 'gdrive',
    provider: 'google_drive',
    title: 'AiMOGA x WSTAR Strategic Joint Robotics Venture & MoU',
    summary:
      'Executed memorandum of understanding, joint IP allocation terms, educational robotics syllabus integration, and hardware manufacturing agreement.',
    externalUrl: 'https://docs.google.com/document/d/1AiMOGAxWSTAR_JointRobotics_MoU_Executed/edit',
    mimeType: 'application/vnd.google-apps.document',
    author: 'Ibrahim Abdulwahab & Abdulaziz Abdulwahab',
    relatedProductId: 'wstar-core',
    aiStatus: 'analyzed',
    aiSummary:
      'Bilateral partnership agreement establishing co-development of STEM educational robotics kits and institutional distribution across Nigerian universities.',
    tags: ['Robotics', 'Partnerships', 'MoU', 'Joint Venture'],
    createdAt: '2026-08-06T15:00:00Z',
    updatedAt: '2026-08-16T17:00:00Z',
  },
]


