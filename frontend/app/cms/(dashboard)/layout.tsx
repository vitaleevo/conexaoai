import CmsSidebar from "@/components/cms/CmsSidebar";
import CmsHeader from "@/components/cms/CmsHeader";
import CmsAuthGate from "@/components/cms/CmsAuthGate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CmsAuthGate>
      <div className="flex h-screen w-full bg-slate-50 font-sans antialiased text-slate-900">
        <CmsSidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <CmsHeader />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </CmsAuthGate>
  );
}
