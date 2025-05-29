"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface InteractionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  interaction: any
}

export function InteractionDetailModal({ isOpen, onClose, interaction }: InteractionDetailModalProps) {
  if (!interaction) return null

  // Datos específicos para cada tipo de interacción
  const getInteractionDetails = (interaction: any) => {
    // Si la interacción tiene datos guardados del formulario, usarlos
    if (interaction.summary && interaction.nextAction) {
      return {
        action: interaction.nextAction,
        summary: interaction.summary,
      }
    }

    // Datos por defecto para interacciones que no tienen datos del formulario
    const details = {
      Llamada: {
        action: "Enviar mensaje al whatsapp",
        summary:
          "Se llamó al prospecto unas 3 veces, pero de las 3 solo contestó la última, en donde nos comunicó que estaba ocupado que no podría atendernos y que le enviaramos un mensaje a su whatsapp",
      },
      Mensaje: {
        action: "Hacer seguimiento por telegram",
        summary:
          "Se envió mensaje inicial por telegram explicando los beneficios del servicio. El prospecto mostró interés pero pidió más información sobre precios y planes disponibles.",
      },
      Recordatorio: {
        action: "Programar llamada de seguimiento",
        summary:
          "Se configuró recordatorio para contactar al prospecto. Había mostrado interés previo en el servicio pero no había respondido a los últimos mensajes enviados.",
      },
      "Envío de prueba gratuita": {
        action: "Hacer seguimiento de la prueba",
        summary:
          "Se envió acceso a prueba gratuita de 7 días por email. El prospecto confirmó recepción y mostró interés en probar el servicio antes de tomar una decisión.",
      },
      "Envío de planes de suscripción": {
        action: "Agendar llamada para cerrar venta",
        summary:
          "Se enviaron los diferentes planes de suscripción disponibles. El prospecto revisó las opciones y pidió una llamada para aclarar dudas sobre el plan premium.",
      },
      llamada: {
        action: "Enviar información por email",
        summary:
          "Llamada realizada donde el prospecto mostró interés pero prefiere recibir toda la información por escrito antes de tomar una decisión final.",
      },
    }

    return (
      details[interaction.type as keyof typeof details] || {
        action: "Realizar seguimiento",
        summary:
          "Interacción registrada con el prospecto. Se requiere seguimiento para continuar con el proceso de conversión.",
      }
    )
  }

  const details = getInteractionDetails(interaction)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto p-0 overflow-hidden rounded-2xl">
        <div className="bg-white">
          {/* Header - Solo con un botón X */}
          <div className="p-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-[#000000]">Detalle de la Interacción</h2>
              <p className="text-gray-500 text-sm mt-1">Detalles de la interacción registrada</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Información de la interacción */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium">Tipo</p>
                <p className="text-[#000000]">{interaction.type}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Canal</p>
                <p className="text-[#000000]">{interaction.channel}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Fecha</p>
                <p className="text-[#000000]">{interaction.date}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Hora</p>
                <p className="text-[#000000]">{interaction.time}</p>
              </div>
            </div>

            {/* Acción recomendada */}
            <div>
              <label className="block text-lg font-bold text-[#000000] mb-2">Acción recomendada</label>
              <Input value={details.action} readOnly className="w-full rounded-lg border-gray-300 bg-gray-50" />
            </div>

            {/* Resumen de la conversación */}
            <div>
              <label className="block text-lg font-bold text-[#000000] mb-2">Resumen de la conversación</label>
              <Textarea
                value={details.summary}
                readOnly
                className="w-full h-32 rounded-lg border-gray-300 bg-gray-50 resize-none"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
