import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Input } from "./../components/ui/input";
import "./globals.css";
import DropDown from "@/components/dropdown";
import Dropfile from "@/components/drop-file";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              <div className="flex flex-col gap-x-20 gap-y-10 max-w-6xl p-5">
                <h1 className="text-4xl text-center">TITLE A LA BA SA QA NA TA</h1>
                <div className="w-full flex justify-center items-center gap-10">
                  <div className="w-3/12">
                    Variants
                    <Input className="w-full" type="number" min={1}></Input>
                  </div>
                  <div className="w-1/2">
                    Vulnerability type
                    <Input className="w-full"></Input>
                  </div>
                  <div className="w-3/12">
                    <DropDown label="Platform" array={["Windows", "Linux"]} className="w-full"></DropDown>
                  </div>
                </div>
                <Input className="w-full" type="number" min={1}></Input>
                <Dropfile></Dropfile>
                {/* <div className="max-w-5xl my-5">
                  <div className="inline-block w-full h-30 bg-zinc-500 p-10 rounded-xl border-2 border-white border-dashed">
                    backdrop
                  </div>
                </div> */}
                {children}
              </div>

              

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
