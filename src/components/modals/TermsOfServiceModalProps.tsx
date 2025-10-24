import React from 'react';
import Modal from './Modal';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      title="Terms of Service"
      onClose={onClose}
      content={
        <>
          <p className="text-sm text-gray-600 mb-6">
            <strong>Effective Date:</strong> October 23, 2025
          </p>

          <div className="space-y-6">
            <section>
              <h3 className="font-semibold text-base mb-3">1. Acceptance of Terms</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                By accessing or using this platform, you agree to be bound by these Terms of Service and our
                Privacy Policy. If you do not agree to these terms, you must not use this platform. Your continued
                use of the service constitutes acceptance of any modifications to these terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">2. Educational Purpose and Service Nature</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This platform is an educational capstone project developed for academic and research purposes.
                The service is provided free of charge and is intended for educational use. We utilize free-tier
                third-party services (including Agora and Firebase) which may experience occasional downtime or
                service limitations. While we strive to address technical issues promptly, availability and
                performance cannot be guaranteed.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">3. Eligibility and Age Requirements</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This platform may be used by individuals of all ages. Users under 13 years of age must have
                parental or guardian consent and supervision to use this service. By using this platform, you
                represent that you meet these eligibility requirements or have obtained necessary parental consent.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">4. User Accounts and Authentication</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                You must authenticate using a valid Google account to access this platform. You are responsible for:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>Maintaining the security of your Google account credentials.</li>
                <li>All activities that occur under your account.</li>
                <li>Ensuring your account information is accurate and current.</li>
              </ul>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">
                We reserve the right to suspend or terminate accounts that violate these Terms of Service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">5. User Roles and Responsibilities</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Users may participate in sessions as either hosts or participants:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li><strong>Hosts:</strong> Create and manage sessions, control session settings, access aggregated
                  facial emotion recognition (FER) data and engagement analytics, utilize interactive whiteboards,
                  and may remove disruptive participants from sessions.</li>
                <li><strong>Participants:</strong> Join sessions via invitation or session code, share audio, video,
                  and screen content, send messages and files through chat, and interact with session features as permitted.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">6. Facial Emotion Recognition (FER) Consent</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This platform utilizes facial emotion recognition technology to enhance emotional awareness and
                engagement during sessions. <strong>By enabling your camera during a session, you explicitly consent
                  to the collection, processing, and storage of FER data</strong>, including emotion type, confidence
                levels, and timestamps. This data is used to generate session analytics and improve platform
                functionality. If you do not consent to FER processing, you must keep your camera disabled throughout
                the session.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">7. Session Limitations</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>Sessions are limited to a maximum duration of 1 hour per session.</li>
                <li>Participant limits may apply based on third-party service constraints.</li>
                <li>There are no restrictions on frequency of use, subject to service availability.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">8. Prohibited Conduct</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>Harassing, threatening, intimidating, or abusing other users.</li>
                <li>Impersonating any person or entity, or falsely representing your affiliation with any person or entity.</li>
                <li>Misusing FER data or attempting to access individual user emotion data without authorization.</li>
                <li>Recording sessions (audio, video, or screen) without explicit consent from all participants.
                  While we cannot control third-party screen recording tools, unauthorized recording is strictly prohibited
                  and may result in account termination.</li>
                <li>Transmitting any content that is unlawful, harmful, threatening, abusive, defamatory, obscene,
                  or otherwise objectionable.</li>
                <li>Uploading files containing viruses, malware, or any other harmful code.</li>
                <li>Attempting to gain unauthorized access to the platform, other user accounts, or connected systems.</li>
                <li>Interfering with or disrupting the platform's functionality or servers.</li>
                <li>Using the platform for any commercial purposes without authorization.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">9. User-Generated Content</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li><strong>Screen Sharing:</strong> Screen-shared content is transmitted in real-time and is not
                  recorded or stored by the platform. Users retain all rights to content they share via screen sharing.</li>
                <li><strong>Chat Messages and Files:</strong> Messages and files shared through Agora Chat are
                  user-controlled and subject to Agora's data handling policies. The platform does not store chat
                  message content, though files may be temporarily stored by Agora.</li>
                <li><strong>Interactive Whiteboards:</strong> Only session hosts may create and use interactive whiteboards.
                  Whiteboard content is ephemeral and not permanently stored.</li>
                <li>You retain ownership of all content you create or share, and you are solely responsible for
                  ensuring you have the necessary rights to share such content.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">10. Moderation and Enforcement</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Session hosts have the authority to remove disruptive or non-compliant participants from their
                sessions. Additionally, we reserve the right to suspend or permanently terminate user accounts
                that violate these Terms of Service. We do not offer automated content moderation or user suspension
                features. Users are encouraged to report violations to session hosts or contact us directly.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">11. Intellectual Property</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This platform, including its code, design, features, and documentation, is the intellectual property
                of the development team. All rights are reserved. You may not copy, modify, distribute, or create
                derivative works based on this platform without explicit permission from the development team.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">12. Third-Party Services</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This platform integrates with third-party services including Firebase (Google) for authentication
                and Agora for real-time communication. Your use of these services is subject to their respective
                terms of service and privacy policies. We are not responsible for the practices or policies of
                these third-party providers.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">13. Disclaimer of Warranties</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                THIS PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, OR NON-INFRINGEMENT. We do not warrant that the platform will be uninterrupted, secure, or
                error-free, or that defects will be corrected. As an educational project utilizing free-tier services,
                we cannot guarantee continuous availability or optimal performance.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">14. Limitation of Liability</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE DEVELOPMENT TEAM, ITS MEMBERS, AND AFFILIATED INSTITUTIONS
                SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
                LOSS OF PROFITS, REVENUE, DATA, OR USE, ARISING OUT OF OR RELATED TO YOUR USE OF THIS PLATFORM, EVEN
                IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. This includes but is not limited to damages
                resulting from service interruptions, data loss, technical errors, or unauthorized access.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">15. Data Privacy and Security</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your use of this platform is also governed by our Privacy Policy, which describes how we collect,
                use, and protect your personal information. While we implement reasonable security measures, no
                internet-based service can guarantee absolute security. You acknowledge and accept the inherent
                risks of transmitting information over the internet.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">16. Modifications to the Service</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any aspect of this platform at any time,
                with or without notice. This includes the right to modify features, impose usage limits, or terminate
                the service entirely upon completion of the academic project. We are not liable for any modifications,
                suspensions, or discontinuations of the service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">17. Changes to These Terms</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We may update these Terms of Service from time to time. The "Effective Date" at the top indicates
                when these terms were last revised. Your continued use of the platform after changes are posted
                constitutes your acceptance of the revised terms. We encourage you to review these terms periodically.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">18. Governing Law and Jurisdiction</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of the Republic
                of the Philippines, without regard to its conflict of law provisions. Any disputes arising from or
                relating to these terms or your use of this platform shall be resolved exclusively in the appropriate
                courts of the Philippines.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">19. Severability</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                If any provision of these Terms of Service is found to be unenforceable or invalid, that provision
                shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall
                remain in full force and effect.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">20. Contact Information</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                If you have questions, concerns, or feedback regarding these Terms of Service, please contact us at:
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Email:</strong> virtusenselspu@gmail.com
              </p>
            </section>

            <section className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic">
                By using this platform, you acknowledge that you have read, understood, and agree to be bound by
                these Terms of Service and our Privacy Policy.
              </p>
            </section>
          </div>
        </>
      }
    />
  );
}