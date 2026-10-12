import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Dashboard } from "@/components/Dashboard"
import { DataManager } from "@/components/DataManager"
import { useDashboard } from "@/lib/useDashboard"
import { UtensilsCrossed, Sparkles } from "lucide-react"

function MainLayout() {
  const { hourlyRate, setHourlyRate } = useDashboard()

  return (
    <div className="min-h-screen bg-stone-50/70 dark:bg-stone-950 text-stone-900 dark:text-stone-50 transition-colors duration-300 font-sans selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:text-emerald-100">
      {/* Cabecera elegante */}
      <header className="sticky top-0 z-20 bg-emerald-700 dark:bg-emerald-950 text-white shadow-md border-b-2 border-emerald-500/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl border border-white/20 shadow-inner flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wider flex items-center gap-2">
                <span>LA FORTISSIMA</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  <Sparkles className="h-3 w-3" /> 8,00 €/h
                </span>
              </h1>
              <p className="text-[10px] text-emerald-200/80 uppercase tracking-widest font-medium hidden sm:block">
                Control de Horas y Pagos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <DataManager hourlyRate={hourlyRate} onUpdateHourlyRate={setHourlyRate} />
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <Dashboard />
      </main>

      {/* Pie de página sutil */}
      <footer className="container mx-auto px-4 py-8 text-center text-xs text-stone-400 dark:text-stone-600 border-t border-stone-200/50 dark:border-stone-800/50 mt-12">
        <p>La Fortissima • Panel de Gestión de Turnos y Finanzas</p>
      </footer>
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="la-fortissima-theme">
      <MainLayout />
    </ThemeProvider>
  )
}

export default App
