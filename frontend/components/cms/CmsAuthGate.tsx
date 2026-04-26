"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

export default function CmsAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasAccessToken = Boolean(Cookies.get("cms_access_token"));
    const hasRefreshToken = Boolean(Cookies.get("cms_refresh_token"));

    if (!hasAccessToken && !hasRefreshToken) {
      const redirectTo = pathname && pathname !== "/cms" ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/cms/login${redirectTo}`);
      return;
    }

    setIsReady(true);
  }, [pathname, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
        Verificando sessão editorial...
      </div>
    );
  }

  return <>{children}</>;
}
