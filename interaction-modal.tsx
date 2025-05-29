"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Clock, X } from "lucide-react";
import {
  Linkedin,
  Facebook,
  Instagram,
  Telegram,
  WhatsApp,
  TikTok,
  Twitter,
  Send,
  Mail,
} from "@/icons";
import { cn } from "@/lib/utils";
import { InteractionDetailModal } from "./interaction-detail-modal";

interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: any;
  prospectInteractions: any[];
  prospectStatusHistory: any[];
}

export function InteractionModal({
  isOpen,
  onClose,
  prospect,
  prospectInteractions,
  prospectStatusHistory,
}: InteractionModalProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [channelFilter, setChannelFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateSort, setDateSort] = useState("desc"); // "desc" (más reciente primero) o "asc" (más antiguo primero)
  const [selectedInteraction, setSelectedInteraction] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Sample interaction data (datos por defecto)
  const defaultInteractions = [
    {
      type: "Llamada",
      channel: "WhatsApp",
      icon: "whatsapp",
      date: "22-06-24",
      time: "23:45",
      status: "negativo",
    },
    {
      type: "Mensaje",
      channel: "Telegram",
      icon: "telegram",
      date: "21-06-24",
      time: "15:30",
      status: "neutral",
    },
    {
      type: "Recordatorio",
      channel: "Facebook",
      icon: "facebook",
      date: "20-06-24",
      time: "10:15",
      status: "positivo",
    },
    {
      type: "Envío de prueba gratuita",
      channel: "Email",
      icon: "email",
      date: "19-06-24",
      time: "09:20",
      status: "en espera",
    },
    {
      type: "Envío de planes de suscripción",
      channel: "Instagram",
      icon: "instagram",
      date: "18-06-24",
      time: "14:10",
      status: "negativo",
    },
    {
      type: "llamada",
      channel: "Phone",
      icon: "phone",
      date: "17-06-24",
      time: "11:30",
      status: "negativo",
    },
  ];

  // Función para convertir fecha del formato dd-mm-yy a timestamp para ordenamiento
  const convertDateToTimestamp = (dateStr: string, timeStr = "00:00") => {
    try {
      let day, month, year;

      // Handle both formats: "dd-mm-yy" and "dd/mm/yyyy"
      if (dateStr.includes("-")) {
        const dateParts = dateStr.split("-");
        if (dateParts.length !== 3) return 0;

        day = Number.parseInt(dateParts[0], 10);
        month = Number.parseInt(dateParts[1], 10) - 1; // Months are 0-indexed in JS
        year = Number.parseInt(dateParts[2], 10);

        // Convert 2-digit year to 4-digit
        if (year < 100) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }
      } else if (dateStr.includes("/")) {
        const dateParts = dateStr.split("/");
        if (dateParts.length !== 3) return 0;

        day = Number.parseInt(dateParts[0], 10);
        month = Number.parseInt(dateParts[1], 10) - 1; // Months are 0-indexed in JS
        year = Number.parseInt(dateParts[2], 10);
      } else {
        return 0;
      }

      const timeParts = timeStr ? timeStr.split(":") : ["00", "00"];
      const hours = Number.parseInt(timeParts[0], 10) || 0;
      const minutes = Number.parseInt(timeParts[1], 10) || 0;

      const dateObj = new Date(year, month, day, hours, minutes);
      return dateObj.getTime();
    } catch (error) {
      console.error("Error parsing date:", dateStr, timeStr, error);
      return 0;
    }
  };

  // Procesar todas las interacciones para tener timestamps consistentes
  const processAllInteractions = () => {
    // Process default interactions with timestamps
    const processedDefaultInteractions = defaultInteractions.map(
      (interaction) => ({
        ...interaction,
        timestamp: convertDateToTimestamp(interaction.date, interaction.time),
      })
    );

    // Process prospect interactions with timestamps
    const processedProspectInteractions = prospectInteractions.map(
      (interaction) => ({
        ...interaction,
        timestamp: convertDateToTimestamp(interaction.date, interaction.time),
      })
    );

    // Combine all interactions
    const allInteractions = [
      ...processedDefaultInteractions,
      ...processedProspectInteractions,
    ];

    // Remove duplicates based on a combination of properties
    const uniqueInteractions = allInteractions.filter(
      (interaction, index, self) => {
        return (
          index ===
          self.findIndex(
            (i) =>
              i.type === interaction.type &&
              i.date === interaction.date &&
              i.time === interaction.time &&
              i.channel === interaction.channel
          )
        );
      }
    );

    return uniqueInteractions;
  };

  const allInteractions = processAllInteractions();

  // Sample status history data
  const defaultStatusHistory = [
    {
      date: "22 de Mayo, 2023",
      fromStatus: "Nuevo",
      toStatus: "Contactado",
      description: "Primer contacto por email, respuesta positiva",
    },
    {
      date: "22 de Mayo, 2023",
      fromStatus: "Contactado",
      toStatus: "Seguimiento",
      description: "Se envío las pruebas gratuitas y las acepto",
    },
    {
      date: "22 de Mayo, 2023",
      fromStatus: "Seguimiento",
      toStatus: "Convertido",
      description: "Pidió ofertas de suscripciones",
    },
  ];

  // Combinar historial por defecto con el historial específico del prospecto
  const statusHistory = [...defaultStatusHistory, ...prospectStatusHistory];

  // Filtrar las interacciones según los filtros seleccionados
  const filteredInteractions = allInteractions.filter((interaction) => {
    // Filter by channel
    if (
      channelFilter !== "todos" &&
      interaction.channel.toLowerCase() !== channelFilter.toLowerCase()
    ) {
      return false;
    }

    // Filter by status
    if (statusFilter !== "todos" && interaction.status !== statusFilter) {
      return false;
    }

    // Filter by date - compare with the date that is displayed in the list
    if (date) {
      const selectedDateStr = format(date, "dd/MM/yyyy");
      const interactionDateFormatted = interaction.date.includes("/")
        ? interaction.date
            .split("/")
            .map((part) => part.padStart(2, "0"))
            .join("/")
        : interaction.date
            .split("-")
            .reverse()
            .join("/")
            .replace(/(\d{2})\/(\d{2})\/(\d{2})/, "0$1/0$2/20$3");

      if (interactionDateFormatted !== selectedDateStr) {
        return false;
      }
    }

    return true;
  });

  // Sort the interactions by timestamp (based on the date and time of each interaction)
  const sortedInteractions = [...filteredInteractions].sort((a, b) => {
    if (dateSort === "desc") {
      // Most recent first: higher timestamp first
      return b.timestamp - a.timestamp;
    } else {
      // Oldest first: lower timestamp first
      return a.timestamp - b.timestamp;
    }
  });

  const openDetailModal = (interaction: any) => {
    setSelectedInteraction(interaction);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      negativo: { bg: "#ffcccc", text: "#ff0000" },
      neutral: { bg: "#e0e0e0", text: "#666666" },
      positivo: { bg: "#d4ffcc", text: "#00cc00" },
      "en espera": { bg: "#fff2cc", text: "#ff9900" },
    };

    const config = statusConfig[status] || { bg: "#e0e0e0", text: "#666666" };

    return (
      <Badge
        style={{
          backgroundColor: config.bg,
          color: config.text,
          border: "none",
        }}
        className="px-4 py-1 rounded-full font-medium"
      >
        {status}
      </Badge>
    );
  };

  const getStatusColorClass = (status: string) => {
    const statusConfig: Record<string, string> = {
      Nuevo: "bg-[#cd78de] text-white",
      Contactado: "bg-[#7e78de] text-white",
      Seguimiento: "bg-[#06b6d4] text-white",
      Convertido: "bg-[#10b981] text-white",
      Desestimado: "bg-[#ef4444] text-white",
      Recontactar: "bg-[#f59e0b] text-white",
    };

    return statusConfig[status] || "bg-gray-400 text-white";
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "whatsapp":
        return (
          <div className="bg-[#25D366] p-2 rounded-lg">
            <WhatsApp className="h-6 w-6 text-white" />
          </div>
        );
      case "telegram":
        return (
          <div className="bg-[#0088cc] p-2 rounded-lg">
            <Telegram className="h-6 w-6 text-white" />
          </div>
        );
      case "facebook":
        return (
          <div className="bg-[#1877F2] p-2 rounded-lg">
            <Facebook className="h-6 w-6 text-white" />
          </div>
        );
      case "email":
        return (
          <div className="bg-[#EA4335] p-2 rounded-lg">
            <Mail className="h-6 w-6 text-white" />
          </div>
        );
      case "instagram":
        return (
          <div className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] p-2 rounded-lg">
            <Instagram className="h-6 w-6 text-white" />
          </div>
        );
      case "linkedin":
        return (
          <div className="bg-[#0A66C2] p-2 rounded-lg">
            <Linkedin className="h-6 w-6 text-white" />
          </div>
        );
      case "tiktok":
        return (
          <div className="bg-black p-2 rounded-lg">
            <TikTok className="h-6 w-6 text-white" />
          </div>
        );
      case "twitter":
        return (
          <div className="bg-black p-2 rounded-lg">
            <Twitter className="h-6 w-6 text-white" />
          </div>
        );
      case "llamada":
        return (
          <div className="bg-gray-500 p-2 rounded-lg">
            <Send className="h-6 w-6 text-white" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-500 p-2 rounded-lg">
            <Send className="h-6 w-6 text-white" />
          </div>
        );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl">
          <div className="flex flex-col md:flex-row h-[600px]">
            {/* Left Side - Interaction History */}
            <div className="flex-1 p-6 overflow-y-auto border-r">
              <h2 className="text-2xl font-bold mb-4">
                Historial de Interacciones
              </h2>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-32 rounded-full bg-white border">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="llamada">Llamada</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 rounded-full bg-white border">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="en espera">En Espera</SelectItem>
                    <SelectItem value="negativo">Negativo</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="positivo">Positivo</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateSort} onValueChange={setDateSort}>
                  <SelectTrigger className="w-40 rounded-full bg-white border">
                    <SelectValue placeholder="Ordenar por fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Más reciente</SelectItem>
                    <SelectItem value="asc">Más antiguo</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[180px] justify-start text-left font-normal rounded-full",
                        !date && "text-muted-foreground"
                      )}
                      onClick={() => {
                        if (date) {
                          setDate(undefined);
                        }
                      }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : "dd/mm/aaaa"}
                      {date && (
                        <button
                          className="ml-auto hover:bg-gray-200 rounded-full p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDate(undefined);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Interactions List */}
              {sortedInteractions.length > 0 ? (
                <div className="space-y-4">
                  {sortedInteractions.map((interaction, index) => (
                    <div
                      key={`${interaction.type}-${interaction.date}-${interaction.time}-${index}`}
                      className="border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => openDetailModal(interaction)}
                    >
                      <div className="flex items-center gap-4">
                        {getChannelIcon(interaction.channel)}
                        <div>
                          <p className="font-medium">{interaction.type}</p>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <div className="flex items-center">
                              <div className="bg-white p-1 rounded text-[#7e78de] mr-1">
                                <CalendarIcon className="h-5 w-5" />
                              </div>
                              {interaction.date}
                            </div>
                            <div className="flex items-center">
                              <div className="bg-white p-1 rounded text-[#7e78de] mr-1">
                                <Clock className="h-5 w-5" />
                              </div>
                              {interaction.time}
                            </div>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(interaction.status)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron interacciones que coincidan con los filtros
                  aplicados.
                </div>
              )}
            </div>

            {/* Right Side - Status History */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <h2 className="text-2xl font-bold mb-4">Historial de Estados</h2>

              <div className="space-y-8">
                {statusHistory.map((item, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-[#7e78de] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>

                    {/* Timeline line */}
                    {index < statusHistory.length - 1 && (
                      <div className="absolute left-2 top-6 w-0.5 h-24 bg-[#7e78de]"></div>
                    )}

                    {/* Content */}
                    <div>
                      <p className="text-sm text-gray-500">{item.date}</p>
                      <div className="flex items-center gap-2 my-2">
                        <Badge
                          className={cn(
                            "rounded-lg px-3 py-1",
                            getStatusColorClass(item.fromStatus)
                          )}
                        >
                          {item.fromStatus}
                        </Badge>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                        <Badge
                          className={cn(
                            "rounded-lg px-3 py-1",
                            getStatusColorClass(item.toStatus)
                          )}
                        >
                          {item.toStatus}
                        </Badge>
                      </div>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interaction Detail Modal */}
      <InteractionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        interaction={selectedInteraction}
      />
    </>
  );
}
