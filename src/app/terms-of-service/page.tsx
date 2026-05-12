import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Умови використання | Norma",
};

export default function TermsOfService() {
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
            Умови використання (Terms of Service)
          </h1>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                1. Прийняття умов
              </h2>
              <p>
                Використовуючи сервіс Norma ("Сервіс"), ви погоджуєтеся з цими
                Умовами використання. Якщо ви не згодні з будь-яким пунктом,
                будь ласка, припиніть використання сервісу.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                2. Опис послуг
              </h2>
              <p>
                Norma надає інструменти для автоматизованої перевірки та
                форматування академічних документів на відповідність стандартам
                ДСТУ та іншим вимогам до оформлення.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                3. Допустиме використання (Що можна робити)
              </h2>
              <p className="mb-2">Як користувач сервісу, ви маєте право:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Використовувати сервіс для перевірки та форматування власних
                  навчальних, наукових та робочих документів.
                </li>
                <li>
                  Інтегрувати сервіс зі своїм обліковим записом Google Drive для
                  зручного доступу до ваших файлів.
                </li>
                <li>
                  Звертатися до служби підтримки при виникненні технічних
                  проблем.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                4. Неприпустиме використання (За що вас можуть забанити)
              </h2>
              <p className="mb-2">
                Ми залишаємо за собою право заблокувати (забанити) ваш обліковий
                запис у разі наступних порушень:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Зловживання API:</strong> Будь-які спроби DDoS-атак,
                  надсилання надмірної кількості запитів до наших серверів або
                  спроби обійти встановлені ліміти (rate limits).
                </li>
                <li>
                  <strong>Шкідливе ПЗ:</strong> Завантаження документів, що
                  містять віруси, трояни, макроси-здирники або інший шкідливий
                  код.
                </li>
                <li>
                  <strong>Несанкціонований доступ:</strong> Спроби злому, пошуку
                  вразливостей (якщо це не узгоджено з нами) або отримання
                  доступу до чужих даних.
                </li>
                <li>
                  <strong>Комерційне використання без дозволу:</strong> Спроби
                  перепродувати послуги нашого сервісу третім особам під
                  виглядом власного продукту (white-labeling) без нашої згоди.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                5. Відповідальність
              </h2>
              <p>
                Сервіс надається "як є". Хоча ми докладаємо максимальних зусиль
                для точного форматування за ДСТУ,
                <strong>
                  остаточна відповідальність за зміст та правильність оформлення
                  документа лежить на користувачі.
                </strong>
                Ми рекомендуємо завжди переглядати відформатований документ
                перед його подачею в навчальний заклад.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                6. Зміни до умов
              </h2>
              <p>
                Ми залишаємо за собою право оновлювати ці Умови використання.
                Продовжуючи користуватися сервісом після внесення змін, ви
                автоматично погоджуєтеся з новою редакцією умов.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-200 mt-12 px-4">
        <p>© 2026 Norma. Всі права захищені.</p>
        <p className="mt-2 text-xs text-slate-500 max-w-[525px] mx-auto leading-relaxed">
          Сервіс розробив: Томусяк Максим за участі &quot;Науково-дослідної лабораторії інноваційних систем моделювання, симуляції та цифрової візуалізації&quot;
        </p>
      </footer>
    </div>
  );
}
