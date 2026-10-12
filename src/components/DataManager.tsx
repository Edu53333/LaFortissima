import { Download, Upload, LogIn, LogOut, Cloud, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { auth } from "@/lib/firebase"
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, type User } from "firebase/auth"

interface DataManagerProps {
  hourlyRate: number;
  onUpdateHourlyRate: (rate: number) => void;
}

export function DataManager({ hourlyRate, onUpdateHourlyRate }: DataManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tempRate, setTempRate] = useState(hourlyRate.toString())

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  useEffect(() => {
    setTempRate(hourlyRate.toString())
  }, [hourlyRate])

  const handleLogin = async () => {
    setIsLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      window.location.reload()
    } catch (error) {
      console.error("Login fallido:", error)
      alert("Error al iniciar sesión con Google. Comprueba que permites las ventanas emergentes.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    if (confirm("¿Seguro que quieres cerrar sesión? Solo se sincronizará cuando vuelvas a iniciar sesión.")) {
      await signOut(auth)
      window.location.reload()
    }
  }

  const handleExport = () => {
    const data = {
      app: "LaFortissima",
      version: "1.0",
      exportDate: new Date().toISOString(),
      shifts: localStorage.getItem("la_fortissima_shifts"),
      goals: localStorage.getItem("la_fortissima_goals"),
      hourlyRate: localStorage.getItem("la_fortissima_hourly_rate") || "8.0",
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `la-fortissima-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (data.shifts) localStorage.setItem("la_fortissima_shifts", data.shifts)
        if (data.goals) localStorage.setItem("la_fortissima_goals", data.goals)
        if (data.hourlyRate) localStorage.setItem("la_fortissima_hourly_rate", data.hourlyRate)

        alert("¡Datos restaurados correctamente! Se sincronizarán si tienes sesión iniciada.")
        window.location.reload()
      } catch (err) {
        alert("Hubo un error al leer el archivo. Asegúrate de que es un backup válido de La Fortissima.")
      }
    }
    reader.readAsText(file)
  }

  const handleSaveRate = () => {
    const parsed = parseFloat(tempRate)
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateHourlyRate(parsed)
      alert(`Tarifa actualizada a ${parsed.toFixed(2)} €/h`)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
      />

      <Dialog>
        <DialogTrigger render={
          <Button
            variant={user ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs font-semibold transition-all ${
              user
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-sm"
                : "border-emerald-300/80 bg-white/10 text-white hover:bg-white/20 dark:border-emerald-800"
            }`}
          >
            {user ? <Cloud className="h-4 w-4 mr-1.5 text-emerald-100" /> : <LogIn className="h-4 w-4 mr-1.5" />}
            {user ? "Sincronizado" : "Sincronizar"}
          </Button>
        } />
        <DialogContent className="sm:max-w-[430px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
              <Cloud className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Sincronización Multidispositivo (Nube)
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Inicia sesión con tu cuenta de Google. Tu móvil y tu ordenador se sincronizarán en tiempo real automáticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-3">
            {/* Estado de sesión */}
            {user ? (
              <div className="space-y-3">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 p-3.5 rounded-xl text-xs border border-emerald-200 dark:border-emerald-900 flex flex-col gap-1">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <Cloud className="w-4 h-4" /> Conectado en Tiempo Real
                  </span>
                  <span>Sesión activa como:</span>
                  <strong className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {user.email}
                  </strong>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3.5 w-3.5 mr-2" /> Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="space-y-3 pb-2 border-b border-stone-100 dark:border-stone-800">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-700/20"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoading ? "Conectando con Google..." : "Acceder con Google"}
                </Button>
                <p className="text-[11px] text-stone-400 text-center">
                  Al iniciar sesión, cualquier cambio que hagas en el móvil o en el PC se guardará en tu cuenta.
                </p>
              </div>
            )}

            {/* Ajuste de tarifa */}
            <div className="space-y-2 bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
                <Sliders className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Tarifa por hora (€/h)</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.5"
                  value={tempRate}
                  onChange={(e) => setTempRate(e.target.value)}
                  className="bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 h-8 text-xs"
                />
                <Button
                  size="sm"
                  onClick={handleSaveRate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3"
                >
                  Guardar
                </Button>
              </div>
            </div>

            {/* Copias de seguridad locales */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 text-xs border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5 text-stone-500" />
                Restaurar Copia
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex-1 text-xs border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Guardar Backup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
