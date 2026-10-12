import { useState } from "react"
import { Target, Plus, Trash2, Coins } from "lucide-react"
import type { Goal } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalsSection({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalsSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newGoalName, setNewGoalName] = useState("")
  const [newGoalTarget, setNewGoalTarget] = useState("")

  const handleAddGoal = () => {
    if (newGoalName.trim() && newGoalTarget) {
      const targetVal = parseFloat(newGoalTarget)
      if (!isNaN(targetVal) && targetVal > 0) {
        onAddGoal({
          id: crypto.randomUUID(),
          name: newGoalName.trim(),
          target: targetVal,
          current: 0,
        })
        setIsAdding(false)
        setNewGoalName("")
        setNewGoalTarget("")
      }
    }
  }

  const handleAddFunds = (goal: Goal) => {
    const amountStr = prompt(`¿Cuánto dinero quieres añadir al objetivo "${goal.name}"? (€)`)
    if (amountStr) {
      const amount = parseFloat(amountStr)
      if (!isNaN(amount) && amount > 0) {
        onUpdateGoal({ ...goal, current: goal.current + amount })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Metas y Objetivos de Ahorro
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
        >
          <Plus className="h-4 w-4 mr-1" /> Nuevo Objetivo
        </Button>
      </div>

      {isAdding && (
        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60 shadow-sm animate-in zoom-in duration-200">
          <CardContent className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Input
              placeholder="Nombre del objetivo (ej. Vacaciones, Moto...)"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              className="bg-white dark:bg-stone-900 border-emerald-200 dark:border-emerald-800"
            />
            <Input
              type="number"
              placeholder="Meta (€)"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="w-full sm:w-36 bg-white dark:bg-stone-900 border-emerald-200 dark:border-emerald-800"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleAddGoal}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-initial"
              >
                Guardar
              </Button>
              <Button
                onClick={() => setIsAdding(false)}
                size="sm"
                variant="ghost"
                className="text-stone-500 flex-1 sm:flex-initial"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {goals.length === 0 && !isAdding && (
        <div className="text-sm text-stone-500 dark:text-stone-400 italic bg-stone-50/50 dark:bg-stone-900/30 p-4 rounded-xl border border-stone-200/60 dark:border-stone-800/60">
          No tienes objetivos creados todavía. Pulsa en "+ Nuevo Objetivo" para motivar tus ahorros.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progressPercent = Math.min(100, Math.round((goal.current / goal.target) * 100))
          return (
            <Card
              key={goal.id}
              className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center text-base font-bold text-stone-900 dark:text-stone-100">
                  <span>{goal.name}</span>
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {goal.current.toFixed(2)} € / {goal.target.toFixed(2)} €
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {progressPercent >= 100 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      🎉 ¡Objetivo completado! (100%)
                    </span>
                  ) : (
                    <span>Has alcanzado el {progressPercent}%</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress
                  value={progressPercent}
                  className="h-2.5 bg-stone-100 dark:bg-stone-800 [&>div]:bg-emerald-500"
                />
                <div className="flex justify-between items-center pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40 gap-1.5"
                    onClick={() => handleAddFunds(goal)}
                  >
                    <Coins className="h-3.5 w-3.5" /> Añadir Fondos
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    onClick={() => {
                      if (confirm(`¿Eliminar el objetivo "${goal.name}"?`)) {
                        onDeleteGoal(goal.id)
                      }
                    }}
                    title="Eliminar objetivo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
