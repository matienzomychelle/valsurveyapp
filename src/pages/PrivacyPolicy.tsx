import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import valenzuelaSeal from "@/assets/valenzuela-seal.png";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-4 mb-8">
          <img src={valenzuelaSeal} alt="City of Valenzuela Seal" className="w-16 h-16" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground">City Government of Valenzuela ARTA CSS System — Last Updated: January 2025</p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              The City Government of Valenzuela is committed to protecting the privacy and security of all personal information collected through the ARTA-Compliant Customer Satisfaction Survey (CSS) System. This Privacy Policy explains how we collect, use, store, and protect your information in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173) and its implementing rules and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Basic Contact Information:</strong> Name, email address, and age range</li>
              <li><strong>Service Information:</strong> Type of service availed, client type (Citizen, Business, Government), and region of residence</li>
              <li><strong>Feedback Data:</strong> Responses to ARTA-compliant Customer Satisfaction Survey questions (CC1-CC3 and SQD0-SQD8)</li>
              <li><strong>Technical Data:</strong> Device type, browser information, IP address, and submission timestamp</li>
              <li><strong>Optional Information:</strong> Additional comments, suggestions, or requests provided voluntarily</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your information is used exclusively for the following legitimate purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Measuring and improving the quality of government services</li>
              <li>Complying with the Anti-Red Tape Authority (ARTA) reporting requirements</li>
              <li>Identifying service delivery bottlenecks and areas for improvement</li>
              <li>Generating aggregated statistical reports for policy-making</li>
              <li>Responding to your specific concerns or requests when provided</li>
              <li>Ensuring accountability and transparency in government operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security and Protection</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement comprehensive security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Encryption:</strong> All data is encrypted during transmission and storage</li>
              <li><strong>Access Controls:</strong> Only authorized personnel have access to survey responses</li>
              <li><strong>Secure Infrastructure:</strong> Data is stored on secure government servers with regular backups</li>
              <li><strong>Audit Trails:</strong> All access to personal data is logged and monitored</li>
              <li><strong>Regular Reviews:</strong> Security protocols are reviewed and updated regularly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Survey responses are retained for a period of two (2) years from the date of submission, or as required by ARTA regulations and government record-keeping policies. After this period, data may be archived or anonymized for historical and statistical purposes. You may request deletion of your data before the retention period by contacting our Data Protection Officer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Sharing of Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, trade, or share your personal information with third parties except:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>When required by law or court order</li>
              <li>With the Anti-Red Tape Authority (ARTA) for compliance reporting (anonymized/aggregated data only)</li>
              <li>With other government agencies for service improvement purposes, with proper data sharing agreements</li>
              <li>With your explicit written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Data Privacy Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under the Data Privacy Act of 2012, you have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Right to be Informed:</strong> You have the right to know how your data is being processed</li>
              <li><strong>Right to Access:</strong> You may request access to your submitted survey responses</li>
              <li><strong>Right to Rectification:</strong> You may request correction of inaccurate information</li>
              <li><strong>Right to Erasure:</strong> You may request deletion of your data under certain circumstances</li>
              <li><strong>Right to Data Portability:</strong> You may request a copy of your data in a commonly used format</li>
              <li><strong>Right to Object:</strong> You may object to certain types of data processing</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise any of these rights, please contact our Data Protection Officer using the contact information below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground leading-relaxed">
              This system uses minimal cookies and local storage to ensure proper functionality and to prevent duplicate submissions. These technologies do not track your browsing behavior outside of this application. Session data is stored locally on your device and is automatically cleared when you close your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              This survey system is intended for individuals 18 years of age or older. We do not knowingly collect personal information from minors. If we become aware that a minor has submitted a survey, we will take steps to delete such information. If you are a parent or guardian and believe your child has submitted a survey, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify users of any material changes by posting the updated policy on this platform with a revised "Last Updated" date. Your continued use of the system after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Information</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p className="font-semibold text-foreground">Data Protection Officer</p>
              <p>Information and Communications Technology Office (ICTO)</p>
              <p>City Government of Valenzuela</p>
              <p>Valenzuela City Hall, MacArthur Highway, Malinta, Valenzuela City</p>
              <p className="mt-4">Email: dpo@valenzuela.gov.ph</p>
              <p>Phone: (02) 8292-1405 local 1234</p>
              <p className="mt-4">
                For complaints or concerns regarding data privacy, you may also file a complaint with the National Privacy Commission at privacy.gov.ph
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Consent</h2>
            <p className="text-muted-foreground leading-relaxed">
              By submitting the Customer Satisfaction Survey, you acknowledge that you have read, understood, and agree to this Privacy Policy. You consent to the collection, use, and processing of your personal information as described herein.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
