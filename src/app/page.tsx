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
              Norma
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Можливості
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Як це працює
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Питання та відповіді
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoading &&
              (isAuthenticated ? (
                <>
                  <Link
                    href={user?.role === UserRole.ADMIN ? "/admin" : "/app"}
                  >
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
                      {user?.role === UserRole.ADMIN
                        ? "До панелі адміна"
                        : "До програми"}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Вийти
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      Увійти
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
                      Почати роботу
                    </Button>
                  </Link>
                </>
              ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden"
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
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
            <a
              href="#features"
              className="block text-sm font-medium text-slate-600"
            >
              Можливості
            </a>
            <a
              href="#how-it-works"
              className="block text-sm font-medium text-slate-600"
            >
              Як це працює
            </a>
            <a href="#faq" className="block text-sm font-medium text-slate-600">
              Питання та відповіді
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
                          ? "До панелі адміна"
                          : "До програми"}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Вийти
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                      >
                        Увійти
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full justify-center bg-blue-600">
                        Почати роботу
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
                Автоматичне форматування{" "}
                <span className="text-blue-600">академічних робіт</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Миттєво приведіть свою наукову роботу у відповідність до
                стандартів ДСТУ. Заощаджуйте години на ручному форматуванні та
                гарантуйте відповідність нормативному контролю.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/app">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base shadow-sm"
                  >
                    Почати безкоштовно
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 h-12 px-8 text-base"
                  >
                    Дізнатися більше
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
                <p>Нам довіряють понад 1000 студентів та дослідників</p>
              </div>
            </div>

            {/* Right Visual - Interactive App Mockup */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none transform perspective-1000 sm:rotate-y-[-5deg] sm:rotate-x-[2deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out mt-8 lg:mt-0">
              <div className="relative rounded-xl border border-slate-200/60 bg-slate-50 shadow-2xl overflow-hidden h-[380px] sm:h-auto sm:aspect-[4/3] flex flex-col">
                {/* Mockup Header (macOS style) */}
                <div className="h-10 bg-slate-100/80 backdrop-blur border-b border-slate-200 flex items-center px-3 sm:px-4 gap-2">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400"></div>
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400"></div>
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="mx-auto flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1 bg-white rounded-md border border-slate-200 text-[10px] sm:text-xs text-slate-500 shadow-sm max-w-[140px] sm:max-w-xs">
                    <FileText className="h-3 w-3 shrink-0" />
                    <span className="truncate">Курсова_робота_фінал.docx</span>
                  </div>
                  <div className="w-8 sm:w-10 shrink-0"></div>{" "}
                  {/* Spacer for symmetry */}
                </div>

                {/* Mockup Body */}
                <div className="flex flex-1 overflow-hidden p-3 sm:p-4 gap-4">
                  {/* Left Sidebar (Issues) - Hidden on mobile */}
                  <div className="hidden sm:flex w-1/3 flex-col gap-3">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Знайдені помилки
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-red-600">
                          Шрифт
                        </span>
                        <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                          Стор. 2
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate">
                        Знайдено Arial (вимагається Times New Roman)
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-amber-700">
                          Відступ
                        </span>
                        <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                          Стор. 5
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        Міжрядковий інтервал 1.15 замість 1.5
                      </p>
                    </div>

                    <div className="mt-auto pt-2">
                      <div className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 text-xs font-medium py-2 rounded-md text-center cursor-pointer transition-colors">
                        Переглянути звіт
                      </div>
                    </div>
                  </div>

                  {/* Main Document Area */}
                  <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-6 overflow-hidden relative flex flex-col">
                    {/* Fake Document Content */}
                    <div className="w-3/4 h-4 sm:h-5 bg-slate-200 rounded mb-4 sm:mb-6"></div>

                    <div className="space-y-2.5 sm:space-y-3 flex-1">
                      <div className="w-full h-2 sm:h-2.5 bg-slate-100 rounded"></div>
                      <div className="w-full h-2 sm:h-2.5 bg-slate-100 rounded"></div>
                      <div className="w-5/6 h-2 sm:h-2.5 bg-slate-100 rounded"></div>

                      {/* Error Highlight 1 */}
                      <div className="relative pt-1 pb-1 my-2">
                        <div className="absolute -inset-1 sm:-inset-1.5 bg-red-50 rounded-md border border-red-200"></div>
                        <div className="w-full h-2 sm:h-2.5 bg-slate-400/60 rounded relative z-10"></div>
                        <div className="w-4/5 h-2 sm:h-2.5 bg-slate-400/60 rounded relative z-10 mt-1.5 sm:mt-2"></div>
                      </div>

                      {/* Error Highlight 2 */}
                      <div className="relative pt-1 pb-1 my-3 sm:my-4">
                        <div className="absolute -inset-1 sm:-inset-1.5 bg-amber-50 rounded-md border border-amber-200"></div>
                        <div className="w-full h-2 sm:h-2.5 bg-slate-300 rounded relative z-10"></div>
                        <div className="w-2/3 h-2 sm:h-2.5 bg-slate-300 rounded relative z-10 mt-1.5 sm:mt-2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Status */}
                <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white backdrop-blur px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 border border-slate-700/50 transform sm:translate-y-2 opacity-95">
                  <div className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-500"></span>
                  </div>
                  <span className="text-[10px] sm:text-sm font-medium tracking-wide whitespace-nowrap">
                    Аналіз форматування...
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
              Все необхідне для ідеальних документів
            </h2>
            <p className="text-lg text-slate-600">
              Зосередьтеся на дослідженні, а не на полях та шрифтах. Ми
              автоматично подбаємо про технічні вимоги.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6 text-blue-600" />,
                title: "Інтеграція з Google Docs",
                desc: "Легко підключайте свій Диск та форматуйте документи прямо без завантаження.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
                title: "Перевірка помилок",
                desc: "Автоматичне виявлення невідповідностей шрифтів, неправильних інтервалів та помилок у цитуванні.",
              },
              {
                icon: <LayoutTemplate className="h-6 w-6 text-blue-600" />,
                title: "Відповідність стандартам",
                desc: "Суворе доотримання ДСТУ та інституційних вимог до дисертацій та робіт.",
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

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 bg-white border-b border-slate-100"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Три прості кроки до ідеальної роботи
            </h2>
            <p className="text-lg text-slate-600">
              Ми спростили процес форматування до мінімуму. Все, що вам потрібно
              — це ваш документ.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              {
                step: "01",
                title: "Оберіть документ",
                desc: "Авторизуйтеся через Google та оберіть потрібний документ прямо з вашого Drive або завантажте .docx файл.",
              },
              {
                step: "02",
                title: "Виберіть шаблон",
                desc: "Оберіть стандарт ДСТУ або налаштуйте власні параметри: поля, міжрядковий інтервал та шрифти.",
              },
              {
                step: "03",
                title: "Отримайте результат",
                desc: "Натисніть 'Застосувати формат' і за лічені секунди ваш документ буде повністю відповідати всім вимогам.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center relative group">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold mb-6 shadow-lg shadow-blue-200 transition-transform group-hover:scale-110">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-12">
            Часті запитання
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Чи сумісно це з Microsoft Word?",
                a: "Цей сервіс працює як з Google Docs, так і з фізичними .docx файлами.",
              },
              {
                q: "Чи мої дані залишаються конфіденційними?",
                a: "Так. Ми використовуємо офіційні API Google для доступу до ваших документів лише за вашим дозволом. Ми не зберігаємо зміст ваших документів.",
              },
              {
                q: "Чи можу я налаштувати правила форматування?",
                a: "Звісно. Ви можете обрати стандартні пресети або вручну налаштувати поля, шрифти та інтервали в робочій області.",
              },
              {
                q: "Чи є безкоштовний період?",
                a: "Так, основні функції форматування безкоштовні. Гості мають ліміт на кількість перевірок на день.",
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
              Norma
            </span>
          </div>

          <p className="text-sm text-slate-400">
            © 2026 Norma. Всі права захищені.
          </p>

          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-end mt-4 md:mt-0">
            <Link
              href="/privacy-policy"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Політика конфіденційності
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Умови використання
            </Link>
            <Link
              href="/data-deletion"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Видалення даних
            </Link>
            <a
              href="mailto:maxtomusiak315@gmail.com"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Контакти
            </a>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-center border-t border-slate-800 pt-8">
          <p className="text-xs text-slate-500 max-w-[525px] mx-auto leading-relaxed">
            Сервіс розробив: Томусяк Максим за участі &quot;Науково-дослідної
            лабораторії інноваційних систем моделювання, симуляції та цифрової
            візуалізації&quot;
          </p>
        </div>
      </footer>
    </div>
  );
}
