import { Heading } from "@/lib/components";
import { getDictionary } from "@/lib/locales";
import { Metadata } from "next";
import React from "react";

export const generateMetadata = async (): Promise<Metadata> => {
  const { dictionary } = await getDictionary();
  return {
    title: dictionary.tos.metaTitle,
  };
};

const TermsandCondition = () => {
  return (
    <main className="max-w-6xl mx-auto py-10 md:py-20 px-4">
      <div id="tos" className="space-y-4 md:space-y-6">
        <Heading type="h3">
          GEONET INTERNET LIMITED - CRO 793594 - Terms of Service
        </Heading>
        <p className="text-sm text-gray-500">Last Updated: 11 March 2026</p>
        <p>
          The following terms describe to the user how our service works.
          Furthermore, it is a binding contract between USER and GEONET INTERNET
          LIMITED (CRO 793594), registered at VENTURE HUB, 136 CAPEL STREET,
          DUBLIN, D01 T2C9, IRELAND, that regulates the access and browsing of
          our website, and its use, including its sub-domains, whichever
          websites that GEONET INTERNET LIMITED makes our service available,
          smartphone apps, tablets or through any other electronic devices.
          These terms concern the rights and obligations of USERs to GEONET
          INTERNET LIMITED and between USERS.
        </p>
        <div>
          <ol style={{ listStyle: "decimal" }}>
            <li>
              <strong>About the Terms and Definitions</strong>
              <ol style={{ listStyle: "disc" }}>
                <li>
                  <strong>User</strong>
                  <p>
                    Any registered user that uses our Services or that, if not
                    registered, merely navigates through our Platform. May also
                    refer to Place Owners as users of the Platform.
                  </p>
                </li>
                <li>
                  <strong>Services</strong>
                  <p>
                    All functionalities, services, ease of access, tools and
                    benefits that GEONET INTERNET LIMITED provides its Users
                    (Users and Place Owners). These Services also include
                    existing and future services provided by affiliated third
                    parties.
                  </p>
                </li>
                <li>
                  <strong>Place Owners</strong>
                  <p>
                    A special type of user that owns a Place, such as a
                    commercial venue. Such Place Owner can create Place profiles,
                    ads and other functions permitted by GEONET INTERNET LIMITED
                    to enhance the Place&apos;s profile.
                  </p>
                </li>
                <li>
                  <strong>Place</strong>
                  <p>
                    Any commercial venue, or non-profitable institution, or even
                    cultural institution that is registered in our Platform.
                  </p>
                </li>
                <li>
                  <strong>Contract</strong>
                  <p>
                    An alternative name that refers to these Terms of Service.
                  </p>
                </li>
                <li>
                  <strong>Platform</strong>
                  <p>
                    Collective of digital domains in property of GEONET INTERNET
                    LIMITED, such as, but not limited to, the app, website,
                    content and data storage.
                  </p>
                </li>
              </ol>
            </li>
            <li>
              <strong>About GEONET INTERNET LIMITED</strong>
              <p>
                GEONET INTERNET LIMITED (CRO 793594) is a company incorporated
                in Ireland with its registered office at VENTURE HUB, 136 CAPEL
                STREET, DUBLIN, D01 T2C9, IRELAND.
              </p>
              <p>
                GEONET INTERNET LIMITED is an online Platform which allows its
                USERS to search for places and share information and content
                about those places. It functions as a Social Media Network,
                connecting its USERS to the affiliated establishments. As a mere
                intermediary, GEONET INTERNET LIMITED shall not be considered a
                legal party in any contract or legal relationship between USERS
                and PLACES or among USERS.
              </p>
              <p>
                By accepting these Terms of Service, you, USER or PLACE or any
                other person that navigates through our Platform, agrees that
                there is no employment relation of any kind between GEONET
                INTERNET LIMITED and you.
              </p>
              <p>
                Being GEONET INTERNET LIMITED an intermediation Platform between
                USER and PLACE, you agree that GEONET INTERNET LIMITED does not
                own, make, offer, manage, deliver or supply any Place Profile
                published by the PLACE. PLACES are solely responsible for their
                Profile content. GEONET INTERNET LIMITED reinforces that it
                cannot be considered a legal party in any contract or
                relationship regarding the USER and the PLACE, nor as a broker.
              </p>
              <p>
                Our PRIVACY POLICY describes our personal data collecting
                process, use, storage and sharing. Such data also includes
                information provided through the website&apos;s content and
                navigation in general. We can anonymise, pseudonymise or
                aggregate any information, including personal information or
                content, and use that information for any purpose, including
                enhancement of the Platform or of the Services, or even
                create/distribute public marketing related materials, in
                compliance with applicable data protection laws.
              </p>
              <p>
                We supply basic information to help you utilise our Platform and
                enjoy our Services in our HELP CENTER (
                <a href="mailto:info@orbis.social">info@orbis.social</a>).
                Although our efforts are always toward providing updated and
                trustworthy information, we cannot fully ensure that the
                information provided by the HELP CENTER will be 100% exact and
                updated.
              </p>
              <p>
                We can send messages related to your Subscription via SMS,
                WhatsApp or any other messages sent to your mobile device. In
                case you wish to stop receiving such notifications, you can, at
                any time, express your will by sending us an e-mail to{" "}
                <a href="mailto:info@orbis.social">info@orbis.social</a>,
                following the instructions of the message or replying, if you
                receive a message via WhatsApp, that you do not want to receive
                such notifications. Stay aware, however, that GEONET INTERNET
                LIMITED does not take responsibility for any losses or damages
                caused by the deactivation of our mobile device notifications.
              </p>
            </li>
            <li>
              <strong>Registering in Our Platform</strong>
              <p>
                USERs or PLACEs registering, as well as the use of the available
                services, implies express acceptance of the Terms of Service.
                Therefore, carefully read the provisions and, if you do not
                agree with the entire Terms of Service, refrain from registering
                and using the services.
              </p>
              <p>
                GEONET INTERNET LIMITED makes it possible to register for
                individuals who are over 18 (eighteen) years old and who are
                able to celebrate valid contracts.
              </p>
              <p>
                From now on, when you access or use GEONET INTERNET LIMITED
                services, you represent that you are 18 years of age or over and
                that you have the legal capacity and authority to enter into a
                contract.
              </p>
              <p>
                It is prohibited to register users who do not have civil
                capacity, as well as users who have been suspended from the
                GEONET INTERNET LIMITED platform, temporarily or definitively,
                without prejudice to the application of applicable legal
                sanctions.
              </p>
              <p>
                Registration must be completed with accurate, updated and true
                information, and the registering parties are committed to
                updating the registered data whenever there is any change in
                them, being civilly and criminally responsible for any
                irregularity concerning this information.
              </p>
              <p>
                It is prohibited to register multiple registrations by the same
                user, and GEONET INTERNET LIMITED holds the right to exclude the
                registrations that are in such condition. Also, you shall not
                register for anyone other than yourself without such
                person&apos;s permission.
              </p>
              <p>
                When you register with GEONET INTERNET LIMITED you must create a
                unique User Name. Concerning this choice of User Name, you shall
                not:
              </p>
              <ol style={{ listStyle: "lower-roman" }}>
                <li>
                  Choose a User Name that is the name of an existing person,
                  with the purpose of impersonating that person;
                </li>
                <li>
                  Choose a User Name that is offensive, aggressive, vulgar,
                  obscene, etc.;
                </li>
                <li>
                  Choose a User Name that violates Copyrights of a person or
                  company other than you without prior and formalised
                  authorisation;
                </li>
                <li>
                  Choose a User Name that is, in any manner, considered
                  unlawful.
                </li>
              </ol>
              <p>
                GEONET INTERNET LIMITED allows its Users to choose an alias or
                username that does not represent the user&apos;s real name,
                subject to the restrictions imposed above. Furthermore, Users
                can change their nickname at any time.
              </p>
              <p>
                GEONET INTERNET LIMITED reserves the right to use all valid
                means available to identify users, as well as to request
                additional data and documents that we deem relevant in order to
                verify the reported data.
              </p>
              <p>
                If any incorrect or untrue data is detected by GEONET INTERNET
                LIMITED, or even if USERS refuse to submit documents when
                requested, GEONET INTERNET LIMITED reserves the right to
                temporarily suspend or cancel the registration without prior
                notice and without prejudice to other measures that may apply.
              </p>
              <p>
                The registration made on our platform is personal and
                non-transferable. It is prohibited to provide a password to
                third parties. The user will access his/her registration using
                an email address and password assigned by him/herself, which
                he/she undertakes not to inform to third parties, being fully
                responsible for the use of his/her registration, whose password
                only he/she must know.
              </p>
              <p>
                In case the user perceives any improper use of his/her
                registration, it is his/her duty to inform GEONET INTERNET
                LIMITED immediately of the fact, through{" "}
                <a href="mailto:info@orbis.social">info@orbis.social</a>. We
                reinforce that the user will be the sole responsible for misuse
                of the registration, since the password used must be of his/her
                exclusive knowledge.
              </p>
              <p>
                GEONET INTERNET LIMITED reserves the right to refuse any request
                for registration and/or to cancel a previously accepted
                registration, in its sole discretion and without prior notice,
                without incurring a fine or penalty in its favour.
              </p>
              <p>
                Places registration must contain complete, updated and accurate
                information about the Place and its services. Misleading
                information will be punished with the cancellation of the
                Place&apos;s account on our Platform. Place Owner agrees that
                any damage caused by misleading content about the Place implies
                no liability, whatsoever, to GEONET INTERNET LIMITED and takes
                full responsibility for the consequences of this misdirection.
              </p>
            </li>
            <li>
              <strong>Conduct Guidelines</strong>
              <p>
                In order to use our services, you agree not to use this service
                for a purpose not described in these Terms of Service. You are
                the sole responsible for your activity and shall abide by all
                applicable laws and regulations. Moreover, if you represent a
                company or business initiative, you shall also abide by any law
                or dispositions regarding advertising, marketing, privacy or
                other aspects applicable to your industry segment/market.
              </p>
              <p>
                It is prohibited to post, share, upload, download, or facilitate
                the distribution of any Content through our Platform, including
                User uploaded content that:
              </p>
              <ol style={{ listStyle: "lower-roman" }}>
                <li>
                  you know is false, untruthful or that you know/believe is
                  misleading to other USERS;
                </li>
                <li>
                  is against applicable law, offensive, aggressive, insulting,
                  pornographic, vulgar, obscene, defamatory, harassing, incites
                  hate speech, violence, or that GEONET INTERNET LIMITED
                  considers, in its sole discretion, as inappropriate;
                </li>
                <li>has an inappropriate use of an Add-to Link;</li>
                <li>
                  contains virus/malware of any kind or that directly and
                  intentionally interferes with our Platform&apos;s software and
                  maintenance;
                </li>
                <li>
                  violates any registered trademark, patent, trade secret, or
                  copyright;
                </li>
                <li>is considered SPAM;</li>
                <li>impersonates an existing person or entity;</li>
                <li>
                  contains information that should not be made public without
                  express consent of another person or entity, for instance,
                  bank account details, ID documents or any other financial
                  data;
                </li>
                <li>is in any manner, unlawful.</li>
              </ol>
              <p>
                Any violation to the items listed above reserves GEONET INTERNET
                LIMITED the right to remove, suspend, edit, block or modify any
                Content, without notice to the USER who uploaded, published or
                shared it.
              </p>
            </li>
            <li>
              <strong>Check-in, Profile and Groups</strong>
              <p>
                When Users go to a Place they have the option to check-in.
                Check-ins are made public for every other User on our Platform.
              </p>
              <p>
                No User can check-in to a Place with the purpose of harming the
                Place.
              </p>
              <p>
                Users may create groups and freely post content, including
                messages to each other, subject to our Conduct Guidelines and
                other provisions of these Terms of Service.
              </p>
              <p>
                Group Admins can delete any post created by a member of their
                group, as well as expel members of their group and block them
                from joining again.
              </p>
              <p>
                GEONET INTERNET LIMITED has the right to delete any Group or
                Place profile at our sole discretion.
              </p>
              <p>
                User&apos;s profile will contain a section of every Group that
                you are a member of. User can choose to make this section public
                or private.
              </p>
              <p>
                User&apos;s profile will contain a section of every Place that
                User follows or checks-in to. User can choose to make this
                section public or private.
              </p>
            </li>
            <li>
              <strong>Place Owners</strong>
              <p>
                Place Owner has the right to buy its profile at GEONET INTERNET
                LIMITED and make hyper-located ads for all Users on our
                Platform.
              </p>
              <p>
                Place Owner should alert GEONET INTERNET LIMITED in case a fake
                profile is created about their Place. They may choose to cancel
                the fake profile&apos;s subscription and replace it with their
                own.
              </p>
            </li>
            <li>
              <strong>Copyright</strong>
              <p>
                All content of the GEONET INTERNET LIMITED platform (design,
                trademarks, logos, products, systems, service names and other
                materials), including programs, databases, images and files is
                the exclusive property of GEONET INTERNET LIMITED, and its use
                by third parties without prior authorisation from GEONET
                INTERNET LIMITED, especially for commercial or economic
                purposes, is prohibited. The violation of such property rights
                will result in the respective indemnification for those
                affected, whether GEONET INTERNET LIMITED, USERS, PLACE OWNERS
                or third parties.
              </p>
              <p>
                The GEONET INTERNET LIMITED Platform, the GEONET INTERNET
                LIMITED content and the content of its USERS may, in whole or
                in part, be protected by copyrights, trademarks and/or by
                Irish, European Union or other applicable legislation. You
                acknowledge and agree that the GEONET INTERNET LIMITED Platform
                and the GEONET INTERNET LIMITED Content, including all
                associated intellectual property rights, are the exclusive
                property of GEONET INTERNET LIMITED and/or its licensors or
                authorised third parties. You shall not remove, alter or conceal
                any copyrights, trademarks, service marks or other proprietary
                rights incorporated or accompanying the GEONET INTERNET LIMITED
                Platform, the content of GEONET INTERNET LIMITED or the content
                of USERS.
              </p>
              <p>
                No one may use, copy, adapt, modify, prepare derivative works,
                distribute, license, sell, transfer, publicly display, publicly
                perform, stream, transmit or otherwise exploit the GEONET
                INTERNET LIMITED Platform or its collective content, except to
                the extent that you own certain USER content or as expressly
                permitted in these Terms. No license or rights are granted by
                implication or otherwise under any intellectual property rights
                owned or controlled by GEONET INTERNET LIMITED or its licensors,
                except for the licenses and rights expressly granted in these
                Terms of Service.
              </p>
            </li>
            <li>
              <strong>Limitation of Liability</strong>
              <p>
                In no event shall GEONET INTERNET LIMITED, its directors,
                administrators, partners, or employees be liable in relation to
                the Platform or Services for:
              </p>
              <ol style={{ listStyle: "lower-roman" }}>
                <li>
                  Ensuring compliance with all laws, rules and regulations that
                  may be applied;
                </li>
                <li>Any direct, indirect or unforeseen damages of any kind;</li>
                <li>
                  Damages for loss of use, profits, data, images, content, or
                  other intangible goods;
                </li>
                <li>
                  Damage caused by unauthorised use, failure to access the
                  application, errors or omissions; or
                </li>
                <li>
                  Judicial or extrajudicial disputes arising from disagreements
                  between the User and Place Owner.
                </li>
              </ol>
              <p>
                All liability of GEONET INTERNET LIMITED, its directors,
                administrators, partners, or employees that, in any manner, may
                arise from User/Place Owner&apos;s use of the app, service,
                content and Platform as a whole, is expressly excluded to the
                fullest extent permitted by law.
              </p>
              <p>
                In any case, if a competent court determines that such liability
                applies, the monetary amount of this liability shall not exceed
                one hundred euros (EUR 100) or the equivalent in the domestic
                currency of the jurisdiction in which this decision arises.
              </p>
              <p>
                <strong>CONCERNING EUROPEAN UNION USERS:</strong>
              </p>
              <p>
                No provision of these Terms of Service may be considered as
                excluding or limiting GEONET INTERNET LIMITED or User liability
                regarding:
              </p>
              <ol style={{ listStyle: "lower-roman" }}>
                <li>
                  Any statutory obligations that cannot be excluded or limited
                  under applicable Irish or EU law;
                </li>
                <li>
                  Fraud, fraudulent misrepresentation, or criminal activities
                  such as theft;
                </li>
                <li>
                  Death or personal injury arising as a result of GEONET
                  INTERNET LIMITED or User&apos;s negligence, as applicable by
                  law.
                </li>
              </ol>
              <p>
                Nothing in these Terms shall affect your statutory rights as a
                consumer under Irish or EU consumer protection law.
              </p>
            </li>
            <li>
              <strong>Alteration and Term Effectiveness</strong>
              <p>
                GEONET INTERNET LIMITED reserves the right to modify these Terms
                of Service at any time in accordance with this provision. If we
                change these Terms, we will post the revised Terms on the GEONET
                INTERNET LIMITED app and update the &quot;Last Updated&quot;
                date at the beginning of these Terms. We will also email you a
                notice of the changes at least 15 (fifteen) days before the
                effective date of the change. If you disagree with the amended
                Terms, you may terminate this agreement with immediate effect.
                We will inform you of your right to terminate the agreement in
                the notification email. If you do not terminate your Agreement
                prior to the effective date of the amended Terms, your continued
                access to or use of the GEONET INTERNET LIMITED Platform
                constitutes acceptance of the amended Terms.
              </p>
              <p>
                This agreement will enter into force for a period of 30 days.
                At the end of this period it will be renewed automatically and
                continuously for subsequent periods of 30 days until the time
                you, User or Place Owner, or GEONET INTERNET LIMITED terminates
                the agreement in accordance with this provision.
              </p>
            </li>
            <li>
              <strong>General Provisions</strong>
              <p>
                If a clause is held to be invalid or unenforceable, it shall be
                terminated or limited in order to preserve the validity of these
                Terms of Service.
              </p>
              <p>
                These Terms of Service are governed by and shall be construed in
                accordance with the laws of Ireland and applicable European
                Union law.
              </p>
            </li>
            <li>
              <strong>Governing Law and Jurisdiction</strong>
              <p>
                GEONET INTERNET LIMITED seeks to have the best possible
                relationship with its Users and Place Owners and prioritises
                conflict resolution in a cordial and efficient manner.
              </p>
              <p>
                These Terms of Service shall be governed by and construed in
                accordance with the laws of Ireland. Any disputes arising out of
                or in connection with these Terms shall be subject to the
                exclusive jurisdiction of the courts of Dublin, Ireland, with
                express waiver of any other, as privileged as it might be.
              </p>
              <p>
                For consumers resident in the European Union, nothing in this
                clause shall deprive you of the protection afforded by the
                mandatory provisions of the law of your country of residence,
                or of your right to bring proceedings in the courts of your
                country of residence.
              </p>
              <p>
                EU consumers may also use the European Commission&apos;s Online
                Dispute Resolution (ODR) platform at{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
                .
              </p>
            </li>
          </ol>
        </div>
        <div className="pt-4 border-t text-sm text-gray-600 space-y-1">
          <p>Contact: <a href="mailto:info@orbis.social">info@orbis.social</a></p>
          <p>GEONET INTERNET LIMITED</p>
          <p>VENTURE HUB, 136 CAPEL STREET, DUBLIN, D01 T2C9, IRELAND</p>
          <p>CRO Number: 793594</p>
        </div>
      </div>
    </main>
  );
};

export default TermsandCondition;
