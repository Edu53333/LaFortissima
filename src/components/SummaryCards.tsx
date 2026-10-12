import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { WorkShift } from "@/lib/types"
import { Wallet, Landmark, HandCoins, CheckCircle2, Plus, Clock } from "lucide-react"

interface SummaryCardsProps {
  shifts: WorkShift[];
  onAddAdvance: (amount: number) => void;
  onAddNomina: (amount: number) => void;
}

export function SummaryCards({ shifts, onAddAdvance, onAddNomina }: SummaryCardsProps) {
  const [advanceInput, setAdvanceInput] = useState("")
  const [nominaInput, setNominaInput] = useState("")

  // Cálculos financieros
  const regularShifts = shifts.filter(s => !s.isAdvance && !s.isNomina)
  const totalGenerado = regularShifts.reduce((acc, s) => acc + s.totalMoney, 0)
  const totalHoras = regularShifts.reduce((acc, s) => acc + s.decimalHours, 0)

  const totalCobradoDirecto = regularShifts.filter(s => s.isPaid).reduce((acc, s) => acc + s.totalMoney, 0)
  const totalEfectivo = shifts.filter(s => s.isAdvance).reduce((acc, s) => acc + s.totalMoney, 0)
  const totalNomina = shifts.filter(s => s.isNomina).reduce((acc, s) => acc + s.totalMoney, 0)

  const restante = totalGenerado - totalNomina - totalEfectivo - totalCobradoDirecto

  const handleAddAdvanceClick = () => {
    const val = parseFloat(advanceInput)
    if (!isNaN(val) && val > 0) {
      onAddAdvance(val)
      setAdvanceInput("")
    }
  }

  const handleAddNominaClick = () => {
    const val = parseFloat(nominaInput)
    if (!isNaN(val) && val > 0) {
      onAddNomina(val)
      setNominaInput("")
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Tarjeta 1: Total Generado */}
      <Card className="bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/15 via-teal-500/5 to-transparent rounded-bl-full pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
            Total Generado
          </CardTitle>
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Wallet className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-1">
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {totalGenerado.toFixed(2)} €
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{totalHoras.toFixed(2)} horas trabajadas</span>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta 2: Nómina Recibida */}
      <Card className="bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/15 via-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
            Nómina Recibida
          </CardTitle>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Landmark className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-2">
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {totalNomina.toFixed(2)} €
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <Input
              type="number"
              placeholder="Importe..."
              value={nominaInput}
              onChange={(e) => setNominaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNominaClick()}
              className="h-8 text-xs bg-stone-50/60 dark:bg-stone-950/50 border-stone-200 dark:border-stone-800 focus-visible:ring-blue-500"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddNominaClick}
              className="h-8 px-2.5 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/40"
              title="Añadir nómina ingresada"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta 3: Efectivo / Adelanto */}
      <Card className="bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-transparent rounded-bl-full pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
            Efectivo / Adelanto
          </CardTitle>
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <HandCoins className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-2">
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {totalEfectivo.toFixed(2)} €
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <Input
              type="number"
              placeholder="Importe..."
              value={advanceInput}
              onChange={(e) => setAdvanceInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddAdvanceClick()}
              className="h-8 text-xs bg-stone-50/60 dark:bg-stone-950/50 border-stone-200 dark:border-stone-800 focus-visible:ring-amber-500"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddAdvanceClick}
              className="h-8 px-2.5 border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-950/40"
              title="Añadir adelanto en efectivo"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta 4: Restante por cobrar */}
      <Card className="bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
        <div
          className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none ${
            restante > 0
              ? "bg-gradient-to-br from-emerald-500/15 to-transparent"
              : "bg-gradient-to-br from-stone-500/10 to-transparent"
          }`}
        />
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
            Restante por Cobrar
          </CardTitle>
          <div
            className={`p-2 rounded-lg ${
              restante > 0
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                : "bg-stone-100 dark:bg-stone-800 text-stone-500"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-1">
          <div
            className={`text-2xl font-black ${
              restante > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-stone-500 dark:text-stone-400"
            }`}
          >
            {restante.toFixed(2)} €
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400">
            {restante > 0 ? (
              <span>Pendiente de liquidar</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Todo liquidado al día
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
