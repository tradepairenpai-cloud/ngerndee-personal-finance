"use client";
import AuthGate from "@/components/auth-gate";
export default function Template({children}:{children:React.ReactNode}) {
  return <AuthGate>{children}</AuthGate>;
}
