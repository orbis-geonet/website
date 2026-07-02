import { Heading } from "@/lib/components";
import { getDictionary } from "@/lib/locales";
import { Metadata } from "next";
import React from "react";

export const generateMetadata = async (): Promise<Metadata> => {
  const { dictionary } = await getDictionary();
  return {
    title: dictionary.privacy.metaTitle,
  };
};

const Privacy = () => {
  return (
    <main className="max-w-6xl mx-auto py-10 md:py-20 px-4">
      <div id="privacy" className="space-y-4 md:space-y-6">
        <Heading type="h3">
          GEONET INTERNET LIMITED - CRO 793594 - Privacy Policy
        </Heading>
        <p className="text-sm text-gray-500">Last Updated: 11 March 2026</p>
        <p>
          GEONET INTERNET LIMITED (CRO 793594), registered at VENTURE HUB, 136
          CAPEL STREET, DUBLIN, D01 T2C9, IRELAND (&quot;we&quot;,
          &quot;us&quot;, &quot;our&quot;, &quot;GEONET&quot;, or &quot;the
          Company&quot;) is committed to protecting your privacy. Below, our
          rules, with transparency.
        </p>
        <div>
          <ol style={{ listStyle: "decimal" }}>
            <li>
              <strong>About Personal Information</strong>
              <p>
                Personal information is data used to identify an individual or
                contact a specific person. You may be required to provide
                personal information when contacting GEONET or affiliated
                companies.
              </p>
              <p>
                The company and its affiliates may share this information and
                use it according to this Privacy Policy, potentially combining
                it with other data to provide and improve products, services,
                content and advertising.
              </p>
              <p>
                Registration may require: name, gender, email, mailing address,
                telephone number, contact preferences and payment information.
              </p>
              <p>Collected personal information enables:</p>
              <ol style={{ listStyle: "disc" }}>
                <li>
                  User account creation based on provided information
                </li>
                <li>
                  Communications including newsletters, promotions, and
                  marketing materials (you may opt out; mandatory notices about
                  service interactions cannot be declined)
                </li>
                <li>Contest and promotion administration</li>
                <li>
                  Product/service development, improvement, and research
                </li>
                <li>
                  Service opinion feedback and notifications about app changes
                </li>
                <li>
                  Customer service inquiries directed to{" "}
                  <a href="mailto:info@orbis.social">info@orbis.social</a>
                </li>
              </ol>
              <p>
                Comments and feedback may be posted publicly using only your
                registration name, profile photo, and city. Prohibited content
                includes defamatory, obscene, or offensive material; content
                promoting violence, discrimination, or hate speech; intellectual
                property infringement; third-party privacy violations; illegal
                activity promotion; misrepresentation of origin; and
                impersonation. The company reserves rights to edit or delete
                violating content.
              </p>
            </li>
            <li>
              <strong>About Non-Personal Information</strong>
              <p>
                Non-personal information cannot be directly associated with any
                individual. Examples include age, preferences, language, postal
                code, and area code.
              </p>
              <p>
                General user activity information is aggregated to help
                understand which site sections, products, and services attract
                interest. Aggregated data is considered non-personal information
                under this policy.
              </p>
              <p>
                When non-personal information is combined with personal
                information, the combined data is treated as personal
                information while combined.
              </p>
              <p>
                The company, online services, applications, emails, and
                advertising may use cookies, pixel tags, and web beacons to
                understand user behaviour, measure advertising effectiveness,
                and web search performance. Information from these technologies
                is generally treated as non-personal unless IP addresses or
                similar identifiers are classified as personal by applicable law
                (including under the GDPR, where IP addresses are considered
                personal data).
              </p>
              <p>
                Cookies and technologies also remember personal information to
                enhance convenience and personalisation. Knowing your first name
                enables personalised greetings; country and language information
                provide customised browsing experiences.
              </p>
              <p>
                Like most sites, the company automatically collects information
                stored in log files: IP addresses, browser type and language,
                Internet service provider, entry/exit pages, operating system,
                date/time information, and click sequence data.
              </p>
              <p>
                This information helps understand trends, administer the site,
                analyse user behaviour, and obtain demographic information about
                the user base, potentially used in marketing and advertising.
              </p>
              <p>
                &quot;Click-through URLs&quot; in emails are monitored to
                understand interest in topics and evaluate communication
                effectiveness. Avoiding this requires not clicking text or image
                links in emails.
              </p>
              <p>
                Pixel tags enable reading email message formats and detecting
                whether emails were opened, potentially reducing or eliminating
                sent messages.
              </p>
              <p>
                Users can unsubscribe from future email newsletter contacts
                anytime by accessing the unsubscribe link in emails.
              </p>
            </li>
            <li>
              <strong>Health and Wellness Data</strong>
              <p>
                Our app may collect or access the following health and wellness
                related data in connection with the services we provide:
              </p>
              <ol style={{ listStyle: "disc" }}>
                <li>
                  Location data that may be associated with health-related
                  venues (e.g., gyms, clinics, wellness centres)
                </li>
                <li>
                  User-generated content related to health and wellness venues
                  or activities
                </li>
              </ol>
              <p>
                This data is collected solely for the purpose of providing our
                location-based social networking services, including enabling
                check-ins, venue discovery, and social sharing features.
              </p>
              <p>
                We do not sell health-related data to third parties. We do not
                use health-related data for advertising targeting purposes. Any
                health-related information that may be inferred from your use of
                the Platform is treated with the same protections as personal
                data under GDPR and applicable data protection laws.
              </p>
              <p>
                For more details on how we handle your data, contact us at{" "}
                <a href="mailto:info@orbis.social">info@orbis.social</a>.
              </p>
            </li>
            <li>
              <strong>Disclosure to Third Parties and Others</strong>
              <p>
                <strong>Service Providers:</strong> The company may use
                third-party companies and individuals to facilitate services,
                maintain databases, analyse data, enhance features, or analyse
                service usage. These parties have access only to perform
                assigned tasks and cannot use or disclose information otherwise.
              </p>
              <p>
                <strong>Others:</strong> The company may be required by law,
                legal processes, litigation, or public/governmental authority
                determinations to disclose personal information. Disclosure may
                occur for national security, legal requirements, public
                importance matters, or when reasonably necessary to enforce
                terms or protect operations/users. In restructuring, merger, or
                sale events, personal information may transfer to applicable
                third parties.
              </p>
              <p>
                The company takes administrative, technical, and physical
                precautions protecting personal information against loss, theft,
                misuse, and unauthorised access, disclosure, alteration, and
                destruction.
              </p>
              <p>
                The company helps keep personal information accurate, complete,
                and current, retaining it for periods required by this policy
                unless longer retention is legally required or permitted.
              </p>
              <p>
                Services contain links to third-party websites and online
                services. Redirection to third parties does not constitute
                endorsement, authorisation, or affiliation representation, nor
                endorsement of their privacy or security policies. The company
                does not control third-party sites and advises reading their
                privacy policies and terms before providing information or using
                services.
              </p>
            </li>
            <li>
              <strong>Data Protection - GDPR Compliance</strong>
              <p>
                As GEONET INTERNET LIMITED is established in Ireland, a member
                state of the European Union, the processing of personal data is
                subject to the General Data Protection Regulation (EU) 2016/679
                (&quot;GDPR&quot;), the Irish Data Protection Act 2018, and the
                ePrivacy Regulations.
              </p>
              <p>
                GEONET INTERNET LIMITED is the data controller for personal data
                processed through the Platform.
              </p>
              <p>
                <strong>5.1 Rights of Users</strong>
              </p>
              <p>
                Under the GDPR, all users have the following rights:
              </p>
              <ol style={{ listStyle: "lower-alpha" }}>
                <li>
                  <strong>Right of Access:</strong> You have the right to
                  request an explanation of what personal data the company holds
                  about you and how it is used. You are entitled to receive a
                  copy of your personal data. Send requests to{" "}
                  <a href="mailto:info@orbis.social">info@orbis.social</a>.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> You have the right
                  to request correction of incorrect, incomplete, or inaccurate
                  information at any time by emailing{" "}
                  <a href="mailto:info@orbis.social">info@orbis.social</a>.
                </li>
                <li>
                  <strong>Right to Erasure:</strong> You have the right to
                  request deletion of your account and personal data at any
                  time. The company will delete information except data required
                  to be retained by law or for legitimate business purposes as
                  permitted by the GDPR.
                </li>
                <li>
                  <strong>Right to Object:</strong> You have the right to
                  oppose personal data processing at any time, including for
                  direct marketing purposes. Processing may continue where
                  permitted by the GDPR (e.g., where we have compelling
                  legitimate grounds).
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> You have the
                  right to receive your personal data in a structured, commonly
                  used, and machine-readable format and to transmit that data to
                  another controller.
                </li>
                <li>
                  <strong>Right to Restrict Processing:</strong> You have the
                  right to request the restriction of processing in certain
                  circumstances as defined by Article 18 of the GDPR.
                </li>
                <li>
                  <strong>Right to Lodge a Complaint:</strong> You have the
                  right to lodge a complaint about the company&apos;s personal
                  data usage with the Data Protection Commission (DPC) of
                  Ireland:
                  <p className="mt-2">
                    Data Protection Commission
                    <br />
                    21 Fitzwilliam Square South, Dublin 2, D02 RD28, Ireland
                    <br />
                    Website:{" "}
                    <a
                      href="https://www.dataprotection.ie"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.dataprotection.ie
                    </a>
                    <br />
                    Email:{" "}
                    <a href="mailto:info@dataprotection.ie">
                      info@dataprotection.ie
                    </a>
                    <br />
                    Phone: +353 (0)761 104 800
                  </p>
                </li>
              </ol>
              <p>
                <strong>5.2 Legal Bases for Processing</strong>
              </p>
              <p>
                GDPR requires specific legal bases for processing personal data:
              </p>
              <p>
                <strong>Service Provision:</strong> User profile information
                maintains accounts and identity verification; contact data
                communicates check-ins, reservations, and payments; personal
                contact details enable request responses and relevant
                information delivery. Essential Platform maintenance,
                promotions, inter-user communication, and service efficiency
                optimisation information is processed.
              </p>
              <p>
                <strong>User/Third-Party Protection:</strong> The company may
                store and disclose personal data to competent authorities when
                Platform or third-party safety is threatened.
              </p>
              <p>
                <strong>Legitimate Interests:</strong> Data collection optimises
                user experience and security, preventing unverified or
                unreliable persons from creating Platform risks. Removed user
                data is retained to prevent their return, improving service
                quality. Fraud risk minimisation through data processing enables
                identity verification and fraud response. Cooperation with
                judicial authorities regarding unlawful or harmful acts.
                Customer service and support require information processing.
                Platform capabilities, upgrades, and improvements require data
                collection and processing, benefiting both company and user
                interests. Internal research and analysis on Platform
                functioning and user profiles.
              </p>
              <p>
                <strong>Legal Obligation:</strong> Laws, regulations, and
                judicial authority determinations require the company to
                collect, store, process, and retain certain information with
                legal backing.
              </p>
              <p>
                <strong>Consent-Based Processing:</strong> The company may
                collect and use information based on consent, revocable at any
                time through account deletion or emailing{" "}
                <a href="mailto:info@orbis.social">info@orbis.social</a>.
                Revoking consent prevents accessing services and functionality
                dependent on that personal information.
              </p>
              <p>
                <strong>5.3 International Data Transfers</strong>
              </p>
              <p>
                Where personal data is transferred outside the European Economic
                Area (EEA), GEONET INTERNET LIMITED ensures that appropriate
                safeguards are in place, such as Standard Contractual Clauses
                (SCCs) approved by the European Commission or adequacy
                decisions.
              </p>
              <p>
                <strong>5.4 Data Retention</strong>
              </p>
              <p>
                We retain your personal data only for as long as is necessary
                for the purposes for which it was collected, or as required by
                applicable law. When your data is no longer needed, it will be
                securely deleted or anonymised.
              </p>
            </li>
            <li>
              <strong>Specific Data Use for All Users</strong>
              <p>The following data is collected through your consent:</p>
              <ol style={{ listStyle: "disc" }}>
                <li>
                  User information is maintained in Google Cloud &amp; AWS
                  infrastructure using encryption at rest and in transit
                </li>
                <li>
                  Location is monitored when using the app because app
                  gamification and check-in features require it
                </li>
                <li>
                  Location and user information may be shared with advertising
                  partners for targeted advertisement delivery through newsfeed
                  banners, in compliance with applicable data protection laws
                </li>
                <li>
                  Username (changeable per Terms of Service), email, encrypted
                  password, date of birth, and gender are stored in company
                  databases
                </li>
              </ol>
            </li>
            <li>
              <strong>Cookies Policy</strong>
              <p>
                Our Platform uses cookies and similar technologies to enhance
                your experience. By using our Platform, you consent to the use
                of cookies in accordance with this policy. You can manage your
                cookie preferences through your browser settings. Essential
                cookies necessary for the Platform to function cannot be
                disabled.
              </p>
              <p>
                For more information about the cookies we use, please contact{" "}
                <a href="mailto:info@orbis.social">info@orbis.social</a>.
              </p>
            </li>
            <li>
              <strong>Children&apos;s Privacy</strong>
              <p>
                Our Platform is not intended for children under the age of 18.
                We do not knowingly collect personal data from children under
                18. If we become aware that we have collected personal data from
                a child under 18, we will take steps to delete that information
                promptly.
              </p>
            </li>
            <li>
              <strong>Do Not Fully Understand Our Privacy Policy?</strong>
              <p>
                Questions or concerns about the Privacy Policy or described
                practices should be directed to:{" "}
                <a href="mailto:info@orbis.social">info@orbis.social</a>
              </p>
              <p>
                GEONET INTERNET LIMITED may update its Privacy Policy
                periodically. Material policy changes will be posted on the site
                with the updated Privacy Policy and, where required by law,
                notified to you by email.
              </p>
            </li>
          </ol>
        </div>
        <div className="pt-4 border-t text-sm text-gray-600 space-y-1">
          <p>Contact: <a href="mailto:info@orbis.social">info@orbis.social</a></p>
          <p>Data Controller: GEONET INTERNET LIMITED</p>
          <p>VENTURE HUB, 136 CAPEL STREET, DUBLIN, D01 T2C9, IRELAND</p>
          <p>CRO Number: 793594</p>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
