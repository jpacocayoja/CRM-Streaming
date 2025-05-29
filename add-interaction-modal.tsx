"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"

interface AddInteractionModalProps {
  isOpen: boolean
  onClose: () => void
  prospect: any
  onSave: (prospectName: string, interaction: any) => void
}

interface FormErrors {
  action?: string
  result?: string
  channel?: string
  date?: string
  time?: string
  summary?: string
  nextAction?: string
  newStatus?: string
  reason?: string
}

export function AddInteractionModal({ isOpen, onClose, prospect, onSave }: AddInteractionModalProps) {
  const [changeStatus, setChangeStatus] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    action: "",
    result: "",
    channel: "",
    date: "",
    time: "",
    summary: "",
    nextAction: "",
    newStatus: "",
    reason: "",
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Campos requeridos
    if (!formData.action) newErrors.action = "La acción realizada es requerida"
    if (!formData.result) newErrors.result = "El resultado es requerido"
    if (!formData.channel) newErrors.channel = "El canal de contacto es requerido"
    if (!formData.date) newErrors.date = "La fecha es requerida"
    if (!formData.time) newErrors.time = "La hora es requerida"
    if (!formData.summary.trim()) newErrors.summary = "El resumen de la conversación es requerido"
    if (!formData.nextAction) newErrors.nextAction = "La próxima acción es requerida"

    // Validaciones condicionales para cambio de estado
    if (changeStatus) {
      if (!formData.newStatus) newErrors.newStatus = "El nuevo estado es requerido"
      if (!formData.reason.trim()) newErrors.reason = "El motivo del cambio de estado es requerido"
    }

    // Validación de fecha (no puede ser futura)
    if (formData.date) {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(23, 59, 59, 999) // Fin del día actual
      if (selectedDate > today) {
        newErrors.date = "La fecha no puede ser futura"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    // Crear la nueva interacción
    const newInteraction = {
      type: formData.action,
      channel: formData.channel,
      icon: formData.channel.toLowerCase(),
      date: new Date(formData.date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      time: formData.time,
      status: formData.result,
      summary: formData.summary,
      nextAction: formData.nextAction,
      ...(changeStatus && {
        statusChange: {
          newStatus: formData.newStatus,
          reason: formData.reason,
        },
      }),
    }

    // Guardar la interacción
    onSave(prospect.name, newInteraction)

    // Mostrar mensaje de éxito (opcional)
    console.log("Interacción guardada exitosamente para", prospect.name)

    // Resetear el formulario
    handleCancel()
  }

  const handleCancel = () => {
    // Resetear el formulario
    setFormData({
      action: "",
      result: "",
      channel: "",
      date: "",
      time: "",
      summary: "",
      nextAction: "",
      newStatus: "",
      reason: "",
    })
    setChangeStatus(false)
    setErrors({})
    onClose()
  }

  const getStatusColorClass = (status: string) => {
    const statusConfig: Record<string, string> = {
      Contactado: "#7e78de",
      Seguimiento: "#06b6d4",
      Convertido: "#10b981",
      Desestimado: "#ef4444",
      Recontactar: "#f59e0b",
    }

    return statusConfig[status] || "#c7c7c7"
  }

  const isFormValid = () => {
    return (
      formData.action &&
      formData.result &&
      formData.channel &&
      formData.date &&
      formData.time &&
      formData.summary.trim() &&
      formData.nextAction &&
      (!changeStatus || (formData.newStatus && formData.reason.trim()))
    )
  }

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null
    return (
      <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
        <AlertCircle className="h-3 w-3" />
        <span>{error}</span>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto p-0 overflow-hidden rounded-2xl">
        <div className="bg-white">
          {/* Header */}
          <div className="p-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-[#000000]">Agregar nueva interacción</h2>
            <p className="text-gray-500 text-sm mt-1">
              Registra una nueva interacción para {prospect?.name || "el prospecto"}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
            {/* Acción realizada */}
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Acción realizada <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.action}
                onValueChange={(value) => {
                  setFormData({ ...formData, action: value })
                  if (errors.action) setErrors({ ...errors, action: undefined })
                }}
              >
                <SelectTrigger className={`w-full rounded-lg ${errors.action ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccionar acción realizada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Llamada">Llamada</SelectItem>
                  <SelectItem value="Mensaje">Mensaje</SelectItem>
                  <SelectItem value="Recordatorio">Recordatorio</SelectItem>
                  <SelectItem value="Envio de prueba gratuita">Envío de prueba gratuita</SelectItem>
                  <SelectItem value="Envio de planes de suscripcion">Envío de planes de suscripción</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage error={errors.action} />
            </div>

            {/* Resultado y Canal de Contacto */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Resultado <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.result}
                  onValueChange={(value) => {
                    setFormData({ ...formData, result: value })
                    if (errors.result) setErrors({ ...errors, result: undefined })
                  }}
                >
                  <SelectTrigger className={`w-full rounded-lg ${errors.result ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Seleccionar resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en espera">En espera</SelectItem>
                    <SelectItem value="negativo">Negativo</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="positivo">Positivo</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage error={errors.result} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Canal de Contacto <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.channel}
                  onValueChange={(value) => {
                    setFormData({ ...formData, channel: value })
                    if (errors.channel) setErrors({ ...errors, channel: undefined })
                  }}
                >
                  <SelectTrigger className={`w-full rounded-lg ${errors.channel ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Seleccionar canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Llamada">Llamada</SelectItem>
                    <SelectItem value="Telegram">Telegram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage error={errors.channel} />
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value })
                      if (errors.date) setErrors({ ...errors, date: undefined })
                    }}
                    className={`w-full rounded-lg ${errors.date ? "border-red-500" : ""}`}
                    placeholder="dd/mm/aaaa"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <ErrorMessage error={errors.date} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Hora <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => {
                      setFormData({ ...formData, time: e.target.value })
                      if (errors.time) setErrors({ ...errors, time: undefined })
                    }}
                    className={`w-full rounded-lg ${errors.time ? "border-red-500" : ""}`}
                    placeholder="hh:mm:ss"
                  />
                </div>
                <ErrorMessage error={errors.time} />
              </div>
            </div>

            {/* Resumen de la conversación */}
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Resumen de la conversación <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.summary}
                onChange={(e) => {
                  setFormData({ ...formData, summary: e.target.value })
                  if (errors.summary) setErrors({ ...errors, summary: undefined })
                }}
                className={`w-full h-24 rounded-lg resize-none ${errors.summary ? "border-red-500" : ""}`}
                placeholder="Describe los detalles de la conversación..."
              />
              <ErrorMessage error={errors.summary} />
            </div>

            {/* Acción próxima */}
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Acción próxima <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.nextAction}
                onValueChange={(value) => {
                  setFormData({ ...formData, nextAction: value })
                  if (errors.nextAction) setErrors({ ...errors, nextAction: undefined })
                }}
              >
                <SelectTrigger className={`w-full rounded-lg ${errors.nextAction ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccionar próxima acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Llamada">Llamada</SelectItem>
                  <SelectItem value="Mensaje">Mensaje</SelectItem>
                  <SelectItem value="Recordatorio">Recordatorio</SelectItem>
                  <SelectItem value="Envio de prueba gratuita">Envío de prueba gratuita</SelectItem>
                  <SelectItem value="Envio de planes de suscripcion">Envío de planes de suscripción</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage error={errors.nextAction} />
            </div>

            {/* Checkbox para cambiar estado */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="change-status"
                checked={changeStatus}
                onCheckedChange={(checked) => {
                  setChangeStatus(checked as boolean)
                  if (!checked) {
                    setFormData({ ...formData, newStatus: "", reason: "" })
                    setErrors({ ...errors, newStatus: undefined, reason: undefined })
                  }
                }}
              />
              <label htmlFor="change-status" className="text-sm font-semibold text-[#000000]">
                Cambiar estado del prospecto
              </label>
            </div>

            {/* Campos condicionales para cambio de estado */}
            {changeStatus && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-2">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.newStatus}
                    onValueChange={(value) => {
                      setFormData({ ...formData, newStatus: value })
                      if (errors.newStatus) setErrors({ ...errors, newStatus: undefined })
                    }}
                  >
                    <SelectTrigger className={`w-full rounded-lg ${errors.newStatus ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Actualizar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Contactado">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getStatusColorClass("Contactado") }}
                          ></div>
                          Contactado
                        </div>
                      </SelectItem>
                      <SelectItem value="Seguimiento">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getStatusColorClass("Seguimiento") }}
                          ></div>
                          Seguimiento
                        </div>
                      </SelectItem>
                      <SelectItem value="Convertido">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getStatusColorClass("Convertido") }}
                          ></div>
                          Convertido
                        </div>
                      </SelectItem>
                      <SelectItem value="Desestimado">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getStatusColorClass("Desestimado") }}
                          ></div>
                          Desestimado
                        </div>
                      </SelectItem>
                      <SelectItem value="Recontactar">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getStatusColorClass("Recontactar") }}
                          ></div>
                          Recontactar
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage error={errors.newStatus} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-2">
                    Motivo <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => {
                      setFormData({ ...formData, reason: e.target.value })
                      if (errors.reason) setErrors({ ...errors, reason: undefined })
                    }}
                    className={`w-full h-20 rounded-lg resize-none ${errors.reason ? "border-red-500" : ""}`}
                    placeholder="Explica el motivo del cambio de estado..."
                  />
                  <ErrorMessage error={errors.reason} />
                </div>
              </>
            )}
          </div>

          {/* Footer con botones */}
          <div className="p-6 pt-4 border-t">
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-8 py-2 rounded-lg bg-[#0f1729] text-white hover:bg-[#1a2332] border-[#0f1729]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isFormValid()}
                className={`px-8 py-2 rounded-lg text-white ${
                  isFormValid() ? "hover:opacity-90" : "opacity-50 cursor-not-allowed"
                }`}
                style={{ backgroundColor: "#7e78de" }}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
