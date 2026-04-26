import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy | Conexão AI",
  description: "How we handle your data and protect your privacy at Conexão AI.",
};

export default function PrivacyPage() {
  const lastUpdated = "April 26, 2026";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="space-y-4">
        <h1 className="font-display text-5xl leading-[0.98] text-foreground sm:text-6xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest">
          Last updated: {lastUpdated}
        </p>
      </section>

      <Separator />

      <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-8 prose-li:text-muted-foreground">
        <p>
          At Conexão AI, we prioritize the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Conexão AI and how we use it.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, such as when you subscribe to our newsletter, contact us through our forms, or interact with our content. This may include:
        </p>
        <ul>
          <li>Name and email address for newsletter subscriptions.</li>
          <li>Log files (IP addresses, browser type, ISP, date/time stamp).</li>
          <li>Usage data on how you interact with our editorial content.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect in various ways, including to:
        </p>
        <ul>
          <li>Provide, operate, and maintain our website.</li>
          <li>Improve, personalize, and expand our website experience.</li>
          <li>Understand and analyze how you use our website.</li>
          <li>Develop new products, services, features, and functionality.</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
          <li>Send you emails if you have opted-in to our newsletter.</li>
          <li>Find and prevent fraud.</li>
        </ul>

        <h2>3. Cookies and Web Beacons</h2>
        <p>
          Like any other website, Conexão AI uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h2>4. Third Party Privacy Policies</h2>
        <p>
          Conexão AI's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
        </p>

        <h2>5. GDPR Data Protection Rights</h2>
        <p>
          We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
        </p>
        <ul>
          <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
          <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
          <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
          <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
        </ul>

        <h2>6. Contact Us</h2>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at privacy@conexao.ai.
        </p>
      </article>
    </div>
  );
}
