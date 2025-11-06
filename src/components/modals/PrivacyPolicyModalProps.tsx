import React from 'react';
import Modal from './Modal';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      title="Privacy Policy"
      onClose={onClose}
      content={
        <>
          <p className="text-sm text-gray-600 mb-6">
            <strong>Effective Date:</strong> October 23, 2025
          </p>

          <div className="space-y-6 text-justify">
            <section>
              <h3 className="font-semibold text-base mb-3">1. Introduction</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This Privacy Policy describes how this platform collects, uses, and protects your information.
                This platform is an educational project developed for academic purposes. We are committed to
                maintaining emotional safety, transparency, and user control while handling your data responsibly.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">2. Information We Collect</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                We collect the following information when you use this platform:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li><strong>Authentication Information:</strong> Google user ID (UID) and display name through Firebase Authentication.</li>
                <li><strong>Session Metadata:</strong> Session identifiers, timestamps, user roles, and aggregated emotional data.</li>
                <li><strong>Facial Emotion Recognition (FER) Data:</strong> Emotion type, confidence level, timestamp, and associated user ID. This data is collected automatically when you join a session with your camera enabled and is stored for analytics and research purposes.</li>
                <li><strong>Shared Files:</strong> Files transmitted through Agora Chat are subject to Agora's privacy policies and data handling practices.</li>
                <li><strong>What We Don't Store:</strong> We do not record or store video streams, audio streams, or chat message content.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">3. How We Use Your Information</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                The information we collect is used for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>To authenticate users and manage session access and roles.</li>
                <li>To optimize meeting layouts and provide real-time engagement indicators.</li>
                <li>To generate session-level analytics and emotional insights for hosts through our records page.</li>
                <li>To facilitate emotionally aware communication experiences.</li>
                <li>For educational research and platform improvement purposes.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">4. Data Storage and Security</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li><strong>Storage Location:</strong> Data is stored securely in Google Cloud Firestore with industry-standard access controls and encryption.</li>
                <li><strong>Data Retention:</strong> Session metadata and FER data are retained indefinitely for research and educational purposes.</li>
                <li><strong>International Transfers:</strong> As we use cloud-based services, your data may be processed and stored in servers located outside the Philippines.</li>
                <li><strong>Access Controls:</strong> FER data is used only within our system. Session hosts can access aggregated emotional analytics at the session level, but individual user emotion records remain private.</li>
                <li>We implement reasonable security measures to protect your information from unauthorized access or disclosure.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">5. Third-Party Services</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This platform integrates with Firebase (Google) for authentication and Agora for real-time
                communication and file sharing. These services operate under their respective privacy policies.
                We encourage you to review their policies independently.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">6. Children's Privacy</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This platform may be used by individuals of ages 13+, with appropriate parental
                or guardian supervision. We do not knowingly collect personal information from children beyond what
                is necessary for Google Authentication and session participation. Parents and guardians are responsible
                for monitoring their children's use of this platform.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">7. Your Privacy Rights</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Under applicable data protection laws, including the Philippine Data Privacy Act of 2012, you have
                the following rights:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li><strong>Right to Access:</strong> Request information about the personal data we hold about you.</li>
                <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete information.</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data, subject to our educational research purposes and legal obligations.</li>
                <li><strong>Right to Object:</strong> Object to the processing of your personal data under certain circumstances.</li>
              </ul>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">
                To exercise these rights, please contact us at <strong>virtusenselspu@gmail.com</strong>.
                We will respond to your request in a reasonable timeframe.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">8. Educational Purpose Disclaimer</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This platform is developed as an educational capstone project. While we take reasonable measures
                to protect your data, please be aware that this is an academic project and may not have the same
                level of resources as commercial services. Use of this platform is voluntary and at your own discretion.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">9. Changes to This Privacy Policy</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. The "Effective Date" at the top indicates
                when this policy was last revised. Continued use of this platform after changes constitutes
                acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">10. Contact Information</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices,
                please contact us at:
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Email:</strong> virtusenselspu@gmail.com
              </p>
            </section>
          </div>
        </>
      }
    />
  );
}