import styles from './privacy.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - Ace-Acad | WSTAR',
    description: 'Privacy Policy for ACE ACAD, explaining how we collect, use, disclose, and protect personal data.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className={`section ${styles.privacyPage}`}>
            <div className={`container ${styles.contentContainer}`}>
                <h1>Privacy Policy for Ace Acad</h1>
                <p><strong>Effective Date:</strong> 14/04/2026</p>
                <p><strong>Last Updated:</strong> 14/04/2026</p>

                <h2>1. INTRODUCTION</h2>
                <p>
                    ACE ACAD (“ACE ACAD”, “we”, “us”, or “our”) is an AI-powered educational platform that curates personalized learning materials based on users’ interests, academic level, and selected courses. We at Ace acad are committed to respecting your privacy and are strongly committed to keeping secure any information we obtain from you or about you. This Privacy Policy explains how we collect, use, disclose, and protect personal data when you use our services (“Service”).
                </p>
                <p>
                    We are committed to processing personal data in accordance with the <strong>Nigeria Data Protection Act</strong> (“NDPA”).
                </p>

                <h2>2. SCOPE OF THIS POLICY</h2>
                <p>This Policy applies to:</p>
                <ul>
                    <li>Users of ACE ACAD</li>
                    <li>Visitors to our website or applications</li>
                    <li>Individuals who interact with us (e.g., support, inquiries)</li>
                </ul>
                <p>It does not apply to:</p>
                <ul>
                    <li>Third-party platforms linked through our Service</li>
                </ul>

                <h2>3. PERSONAL DATA WE COLLECT</h2>
                <p>We collect personal data in the following categories:</p>

                <h3>3.1 Information You Provide Directly</h3>
                <p>
                    When you create an account with us, we collect information associated with your account, including your name, contact information, email address, account credentials, payment information (“Account information”). Our services may also allow you to upload your profile picture, a user name, your school, department, course and level as part of your account information.
                </p>
                <p>
                    If you communicate with us, such as via email or our pages on social media sites, we may collect personal data like your name, contact information and the content of the messages (Support requests, feedbacks…..) you send.
                </p>

                <h3>3.2 Information Collected Automatically</h3>
                <p>When you use the Service, we receive the following information about your visit, use or interactions:</p>
                <ul>
                    <li><strong>Log Data:</strong> We collect information that your browser or device automatically sends when you use our Services. Log data includes your Internet Protocol address, browser type and settings, the date and time of your request, and how you interact with our Services.</li>
                    <li><strong>Usage Data:</strong> We collect information about your use and activity across the Services, such as the types of content that you view or engage with, the features you use and the actions you take, when you submit feedback to a model response, the dates and times of access, user agent and version, type of computer or mobile device, and your computer connection.</li>
                    <li><strong>Device Information:</strong> We collect information about the device you use to access the Services, such as the name of the device, operating system, device identifiers, and browser you are using. Information collected depends on the type of device you use and its settings.</li>
                    <li><strong>Location Information:</strong> We determine the general area from which your device accesses our Services based on information like its IP address for security reasons and to make your product experience better, for example to protect your account by detecting unusual login activity or to provide more accurate responses. In addition, some of our Services allow you to choose to provide more precise location information from your device, such as location information from your device’s GPS.</li>
                    <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to operate and administer our Services, and improve your experience. We store some of the information described in this Policy with cookies, for example to help maintain your preferences across sessions if you’re not logged in, or to assist with authentication and customer support. For details about our use of cookies, please read our Cookie Notice.</li>
                </ul>

                <h3>3.3 Inferred and Derived Data</h3>
                <p>We may generate insights about you, such as:</p>
                <ul>
                    <li>Learning preferences.</li>
                    <li>Engagement patterns</li>
                    <li>Content relevance scores</li>
                </ul>
                <p>This is essential to how ACE ACAD personalizes your experience.</p>

                <h3>3.4 Information from Third Parties (Limited)</h3>
                <p>
                    At launch, we do not actively collect data from third-party sources, but we may do so in the future (e.g., integrations with learning platforms). Where applicable, this Policy will be updated.
                </p>

                <h2>4. HOW WE USE PERSONAL DATA</h2>
                <p>We use personal data for the following purposes:</p>

                <h3>4.1 Service Delivery</h3>
                <ul>
                    <li>To provide, analyze and maintain our service (for example to respond to your questions to our Aceacad AI)</li>
                    <li>To generate personalized learning materials</li>
                </ul>

                <h3>4.2 Personalization</h3>
                <ul>
                    <li>To tailor content to your academic level and department</li>
                    <li>To improve recommendation accuracy</li>
                </ul>

                <h3>4.3 Improvement of Services</h3>
                <ul>
                    <li>To analyze usage trends</li>
                    <li>To improve system performance and user experience</li>
                </ul>

                <h3>4.4 Safety and Security</h3>
                <ul>
                    <li>To detect, prevent, and investigate misuse</li>
                    <li>To protect the integrity of the platform</li>
                </ul>

                <h3>4.5 Communications</h3>
                <ul>
                    <li>To send service-related updates</li>
                    <li>To respond to inquiries and provide support</li>
                </ul>

                <h2>5. ARTIFICIAL INTELLIGENCE AND DATA USE</h2>

                <h3>5.1 Use of AI System</h3>
                <p>ACE ACAD uses artificial intelligence and machine learning systems to power core functionalities of the Service. These systems analyze user-provided information and interaction patterns to:</p>
                <ul>
                    <li>Curate relevant educational materials from internal and third-party sources</li>
                    <li>Generate personalized learning recommendations tailored to a user’s academic level, interests, and selected courses</li>
                    <li>Continuously adapt and refine learning pathways based on user engagement</li>
                </ul>
                <p>These AI systems operate using probabilistic models and pattern recognition techniques, meaning outputs are generated based on learned associations rather than deterministic rules.</p>

                <h3>5.2 Use of Data for System Improvement</h3>
                <p>We may use user inputs, interactions, and usage data to improve the performance, accuracy, and reliability of our AI systems.</p>
                <p>Such use may include:</p>
                <ul>
                    <li>Training, testing, and validating machine learning models</li>
                    <li>Identifying and correcting errors or inconsistencies in recommendations</li>
                    <li>Enhancing personalization features and system responsiveness</li>
                </ul>
                <p>Where reasonably practicable, we implement safeguards to reduce privacy risks, including:</p>
                <ul>
                    <li>Removing or masking direct identifiers (e.g., names, email addresses)</li>
                    <li>Aggregating data to prevent identification of individual users</li>
                    <li>Applying data minimization principles to ensure only necessary data is processed</li>
                </ul>
                <p>We do not use personal data for system improvement in a manner that is incompatible with the original purpose of collection.</p>

                <h3>5.3 Human Review and Oversight</h3>
                <p>To ensure quality, safety, and system integrity, ACE ACAD may involve limited human review of data and system outputs.</p>
                <p>Such review may occur where necessary to:</p>
                <ul>
                    <li>Improve the accuracy and performance of AI-generated recommendations</li>
                    <li>Detect, prevent, or investigate misuse, abuse, or security incidents</li>
                    <li>Debug technical issues or maintain system functionality</li>
                </ul>
                <p>Human reviewers are:</p>
                <ul>
                    <li>Authorized personnel or vetted service providers</li>
                    <li>Subject to strict confidentiality and data protection obligations</li>
                    <li>Granted access only on a need-to-know basis.</li>
                </ul>
                <p>We implement internal controls to limit the scope and frequency of such access.</p>

                <h3>5.4 Limitations and Risks of AI Systems</h3>
                <p>You acknowledge and agree that AI-generated outputs:</p>
                <ul>
                    <li>May not always be accurate, complete, or up-to-date</li>
                    <li>May reflect biases present in training data or underlying models</li>
                    <li>May not fully account for individual learning contexts or academic requirements</li>
                </ul>
                <p>Accordingly:</p>
                <ul>
                    <li>Content provided through the Service is for informational and educational purposes only</li>
                    <li>It should not be relied upon as a substitute for professional, academic, or institutional guidance</li>
                    <li>Users are responsible for independently verifying critical information before reliance</li>
                </ul>
                <p>ACE ACAD does not guarantee the correctness, reliability, or suitability of AI-generated outputs for specific purposes.</p>

                <h3>5.5 User Control and Expectations</h3>
                <p>Where applicable, users may:</p>
                <ul>
                    <li>Adjust their preferences to influence recommendations</li>
                    <li>Provide feedback to improve system outputs</li>
                    <li>Request access to or deletion of their personal data in accordance with applicable laws</li>
                </ul>
                <p>We are committed to improving transparency and user control over AI-driven features as the Service evolves.</p>

                <h2>6. LEGAL BASES FOR PROCESSING (GDPR)</h2>
                <p>We process personal data based on:</p>
                <ul>
                    <li>Performance of a contract – to provide the Service</li>
                    <li>Consent – where required (e.g., optional features)</li>
                    <li>Legitimate interests – improving services, ensuring security</li>
                    <li>Legal obligations – compliance with applicable laws</li>
                </ul>

                <h2>7. HOW WE SHARE PERSONAL DATA</h2>
                <p>ACE ACAD does not sell, rent, or trade personal data to third parties for monetary or commercial gain. We may, however, disclose personal data in the following limited circumstances:</p>

                <h3>7.1 Service Providers (Data Processors)</h3>
                <p>We engage carefully selected third-party service providers (“Processors”) to support the operation and delivery of the Service.</p>
                <p>These may include:</p>
                <ul>
                    <li>Cloud hosting and storage providers (to host and store data securely)</li>
                    <li>Analytics and performance tools (to understand usage patterns and improve functionality)</li>
                    <li>Technical infrastructure and support providers (to maintain system reliability, security, and scalability)</li>
                </ul>
                <p>Where such providers process personal data on our behalf:</p>
                <ul>
                    <li>They act strictly under our instructions and do not process data for their own purposes</li>
                    <li>They are bound by data processing agreements that comply with the <strong>Nigeria Data Protection Act</strong></li>
                    <li>They are required to implement appropriate technical and organizational security measures</li>
                    <li>They are subject to confidentiality obligations and restricted access controls</li>
                </ul>
                <p>We take reasonable steps to ensure that all Processors provide sufficient guarantees regarding data protection and security.</p>

                <h3>7.2 Legal and Regulatory Disclosures</h3>
                <p>We may disclose personal data where such disclosure is necessary to:</p>
                <ul>
                    <li>Comply with applicable laws, regulations, or legal obligations</li>
                    <li>Respond to lawful requests from courts, law enforcement agencies, or regulatory authorities</li>
                    <li>Enforce our Terms of Service or other contractual rights</li>
                    <li>Detect, prevent, or investigate fraud, security breaches, or unlawful activities</li>
                    <li>Protect the rights, property, or safety of ACE ACAD, our users, or third parties</li>
                </ul>
                <p>Where appropriate and legally permissible, we will take steps to:</p>
                <ul>
                    <li>Limit the scope of disclosure</li>
                    <li>Ensure that requests are valid and proportionate</li>
                </ul>

                <h3>7.3 Business Transfers and Corporate Transactions</h3>
                <p>In the event of a corporate transaction, such as:</p>
                <ul>
                    <li>A merger or consolidation</li>
                    <li>An acquisition or sale of assets</li>
                    <li>Financing, restructuring, or investment transaction</li>
                </ul>
                <p>personal data may be disclosed to relevant third parties, including:</p>
                <ul>
                    <li>Prospective or actual purchasers</li>
                    <li>Investors</li>
                    <li>Legal and financial advisors</li>
                </ul>
                <p>In such circumstances:</p>
                <ul>
                    <li>Personal data will only be shared to the extent necessary for the transaction</li>
                    <li>We will ensure that appropriate confidentiality and data protection safeguards are in place</li>
                    <li>Any successor entity will be required to process personal data in a manner consistent with this Privacy Policy and applicable law</li>
                </ul>
                <p>Where required by law, we will provide notice to users before such transfer occurs.</p>

                <h3>7.4 International Transfers in the Context of Sharing</h3>
                <p>Where any sharing of personal data involves transfer outside Nigeria or the European Economic Area (EEA), we ensure that appropriate safeguards are implemented, including:</p>
                <ul>
                    <li>Standard Contractual Clauses (SCCs)</li>
                    <li>Transfers to jurisdictions with adequate data protection standards</li>
                    <li>Other lawful transfer mechanisms under applicable law</li>
                </ul>

                <h3>7.5 No Unauthorised Disclosure</h3>
                <p>Except as expressly set out in this Policy, we do not disclose personal data to third parties without:</p>
                <ul>
                    <li>Your consent; or</li>
                    <li>A lawful basis under applicable data protection laws</li>
                </ul>

                <h2>9. DATA RETENTION</h2>
                <p>We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, including to satisfy legal, regulatory, contractual, and operational requirements.</p>
                <p>Retention periods are determined based on:</p>
                <ul>
                    <li>The nature and sensitivity of the data</li>
                    <li>The purposes of processing</li>
                    <li>Applicable legal and regulatory obligations</li>
                    <li>Legitimate business needs</li>
                </ul>
                <p>In general:</p>
                <ul>
                    <li>Account Data (e.g., name, email, profile information) is retained for as long as your Account remains active and for a reasonable period thereafter to enable account recovery, compliance, and dispute resolution</li>
                    <li>Usage and Interaction Data is retained for analytics, system improvement, and security monitoring purposes for a limited period, after which it may be deleted or anonymized</li>
                    <li>Support and Communication Data may be retained to resolve disputes, enforce agreements, and improve user support</li>
                    <li>Legal and Compliance Data is retained as required to comply with applicable laws, regulatory requirements, or lawful requests</li>
                </ul>
                <p>Where personal data is no longer required:</p>
                <ul>
                    <li>It will be securely deleted or anonymized; or</li>
                    <li>Retained in a form that does not permit identification of individuals</li>
                </ul>
                <p>We may retain aggregated or anonymized data indefinitely, as such data does not constitute personal data under applicable law.</p>

                <h2>10. DATA SECURITY</h2>
                <p>We implement appropriate technical and organizational measures designed to protect personal data against unauthorized access, loss, misuse, alteration, or disclosure.</p>
                <p>These measures include, where appropriate:</p>
                <ul>
                    <li>Encryption of data in transit and/or at rest</li>
                    <li>Access controls to restrict data access to authorized personnel on a need-to-know basis</li>
                    <li>Authentication mechanisms (e.g., secure login processes)</li>
                    <li>System monitoring and logging to detect and respond to suspicious activity</li>
                    <li>Secure infrastructure and hosting environments</li>
                </ul>
                <p>We also implement internal policies and procedures to ensure that:</p>
                <ul>
                    <li>Personnel are trained on data protection obligations</li>
                    <li>Access to personal data is limited and auditable</li>
                    <li>Data breaches are identified and managed in a timely manner</li>
                </ul>
                <p>Despite these measures, no method of transmission or storage is completely secure. Accordingly, we cannot guarantee absolute security of personal data.</p>

                <h2>11. YOUR RIGHTS</h2>
                <p>Subject to applicable law, including the <strong>Nigeria Data Protection Act,</strong> you have the following rights in relation to your personal data:</p>

                <h3>11.1 Right of Access</h3>
                <p>To request confirmation of whether we process your personal data and to obtain a copy of such data.</p>

                <h3>11.2 Right to Rectification</h3>
                <p>To request correction of inaccurate or incomplete personal data.</p>

                <h3>11.3 Right to Erasure (“Right to be Forgotten”)</h3>
                <p>To request deletion of your personal data where:</p>
                <ul>
                    <li>It is no longer necessary for the purposes collected;</li>
                    <li>You withdraw consent (where applicable); or</li>
                    <li>Processing is unlawful</li>
                </ul>

                <h3>11.4 Right to Restrict Processing</h3>
                <p>To request that we limit the processing of your data in certain circumstances.</p>

                <h3>11.5 Right to Object</h3>
                <p>To object to processing based on legitimate interests or for direct marketing purposes (if applicable).</p>

                <h3>11.6 Right to Data Portability</h3>
                <p>To receive your personal data in a structured, commonly used, and machine-readable format and to transmit it to another controller.</p>

                <h3>11.7 Right to Withdraw Consent</h3>
                <p>Where processing is based on consent, you may withdraw such consent at any time without affecting the lawfulness of prior processing.</p>

                <h3>11.8 Exercising Your Rights</h3>
                <p>You may exercise your rights by contacting us at:</p>
                <p>Email: wstar5552@gmail.com</p>
                <p>We may:</p>
                <ul>
                    <li>Request verification of your identity before processing requests</li>
                    <li>Refuse or limit requests where permitted by law</li>
                    <li>Respond within applicable statutory timelines</li>
                </ul>

                <h2>12. CHILDREN’S PRIVACY</h2>
                <p>ACE ACAD does not knowingly collect or process personal data from children without appropriate authorization.</p>
                <p>Where users are under the age of 18:</p>
                <ul>
                    <li>Processing is carried out only with verifiable parental or guardian consent where required by law</li>
                    <li>We take reasonable steps to ensure that such consent is obtained and maintained</li>
                </ul>
                <p>If we become aware that personal data has been collected without appropriate authorization:</p>
                <ul>
                    <li>We will take steps to delete such data promptly; and</li>
                    <li>Where necessary, restrict or terminate the associated Account</li>
                </ul>

                <h2>13. COOKIES AND TRACKING TECHNOLOGIES</h2>
                <p>We use cookies and similar technologies (e.g., local storage, analytics tools) to enhance user experience and improve the Service.</p>

                <h3>13.1 Types of Cookies Used</h3>
                <ul>
                    <li>Strictly Necessary Cookies – required for core functionality (e.g., authentication, security)</li>
                    <li>Performance and Analytics Cookies – used to understand how users interact with the Service</li>
                    <li>Functional Cookies – used to remember preferences and improve user experience</li>
                </ul>

                <h3>13.2 Purpose of Use</h3>
                <p>Cookies help us to:</p>
                <ul>
                    <li>Enable and maintain core platform functionality</li>
                    <li>Analyze usage patterns and improve performance</li>
                    <li>Personalize content and user experience</li>
                </ul>

                <h3>13.3 User Control</h3>
                <p>You may control or disable cookies through:</p>
                <ul>
                    <li>Browser settings</li>
                    <li>Device-level controls</li>
                </ul>
                <p>Please note that disabling certain cookies may affect the functionality of the Service.</p>

                <h2>14. THIRD-PARTY SERVICES</h2>
                <p>The Service may contain links to or integrations with third-party service.</p>
                <p>These third parties:</p>
                <ul>
                    <li>Operate independently of ACE ACAD</li>
                    <li>Have their own privacy policies and practices</li>
                </ul>
                <p>ACE ACAD does not:</p>
                <ul>
                    <li>Control or monitor third-party data practices</li>
                    <li>Accept responsibility for their content, security, or handling of personal data</li>
                </ul>
                <p>We encourage users to review the privacy policies of any third-party services they access.</p>

                <h2>15. CHANGES TO THIS POLICY</h2>
                <p>We may update this Privacy Policy from time to time to reflect:</p>
                <ul>
                    <li>Changes in legal or regulatory requirements</li>
                    <li>Updates to our services or data practices</li>
                    <li>Improvements in transparency</li>
                </ul>
                <p>Where changes are material:</p>
                <ul>
                    <li>We will provide appropriate notice (e.g., via the platform or email where applicable)</li>
                    <li>We will update the “Last Updated” date</li>
                </ul>
                <p>Continued use of the Service after such updates constitutes acknowledgment of the revised Policy.</p>

                <h2>16. CONTACT AND COMPLAINTS</h2>
                <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, you may contact us at:</p>
                <p>Email: wstar5552@gmail.com</p>
                <p>Address: No.9 Sarkin Fulani Street, Zaria, KD, Nigeria.</p>
                <p>
                    You also have the right to lodge a complaint with a competent supervisory authority, including the Nigeria Data Protection Commission (NDPC) under the <strong>Nigeria Data Protection Act</strong> and other relevant regulatory authority.
                </p>
            </div>
        </main>
    );
}