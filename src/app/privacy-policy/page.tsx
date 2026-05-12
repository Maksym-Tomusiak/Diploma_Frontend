import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Політика конфіденційності | Norma",
};

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
            Політика конфіденційності
          </h1>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                1. Вступ
              </h2>
              <p>
                Ця Політика конфіденційності пояснює, як сервіс Norma ("ми",
                "наш", "сервіс") збирає, використовує, зберігає та захищає вашу
                особисту інформацію під час використання нашого веб-додатку.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                2. Які дані ми отримуємо через OAuth
              </h2>
              <p className="mb-2">
                Коли ви авторизуєтесь у нашому сервісі через Google, ми
                отримуємо доступ до такої інформації:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Ваша електронна адреса (Email)</strong>
                </li>
                <li>
                  <strong>Ваше ім'я та прізвище</strong>
                </li>
                <li>
                  <strong>Ваш аватар (фото профілю)</strong>
                </li>
                <li>
                  <strong>Доступ до ваших документів Google Docs</strong> (лише
                  до тих, які ви самостійно обираєте для перевірки чи
                  форматування через наш сервіс).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                3. Для чого ми використовуємо ці дані
              </h2>
              <p className="mb-2">
                Зібрана інформація використовується виключно для забезпечення
                роботи сервісу:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Email та профіль:</strong> Для створення вашого
                  облікового запису, авторизації в системі та персоналізації
                  досвіду (наприклад, відображення вашого імені).
                </li>
                <li>
                  <strong>Доступ до документів:</strong> Для виконання основної
                  функції сервісу — аналізу, перевірки на відповідність ДСТУ та
                  автоматичного форматування тексту. Ми отримуємо доступ{" "}
                  <em>лише</em> до файлів, які ви явно дозволили обробляти.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                4. Як ми зберігаємо ваші дані
              </h2>
              <p>
                Ваші персональні дані (email, токени доступу) зберігаються у
                зашифрованому вигляді в нашій захищеній базі даних. Ми
                використовуємо сучасні стандарти шифрування та безпеки.
                <strong>
                  Ми НЕ зберігаємо вміст ваших Google Документів.
                </strong>{" "}
                Документи завантажуються в пам'ять сервера лише на час перевірки
                та форматування, після чого негайно видаляються з нашої системи.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                5. Передача даних третім особам
              </h2>
              <p>
                Ми поважаємо вашу конфіденційність.{" "}
                <strong>
                  Ми ніколи не продаємо, не здаємо в оренду та не передаємо ваші
                  персональні дані{" "}
                </strong>{" "}
                чи вміст ваших документів третім особам, рекламним компаніям або
                дата-брокерам.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                6. Ваші права та видалення даних
              </h2>
              <p>
                Ви маєте повне право в будь-який момент відкликати доступ нашого
                сервісу до вашого облікового запису Google. Ви також маєте право
                вимагати повного видалення вашого акаунту та всіх пов'язаних з
                ним даних з наших серверів. Детальні інструкції щодо цього ви
                можете знайти на сторінці{" "}
                <Link
                  href="/data-deletion"
                  className="text-blue-600 hover:underline"
                >
                  Видалення даних користувача
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                7. Зміни до політики
              </h2>
              <p>
                Ми можемо час від часу оновлювати цю Політику конфіденційності.
                У разі суттєвих змін ми повідомимо вас про це на нашому сайті.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-200 mt-12">
        <p>© 2026 Norma. Всі права захищені.</p>
      </footer>
    </div>
  );
}
