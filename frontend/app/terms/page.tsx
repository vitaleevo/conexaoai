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
  title: "Terms of Service | Conexão AI",
  description: "Terms and conditions for using the Conexão AI platform.",
};

export default function TermsPage() {
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
            <BreadcrumbPage>Terms of Service</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="space-y-4">
        <h1 className="font-display text-5xl leading-[0.98] text-foreground sm:text-6xl">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest">
          Last updated: {lastUpdated}
        </p>
      </section>

      <Separator />

      <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-8 prose-li:text-muted-foreground">
        <p>
          Welcome to Conexão AI. By accessing our website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
        </p>

        <h2>1. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on Conexão AI's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>Modify or copy the materials;</li>
          <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>Attempt to decompile or reverse engineer any software contained on Conexão AI's website;</li>
          <li>Remove any copyright or other proprietary notations from the materials; or</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>

        <h2>2. Disclaimer</h2>
        <p>
          The materials on Conexão AI's website are provided on an 'as is' basis. Conexão AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2>3. Limitations</h2>
        <p>
          In no event shall Conexão AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Conexão AI's website, even if Conexão AI or a Conexão AI authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>

        <h2>4. Accuracy of Materials</h2>
        <p>
          The materials appearing on Conexão AI's website could include technical, typographical, or photographic errors. Conexão AI does not warrant that any of the materials on its website are accurate, complete or current. Conexão AI may make changes to the materials contained on its website at any time without notice.
        </p>

        <h2>5. Links</h2>
        <p>
          Conexão AI has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Conexão AI of the site. Use of any such linked website is at the user's own risk.
        </p>

        <h2>6. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of Angola and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
        </p>
      </article>
    </div>
  );
}
