import { initAnalytics } from "@/services/analytics";
import { ReactNode, useEffect } from "react";

export default function AnalyticsProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    initAnalytics(); // awaited internally, errors caught
  }, []);

  return <>{children}</>;
}
