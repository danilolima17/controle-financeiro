import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return <AuthShell>{children}</AuthShell>;
}
