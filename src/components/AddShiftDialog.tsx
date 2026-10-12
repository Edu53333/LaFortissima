import { useState, useId } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, PlusCircle, Clock, Sparkles } from "lucide-react"
import type { WorkShift } from "@/lib/types"
import { calculateShiftDuration } from "@/lib/types"

interface AddShiftDialogProps {
  onAdd: (shift: WorkShift) => void;
  defaultHourlyRate?: number;
}

export function AddShiftDialog({ onAdd, defaultHourlyRate = 8.0 }: AddShiftDialogProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState("13:00")
  const [endTime, setEndTime] = useState("21:00")
  const [note, setNote] = useState("")

  const dateId = useId()
  const startId = useId()
  const endId = useId()
  const noteId = useId()

  const { decimalHours, totalHoursStr, totalMinutes } = calculateShiftDuration(startTime, endTime)
  const totalMoney = Math.round(decimalHours * defaultHourlyRate * 100) / 100

  // Comprobar si cruza medianoche
  const [startH] = startTime.split(":").map(Number)
  const [endH] = endTime.split(":").map(Number)
  const isOvernight = !isNaN(startH) && !isNaN(endH) && endH < startH

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !startTime || !endTime || totalMinutes <= 0) return

    const newShift: WorkShift = {
      id: crypto.randomUUID(),
      date,
      startTime,
      endTime,
      totalHoursStr,
      decimalHours,
      hourlyRate: defaultHourlyRate,
      totalMoney,
      note: note.trim() || undefined,
      isPaid: false,
    }

    onAdd(newShift)
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0])
    setStartTime("13:00")
    setEndTime("21:00")
    setNote("")
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
      <DialogTrigger render={
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Turno
        </Button>
      } />
      <DialogContent className="sm:max-w-[460px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-2xl">
        <DialogHeader className="border-b border-stone-100 dark:border-stone-800 pb-3">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Clock className="h-5 w-5" />
            </span>
            Registrar Turno de Trabajo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-3">
          <div className="grid gap-2">
            <Label htmlFor={dateId} className="font-semibold text-stone-700 dark:text-stone-300">
              Fecha del Turno
            </Label>
            <Input
              id={dateId}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-stone-50/50 dark:bg-stone-950/50 border-stone-200 dark:border-stone-800 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor={startId} className="font-semibold text-stone-700 dark:text-stone-300">
                Hora de Inicio
              </Label>
              <Input
                id={startId}
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="bg-stone-50/50 dark:bg-stone-950/50 border-stone-200 dark:border-stone-800 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={endId} className="font-semibold text-stone-700 dark:text-stone-300">
                Hora de Fin
              </Label>
              <Input
                id={endId}
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="bg-stone-50/50 dark:bg-stone-950/50 border-stone-200 dark:border-stone-800 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          {isOvernight && (
            <div className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-md border border-amber-200 dark:border-amber-900 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Turno nocturno (cruza la medianoche hasta el día siguiente)
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor={noteId} className="font-medium text-stone-600 dark:text-stone-400 text-xs">
              Nota / Observación (Opcional)
            </Label>
            <Input
              id={noteId}
              type="text"
              placeholder="Ej. Servicio mediodía, cierre..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-stone-50/50 dark:bg-stone-950/50 border-stone-200 dark:border-stone-800 focus-visible:ring-emerald-500"
            />
          </div>

          {/* Tarjeta de cálculo en vivo */}
          <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/40 dark:from-emerald-950/30 dark:to-stone-900/50 rounded-xl p-4 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Calculator className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Cálculo de Horas:
              </span>
              <span className="text-stone-800 dark:text-stone-200 font-semibold">
                {totalHoursStr} ({decimalHours.toFixed(2)} horas)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-medium">
              <span>Tarifa por hora:</span>
              <span className="text-stone-800 dark:text-stone-200 font-semibold">
                {defaultHourlyRate.toFixed(2)} €/h
              </span>
            </div>

            <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                Total a Cobrar:
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {totalMoney.toFixed(2)} €
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={totalMinutes <= 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 shadow-md shadow-emerald-700/20"
            >
              Guardar Turno
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
