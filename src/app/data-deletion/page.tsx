import { FileText, ArrowLeft, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Видалення даних | Norma",
};

export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
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
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <Trash2 className="h-6 w-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Видалення даних користувача
            </h1>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <p className="text-lg">
                Ми цінуємо вашу приватність і надаємо повний контроль над вашими
                особистими даними. Якщо ви бажаєте видалити свій обліковий запис
                та всі пов'язані з ним дані з сервісу Norma, виконайте наведені
                нижче кроки.
              </p>
            </section>

            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                Крок 1: Відкликання доступу в Google
              </h2>
              <p className="mb-4">
                Оскільки ми використовуємо Google OAuth для авторизації, спершу
                варто відкликати доступ нашої програми до вашого облікового
                запису Google:
              </p>
              <ol className="list-decimal pl-5 space-y-2 mb-4 font-medium text-slate-700">
                <li>
                  Перейдіть до налаштувань безпеки вашого акаунту Google:{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Додатки, які мають доступ до вашого облікового запису
                  </a>
                  .
                </li>
                <li>
                  У списку додатків знайдіть <strong>Norma</strong>.
                </li>
                <li>
                  Натисніть на додаток і виберіть опцію{" "}
                  <strong>Видалити доступ</strong> (Remove access).
                </li>
              </ol>
            </section>

            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                Крок 2: Видалення даних з наших серверів
              </h2>
              <p className="mb-4">
                Щоб назавжди видалити всі ваші дані (історію перевірок, email,
                токени) з наших баз даних, ви можете скористатися одним із
                способів:
              </p>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Спосіб А: Звернення до підтримки
                  </h3>
                  <p className="text-sm">
                    Надішліть нам запит на адресу{" "}
                    <strong>maxtomusiak315@gmail.com</strong> (або вашу
                    контактну адресу) з електронної пошти, пов'язаної з вашим
                    акаунтом. Вкажіть у темі листа "Видалення акаунту". Ваші
                    дані будуть видалені протягом 48 годин.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-red-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Спосіб Б: Самостійне видалення (Незабаром)
                  </h3>
                  <p className="text-sm mb-3">
                    Найближчим часом ми додамо кнопку автоматичного видалення
                    профілю безпосередньо у вашому особистому кабінеті в
                    налаштуваннях.
                  </p>
                </div>
              </div>
            </section>

            <section className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-800 text-sm">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">
                  Що відбувається після видалення?
                </p>
                <p>
                  Ваша електронна адреса, історія авторизацій та будь-які логі
                  будуть назавжди стерті з нашої бази даних. Цю дію неможливо
                  скасувати. Якщо ви захочете скористатися сервісом знову, вам
                  доведеться зареєструватися заново.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-200 mt-12 px-4">
        <p>© 2026 Norma. Всі права захищені.</p>
        <p className="mt-2 text-xs text-slate-400 max-w-[525px] mx-auto leading-relaxed">
          Сервіс розробив: Томусяк Максим за участі &quot;Науково-дослідної лабораторії інноваційних систем моделювання, симуляції та цифрової візуалізації&quot;
        </p>
      </footer>
    </div>
  );
}
