import { useState } from "react"
import { useDashboard } from "@/lib/useDashboard"
import { SummaryCards } from "./SummaryCards"
import { ShiftsTable } from "./ShiftsTable"
import { AddShiftDialog } from "./AddShiftDialog"
import { GoalsSection } from "./GoalsSection"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import type { WorkShift } from "@/lib/types"
import { CalendarDays } from "lucide-react"

export function Dashboard() {
  const {
    shifts,
    addShift,
    updateShift,
    deleteShift,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    hourlyRate,
  } = useDashboard()

  // Extraer meses únicos disponibles
  const monthsSet = new Set<string>()
  shifts.forEach((s) => {
    if (s.date && s.date.length >= 7) {
      monthsSet.add(s.date.substring(0, 7))
    }
  })

  const currentMonthStr = new Date().toISOString().substring(0, 7)
  monthsSet.add(currentMonthStr)

  const availableMonths = Array.from(monthsSet).sort().reverse()
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0])

  // Filtrar turnos del mes seleccionado
  const filteredShifts = shifts.filter((s) => s.date.startsWith(selectedMonth))

  // Manejar adición de nómina recibida
  const handleAddNomina = (amount: number) => {
    const todayStr = new Date().toISOString().split("T")[0]
    const dateToUse = todayStr.startsWith(selectedMonth) ? todayStr : `${selectedMonth}-01`

    const newShift: WorkShift = {
      id: crypto.randomUUID(),
      date: dateToUse,
      startTime: "-",
      endTime: "-",
      totalHoursStr: "-",
      decimalHours: 0,
      hourlyRate: 0,
      totalMoney: amount,
      note: "Nómina ingresada por banco",
      isPaid: true,
      isNomina: true,
    }
    addShift(newShift)
  }

  // Manejar adición de efectivo / adelanto
  const handleAddAdvance = (amount: number) => {
    const todayStr = new Date().toISOString().split("T")[0]
    const dateToUse = todayStr.startsWith(selectedMonth) ? todayStr : `${selectedMonth}-01`

    const newShift: WorkShift = {
      id: crypto.randomUUID(),
      date: dateToUse,
      startTime: "-",
      endTime: "-",
      totalHoursStr: "-",
      decimalHours: 0,
      hourlyRate: 0,
      totalMoney: amount,
      note: "Adelanto / Efectivo en mano",
      isPaid: true,
      isAdvance: true,
    }
    addShift(newShift)
  }

  const formatMonth = (monthStr: string) => {
    try {
      const date = parseISO(`${monthStr}-01`)
      const formatted = format(date, "MMMM yyyy", { locale: es })
      return formatted.charAt(0).toUpperCase() + formatted.slice(1)
    } catch {
      return monthStr
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Barra superior con selector de mes y botón de añadir turno */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-stone-900/40 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-800/60 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              Mes activo:
            </span>
          </div>
          <Select value={selectedMonth} onValueChange={(val) => val && setSelectedMonth(val)}>
            <SelectTrigger className="w-[210px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 font-semibold text-stone-800 dark:text-stone-100 shadow-sm">
              <SelectValue placeholder="Selecciona un mes" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
              {availableMonths.map((m) => (
                <SelectItem key={m} value={m}>
                  {formatMonth(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AddShiftDialog onAdd={addShift} defaultHourlyRate={hourlyRate} />
      </div>

      {/* Tarjetas de Resumen Financiero */}
      <SummaryCards
        shifts={filteredShifts}
        onAddAdvance={handleAddAdvance}
        onAddNomina={handleAddNomina}
      />

      {/* Tabla de Turnos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Turnos de {formatMonth(selectedMonth)}</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium">
              {filteredShifts.filter((s) => !s.isAdvance && !s.isNomina).length} turnos
            </span>
          </h2>
        </div>
        <ShiftsTable
          shifts={filteredShifts}
          onUpdateShift={updateShift}
          onDeleteShift={deleteShift}
        />
      </div>

      {/* Sección de Metas y Ahorro */}
      <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800/60">
        <GoalsSection
          goals={goals}
          onAddGoal={addGoal}
          onUpdateGoal={updateGoal}
          onDeleteGoal={deleteGoal}
        />
      </div>
    </div>
  )
}
