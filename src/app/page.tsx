"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Zap,
  ShieldCheck,
  LayoutTemplate,
  Menu,
  X,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              FormatStand
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoading &&
              (isAuthenticated ? (
                <>
                  <Link
                    href={user?.role === UserRole.ADMIN ? "/admin" : "/app"}
                  >
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
                      {user?.role === UserRole.ADMIN
                        ? "Go to Admin"
                        : "Go to App"}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
            <a
              href="#features"
              className="block text-sm font-medium text-slate-600"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-sm font-medium text-slate-600"
            >
              How it Works
            </a>
            <a href="#faq" className="block text-sm font-medium text-slate-600">
              FAQ
            </a>
            <div className="pt-4 flex flex-col gap-2">
              {!isLoading &&
                (isAuthenticated ? (
                  <>
                    <Link
                      href={user?.role === UserRole.ADMIN ? "/admin" : "/app"}
                    >
                      <Button className="w-full justify-center bg-blue-600">
                        {user?.role === UserRole.ADMIN
                          ? "Go to Admin"
                          : "Go to App"}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full justify-center bg-blue-600">
                        Get Started
                      </Button>
                    </Link>
                  </>
                ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-6">
                Automatic Formatting for{" "}
                <span className="text-blue-600">Academic Papers</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Ensure your scientific work meets DSTU standards instantly. Save
                hours of manual formatting and guarantee compliance with norm
                control.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/app">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base shadow-sm"
                  >
                    Start Formatting Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 h-12 px-8 text-base"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>Trusted by 1000+ students & researchers</p>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-lg border border-slate-200 bg-white shadow-2xl overflow-hidden aspect-[4/3]">
                {/* Placeholder for hero image */}
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">Document Preview</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/5 to-transparent pointer-events-none"></div>

                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur border border-slate-200 p-4 rounded-md shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">
                      Formatting complete
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    100% Match
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-slate-50 border-y border-slate-200"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Everything you need for perfect documents
            </h2>
            <p className="text-lg text-slate-600">
              Focus on your research, not margins and fonts. We handle the
              technical requirements automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6 text-blue-600" />,
                title: "Google Docs Integration",
                desc: "Seamlessly connect your Drive and format documents directly without downloading.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
                title: "Error Verification",
                desc: "Automatic detection of font mismatches, incorrect spacing, and citation errors.",
              },
              {
                icon: <LayoutTemplate className="h-6 w-6 text-blue-600" />,
                title: "Standard Compliance",
                desc: "Strict adherence to DSTU and institutional guidelines for thesis and papers.",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Is it compatible with Microsoft Word?",
                a: "Currently we focus on Google Docs for seamless cloud integration, but you can export the result to Word format.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. We use Google's official APIs to access your documents only when you grant permission. We do not store your document content.",
              },
              {
                q: "Can I customize the formatting rules?",
                a: "Absolutely. You can choose from standard presets or manually adjust margins, fonts, and spacing in the workspace.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, the basic formatting features are free to use for your first 3 documents.",
              },
            ].map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-slate-200"
              >
                <AccordionTrigger className="text-slate-900 hover:text-blue-600 hover:no-underline font-medium text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-slate-900">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              FormatStand
            </span>
          </div>

          <p className="text-sm text-slate-400">
            © 2024 FormatStand. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
