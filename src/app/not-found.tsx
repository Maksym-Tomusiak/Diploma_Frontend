import { FileText, ArrowLeft, SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Сторінку не знайдено | Norma",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 mr-auto text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">На головну</span>
          </Link>
          <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Norma
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 flex flex-1 items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-16 max-w-lg w-full text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-6">
            <SearchX className="h-10 w-10" />
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Сторінку не знайдено
          </h2>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            Вибачте, але сторінка, яку ви шукаєте, не існує або була переміщена. 
            Можливо, ви ввели неправильну адресу або перейшли за застарілим посиланням.
          </p>

          <Link href="/">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Повернутися на головну
            </Button>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-200 mt-auto px-4">
        <p>© 2026 Norma. Всі права захищені.</p>
        <p className="mt-2 text-xs text-slate-500 max-w-[525px] mx-auto leading-relaxed">
          Сервіс розробив: Томусяк Максим за участі &quot;Науково-дослідної лабораторії інноваційних систем моделювання, симуляції та цифрової візуалізації&quot;
        </p>
      </footer>
    </div>
  );
}
