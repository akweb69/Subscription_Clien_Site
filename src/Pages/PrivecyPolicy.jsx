import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 prose prose-slate prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Privacy Policy
            </h1>
            <p className="text-gray-600 mb-8">
                Last updated: February 03, 2026
            </p>

            <p>
                MasterDesk we operates the website and/or mobile application masterdesk (the "Service").
            </p>

            <p>
                This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our Service and the choices you have associated with that data.
            </p>

            <p>
                We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>

            <hr className="my-8 border-gray-200" />

            <h2>Information We Collect</h2>

            <h3>Types of Data Collected</h3>
            <ul>
                <li>
                    <strong>Personal Data</strong>
                    <br />
                    While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
                </li>
                <ul className="list-disc pl-6 mt-2">
                    <li>Phone number</li>
                    <li>WhatsApp / Telegram links or identifiers (if provided by you)</li>
                    <li>Email address (if collected)</li>
                    <li>Usage Data</li>
                </ul>

                <li className="mt-4">
                    <strong>Usage Data</strong>
                    <br />
                    We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Usage Data").
                </li>
                <ul className="list-disc pl-6 mt-2">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Pages visited, time and date of visit</li>
                    <li>Time spent on pages</li>
                    <li>Other diagnostic data</li>
                </ul>
            </ul>

            <h2>How We Use Your Data</h2>
            <p>We use the collected data for various purposes:</p>
            <ul className="list-disc pl-6">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features (if any)</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve the Service</li>
                <li>To monitor the usage of the Service</li>
                <li>To detect, prevent and address technical issues</li>
            </ul>

            <h2>Legal Basis for Processing Personal Data (GDPR / Relevant Laws)</h2>
            <p>
                If you are from the European Economic Area (EEA), MasterDesk's legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Data we collect and the specific context in which we collect it.
            </p>
            <p>We may process your Personal Data because:</p>
            <ul className="list-disc pl-6">
                <li>We need to perform a contract with you</li>
                <li>You have given us permission to do so</li>
                <li>The processing is in our legitimate interests and it's not overridden by your rights</li>
                <li>To comply with the law</li>
            </ul>

            <h2>Retention of Data</h2>
            <p>
                We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>

            <h2>Transfer of Data</h2>
            <p>
                Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
            </p>
            <p>
                If you are located outside Bangladesh and choose to provide information to us, please note that we transfer the data, including Personal Data, to Bangladesh and process it there.
            </p>

            <h2>Disclosure of Data</h2>
            <h3>Business Transaction</h3>
            <p>
                If we are involved in a merger, acquisition or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.
            </p>

            <h3>Disclosure for Law Enforcement</h3>
            <p>
                Under certain circumstances, we may be required to disclose your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).
            </p>

            <h2>Security of Data</h2>
            <p>
                The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>

            <h2>Your Data Protection Rights (GDPR / Relevant Laws)</h2>
            <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights. We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.</p>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6">
                <li>Access, update or delete the information we have on you</li>
                <li>Rectification</li>
                <li>Object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
            </ul>

            <h2>Third-Party Services</h2>
            <p>
                Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
            </p>
            <p>
                We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.
            </p>

            <h2>Children's Privacy</h2>
            <p>
                Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please contact us:
            </p>

            <p className="mt-10 text-sm text-gray-500">
                Thank you for trusting us with your information.
            </p>
        </div>
    );
};

export default PrivacyPolicy;