import { AuthShell } from "@/components/auth/auth-shell";

export default function SignupLayout({ children }: LayoutProps<"/signup">) {
  return <AuthShell>{children}</AuthShell>;
}
