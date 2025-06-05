"use client";
import { UserIcon, UserNewIcon, UserSearchIcon, MessageIcon } from "@/icons";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Menu,
  User,
  CheckCircle,
  Search,
  X,
  Phone,
  MessageCircle,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Linkedin,
  Facebook,
  Instagram,
  Telegram,
  WhatsApp,
  TikTok,
  Twitter,
  Prospecto,
} from "@/icons";

import { InteractionModal } from "./interaction-modal";
import { AddInteractionModal } from "./add-interaction-modal";
import { ContactPopover } from "./contact-popover";
import SubscriptionDashboard from "./subscription-dashboard";

// Función para generar una fecha aleatoria entre dos fechas
const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Función para formatear fecha en formato dd/mm/yyyy
const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Función para generar un nombre aleatorio
const generateRandomName = () => {
  const firstNames = [
    "Juan",
    "María",
    "Carlos",
    "Ana",
    "Pedro",
    "Laura",
    "Miguel",
    "Carmen",
    "Javier",
    "Sofía",
    "Luis",
    "Elena",
    "Antonio",
    "Isabel",
    "Francisco",
    "Lucía",
    "José",
    "Marta",
    "Manuel",
    "Paula",
    "David",
    "Cristina",
    "Fernando",
    "Raquel",
    "Alejandro",
    "Natalia",
    "Roberto",
    "Silvia",
    "Alberto",
    "Beatriz",
  ];

  const lastNames = [
    "García",
    "Rodríguez",
    "González",
    "Fernández",
    "López",
    "Martínez",
    "Sánchez",
    "Pérez",
    "Gómez",
    "Martín",
    "Jiménez",
    "Ruiz",
    "Hernández",
    "Díaz",
    "Moreno",
    "Álvarez",
    "Romero",
    "Alonso",
    "Gutiérrez",
    "Navarro",
    "Torres",
    "Domínguez",
    "Vázquez",
    "Ramos",
    "Gil",
    "Ramírez",
    "Serrano",
    "Blanco",
    "Molina",
    "Morales",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
};

// Función para generar un estado aleatorio
const generateRandomStatus = () => {
  const statuses = [
    "Nuevo",
    "Contactado",
    "Seguimiento",
    "Convertido",
    "Desestimado",
    "Recontactar",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Función para generar un teléfono aleatorio
const generateRandomPhone = () => {
  return `+34 ${Math.floor(600000000 + Math.random() * 99999999)}`;
};

// Función para generar un email aleatorio
const generateRandomEmail = (name: string) => {
  const domains = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com",
  ];
  const nameParts = name.toLowerCase().split(" ");
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${nameParts[0]}_${nameParts[1]}@${domain}`;
};

export default function Component() {
  const [currentView, setCurrentView] = useState("prospectos"); // "prospectos" or "suscripcion"
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeFilter, setTimeFilter] = useState("todo");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [nameSort, setNameSort] = useState("a-z");
  const [dateSort, setDateSort] = useState("none");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [isAddInteractionModalOpen, setIsAddInteractionModalOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estado para manejar las interacciones de cada prospecto
  const [prospectInteractions, setProspectInteractions] = useState<
    Record<string, any[]>
  >({});

  // Estado para manejar el historial de estados de cada prospecto
  const [prospectStatusHistory, setProspectStatusHistory] = useState<
    Record<string, any[]>
  >({});

  // Generar fechas aleatorias entre el 28 de abril y el 29 de mayo de 2025
  const startDate = new Date(2025, 3, 28); // 28 de abril de 2025
  const endDate = new Date(2025, 4, 29); // 29 de mayo de 2025

  // Actualizar los prospectos existentes con fechas en el rango especificado
  // y agregar nuevos prospectos hasta tener al menos 60
  const [allProspects, setAllProspects] = useState(() => {
    // Base de prospectos existentes con fechas actualizadas
    const existingProspects = [
      {
        name: "Ana García",
        status: "Nuevo",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 678",
        email: "ana_garcia@gmail.com",
        gender: "Femenino",
        campaign: "Verano 2023",
        interests: "Drama, Documentales",
        channels: "Facebook, Instagram",
        interactions: "Me gusta, Comentario",
      },
      {
        name: "María García",
        status: "Nuevo",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 679",
        email: "maria_garcia@gmail.com",
        gender: "Femenino",
        campaign: "Verano 2023",
        interests: "Comedia, Acción",
        channels: "Instagram, TikTok",
        interactions: "Comentario, Compartir",
      },
      {
        name: "Carlos Rodríguez",
        status: "Contactado",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 680",
        email: "carlos_rodriguez@gmail.com",
        gender: "Masculino",
        campaign: "Verano 2023",
        interests: "Deportes, Documentales",
        channels: "Facebook, WhatsApp",
        interactions: "Me gusta, Mensaje",
      },
      {
        name: "Ana Martínez",
        status: "Contactado",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 681",
        email: "ana_martinez@gmail.com",
        gender: "Femenino",
        campaign: "Verano 2023",
        interests: "Romance, Drama",
        channels: "Instagram, Telegram",
        interactions: "Me gusta, Comentario",
      },
      {
        name: "Pedro Sánchez",
        status: "Seguimiento",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 682",
        email: "pedro_sanchez@gmail.com",
        gender: "Masculino",
        campaign: "Verano 2023",
        interests: "Acción, Thriller",
        channels: "Facebook, X",
        interactions: "Compartir, Comentario",
      },
      {
        name: "Laura Gómez",
        status: "Seguimiento",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 683",
        email: "laura_gomez@gmail.com",
        gender: "Femenino",
        campaign: "Verano 2023",
        interests: "Comedia, Romance",
        channels: "Instagram, WhatsApp",
        interactions: "Me gusta, Mensaje",
      },
      {
        name: "Miguel Torres",
        status: "Convertido",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 684",
        email: "miguel_torres@gmail.com",
        gender: "Masculino",
        campaign: "Verano 2023",
        interests: "Documentales, Historia",
        channels: "Facebook, LinkedIn",
        interactions: "Compartir, Me gusta",
      },
      {
        name: "Carmen Ruiz",
        status: "Desestimado",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 685",
        email: "carmen_ruiz@gmail.com",
        gender: "Femenino",
        campaign: "Verano 2023",
        interests: "Drama, Romance",
        channels: "Instagram, TikTok",
        interactions: "Comentario",
      },
      {
        name: "Javier López",
        status: "Desestimado",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 686",
        email: "javier_lopez@gmail.com",
        gender: "Masculino",
        campaign: "Verano 2023",
        interests: "Acción, Ciencia Ficción",
        channels: "Facebook, X",
        interactions: "Me gusta",
      },
      {
        name: "Juan Perez",
        status: "Recontactar",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 687",
        email: "juan_perez@gmail.com",
        gender: "Masculino",
        campaign: "Verano 2023",
        interests: "Deportes, Acción",
        channels: "WhatsApp, Telegram",
        interactions: "Mensaje, Compartir",
      },
      {
        name: "Leonardo Vaca",
        status: "Recontactar",
        date: formatDate(randomDate(startDate, endDate)),
        dateObj: randomDate(startDate, endDate),
        phone: "+34 612 345 688",
        email: "leonardo_vaca@gmail.com",
        gender: "Masculino",
        campaign: "Verano 2023",
        interests: "Comedia, Documentales",
        channels: "Facebook, Instagram",
        interactions: "Me gusta, Comentario",
      },
    ];

    // Generar nuevos prospectos hasta tener al menos 60
    const newProspects = [];
    const totalNeeded = 60 - existingProspects.length;

    for (let i = 0; i < totalNeeded; i++) {
      const name = generateRandomName();
      const dateObj = randomDate(startDate, endDate);

      newProspects.push({
        name,
        status: generateRandomStatus(),
        date: formatDate(dateObj),
        dateObj,
        phone: generateRandomPhone(),
        email: generateRandomEmail(name),
        gender: Math.random() > 0.5 ? "Masculino" : "Femenino",
        campaign: "Verano 2025",
        interests: "Varios",
        channels: "Varios",
        interactions: "Varios",
      });
    }

    // Agregar 10 prospectos adicionales con fecha específica del 29 de mayo de 2025
    const todayDate = new Date(2025, 4, 29); // 29 de mayo de 2025
    const todayProspects = [];

    for (let i = 0; i < 10; i++) {
      const name = generateRandomName();

      todayProspects.push({
        name,
        status: generateRandomStatus(),
        date: formatDate(todayDate),
        dateObj: new Date(todayDate),
        phone: generateRandomPhone(),
        email: generateRandomEmail(name),
        gender: Math.random() > 0.5 ? "Masculino" : "Femenino",
        campaign: "Verano 2025",
        interests: "Varios",
        channels: "Varios",
        interactions: "Varios",
      });
    }

    return [...existingProspects, ...newProspects, ...todayProspects];
  });

  const filteredProspects = useMemo(() => {
    let filtered = [...allProspects];

    // Aplicar filtro de tiempo
    if (timeFilter !== "todo") {
      const today = new Date(2025, 4, 29); // 29 de mayo de 2025 (fecha actual)
      today.setHours(0, 0, 0, 0);

      switch (timeFilter) {
        case "hoy":
          // Filtrar por la fecha actual (29 de mayo de 2025)
          filtered = filtered.filter((prospect) => {
            const prospectDate = new Date(prospect.dateObj);
            prospectDate.setHours(0, 0, 0, 0);
            return prospectDate.getTime() === today.getTime();
          });
          break;
        case "7dias":
          // Filtrar por los últimos 7 días
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          filtered = filtered.filter((prospect) => {
            return (
              prospect.dateObj >= sevenDaysAgo && prospect.dateObj <= today
            );
          });
          break;
        case "mes":
          // Filtrar por el último mes (30 días)
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          filtered = filtered.filter((prospect) => {
            return (
              prospect.dateObj >= thirtyDaysAgo && prospect.dateObj <= today
            );
          });
          break;
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((prospect) =>
        prospect.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "todos") {
      filtered = filtered.filter(
        (prospect) => prospect.status === statusFilter
      );
    }

    // Aplicar ordenamiento según los criterios seleccionados
    // Primero ordenamos por fecha si está seleccionado
    if (dateSort === "desc") {
      // Ordenar por fecha descendente (más reciente primero)
      filtered.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
    } else if (dateSort === "asc") {
      // Ordenar por fecha ascendente (más antigua primero)
      filtered.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    }

    // Si no hay ordenamiento por fecha o como criterio secundario, ordenar por nombre
    if (dateSort === "none" || (nameSort !== "none" && dateSort === "none")) {
      if (nameSort === "a-z") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (nameSort === "z-a") {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
      }
    } else if (nameSort !== "none") {
      // Si hay ordenamiento por fecha y nombre, aplicar nombre como criterio secundario
      filtered.sort((a, b) => {
        // Si las fechas son iguales, ordenar por nombre
        if (a.dateObj.getTime() === b.dateObj.getTime()) {
          return nameSort === "a-z"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        // Mantener el orden por fecha
        return dateSort === "desc"
          ? b.dateObj.getTime() - a.dateObj.getTime()
          : a.dateObj.getTime() - b.dateObj.getTime();
      });
    }

    return filtered;
  }, [searchTerm, statusFilter, nameSort, dateSort, allProspects, timeFilter]);

  // Si estamos en la vista de suscripción, renderizar el componente de suscripción
  if (currentView === "suscripcion") {
    return (
      <SubscriptionDashboard
        onViewChange={setCurrentView}
        allProspects={allProspects}
      />
    );
  }

  const openContactModal = (prospect: any) => {
    setSelectedProspect(prospect);
    setIsModalOpen(true);
  };

  const openInteractionModal = (prospect: any) => {
    setSelectedProspect(prospect);
    setIsInteractionModalOpen(true);
  };

  const openAddInteractionModal = (prospect: any) => {
    setSelectedProspect(prospect);
    setIsAddInteractionModalOpen(true);
  };

  // Función para agregar una nueva interacción
  const addNewInteraction = (prospectName: string, newInteraction: any) => {
    setProspectInteractions((prev) => ({
      ...prev,
      [prospectName]: [...(prev[prospectName] || []), newInteraction],
    }));

    // Si hay un cambio de estado, agregarlo al historial de estados
    if (newInteraction.statusChange) {
      const currentDate = new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Encontrar el prospecto para obtener su estado actual
      const prospect = allProspects.find((p) => p.name === prospectName);
      const currentStatus = prospect?.status || "Nuevo";

      const statusHistoryEntry = {
        date: currentDate,
        fromStatus: currentStatus,
        toStatus: newInteraction.statusChange.newStatus,
        description: newInteraction.statusChange.reason,
      };

      setProspectStatusHistory((prev) => ({
        ...prev,
        [prospectName]: [...(prev[prospectName] || []), statusHistoryEntry],
      }));

      // Actualizar el estado del prospecto en la lista
      const prospectIndex = allProspects.findIndex(
        (p) => p.name === prospectName
      );
      if (prospectIndex !== -1) {
        setAllProspects((prev) =>
          prev.map((prospect) =>
            prospect.name === prospectName
              ? { ...prospect, status: newInteraction.statusChange.newStatus }
              : prospect
          )
        );
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Nuevo: "#cd78de",
      Contactado: "#7e78de",
      Seguimiento: "#06b6d4",
      Convertido: "#10b981",
      Desestimado: "#ef4444",
      Recontactar: "#f59e0b",
    };

    return (
      <Badge
        style={{
          backgroundColor:
            statusConfig[status as keyof typeof statusConfig] || "#c7c7c7",
          color: "white",
          border: "none",
        }}
        className="px-4 py-1 rounded-full font-medium"
      >
        {status}
      </Badge>
    );
  };

  const CircularProgress = ({
    percentage,
    color,
  }: {
    percentage: number;
    color: string;
  }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = Math.round(circumference * 1000) / 1000;
    const strokeDashoffset =
      Math.round((circumference - (percentage / 100) * circumference) * 1000) /
      1000;

    return (
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color }}>
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  // Modificar la función getStatsData para incluir el total y el porcentaje de nuevos
  const getStatsData = () => {
    const total = filteredProspects.length;
    const nuevo = filteredProspects.filter((p) => p.status === "Nuevo").length;
    const contactado = filteredProspects.filter(
      (p) => p.status === "Contactado"
    ).length;
    const seguimiento = filteredProspects.filter(
      (p) => p.status === "Seguimiento"
    ).length;
    const convertido = filteredProspects.filter(
      (p) => p.status === "Convertido"
    ).length;

    return {
      total,
      nuevo,
      contactado,
      seguimiento,
      convertido,
      nuevoPercent: total > 0 ? Math.round((nuevo / total) * 100) : 0,
      contactadoPercent: total > 0 ? Math.round((contactado / total) * 100) : 0,
      seguimientoPercent:
        total > 0 ? Math.round((seguimiento / total) * 100) : 0,
      convertidoPercent: total > 0 ? Math.round((convertido / total) * 100) : 0,
    };
  };

  const stats = getStatsData();

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProspects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProspects.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      {/* Modern Collapsible Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 bg-gradient-to-b from-[#0f1729] to-[#7e78de] text-white flex-shrink-0 relative`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-white hover:bg-[#7e78de] bg-[#7e78de] rounded-lg h-12 transition-all duration-300`}
              onClick={() => setCurrentView("prospectos")}
            >
              <Prospecto className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="ml-3 transition-opacity duration-300 font-semibold">
                  Prospectos
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-white hover:bg-[#43407c] rounded-lg h-12 transition-all duration-300`}
              onClick={() => setCurrentView("suscripcion")}
            >
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="ml-3 transition-opacity duration-300 font-semibold">
                  Suscripción
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1
              className="text-xl lg:text-2xl font-semibold"
              style={{ color: "#7e78de" }}
            >
              CRM Suscripciones Streaming
            </h1>
          </div>
        </div>

        {/* Prospectos Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#000000]">
            Prospectos
          </h2>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full lg:w-32 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="hoy">Hoy</SelectItem>
              <SelectItem value="7dias">Últimos 7 días</SelectItem>
              <SelectItem value="mes">Último mes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="rounded-2xl p-3 lg:p-4 mb-6 bg-gradient-to-b from-[#0f1729] to-[#7e78de]">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 [&>div]:max-w-[220px] [&>div]:w-full">
            {/* Nueva tarjeta: Total de Prospectos */}
            <Card className="bg-white rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-lg">
                      <UserIcon className="h-10 w-10 text-[#7e78de]" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#656464] leading-tight">
                      Total de
                    </p>
                    <p className="text-sm font-semibold text-[#000000] leading-tight">
                      Prospectos
                    </p>
                    <p className="text-3xl font-bold text-[#000000] leading-tight">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta de Nuevos modificada con porcentaje */}
            <Card className="bg-white rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-4">
                  {/* CircularProgress (NO tocar) */}
                  <div className="flex-shrink-0">
                    <CircularProgress
                      percentage={stats.nuevoPercent}
                      color="#cd78de"
                    />
                  </div>

                  {/* Info al lado derecho */}
                  <div className="flex-1">
                    <p className="text-xs text-[#656464] leading-tight">
                      Prospectos
                    </p>
                    <p className="text-sm font-semibold text-black leading-tight">
                      Nuevos
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      {/* Ícono + badge */}
                      <div className="relative w-7 h-8">
                        <UserNewIcon className="h-8 w-8  text-[#cd78de]" />
                      </div>
                      {/* Número */}
                      <p className="text-3xl font-bold text-black leading-tight">
                        {stats.nuevo}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-4">
                  {/* CircularProgress (NO tocar) */}
                  <div className="flex-shrink-0">
                    <CircularProgress
                      percentage={stats.contactadoPercent}
                      color="#7e78de"
                    />
                  </div>

                  {/* Info al lado derecho */}
                  <div className="flex-1">
                    <p className="text-xs text-[#656464] leading-tight">
                      Prospectos
                    </p>
                    <p className="text-sm font-semibold text-black leading-tight">
                      Contactados
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      {/* Ícono personalizado */}
                      <div className="relative w-6 h-6">
                        <MessageIcon className="w-7 h-7 text-[#7e78de]" />
                      </div>

                      {/* Número */}
                      <p className="text-3xl font-bold text-black leading-tight">
                        {stats.contactado}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-4">
                  {/* CircularProgress (NO tocar) */}
                  <div className="flex-shrink-0">
                    <CircularProgress
                      percentage={stats.seguimientoPercent}
                      color="#06b6d4"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-xs text-[#656464] leading-tight">
                      Prospectos en
                    </p>
                    <p className="text-sm font-semibold text-black leading-tight">
                      Seguimiento
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      {/* Ícono personalizado */}
                      <div className="relative w-6 h-6">
                        <UserSearchIcon className="w-7 h-7 text-[#06b6d4]" />
                      </div>

                      {/* Número */}
                      <p className="text-3xl font-bold text-black leading-tight">
                        {stats.seguimiento}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-4">
                  {/* CircularProgress (NO tocar) */}
                  <div className="flex-shrink-0">
                    <CircularProgress
                      percentage={stats.convertidoPercent}
                      color="#10b981"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-xs text-[#656464] leading-tight">
                      Prospectos
                    </p>
                    <p className="text-sm font-semibold text-black leading-tight">
                      Convertidos
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      {/* Ícono: CheckCircle */}
                      <div className="relative w-6 h-6">
                        <CheckCircle className="w-7 h-7 text-[#10b981]" />
                      </div>

                      {/* Número */}
                      <p className="text-3xl font-bold text-black leading-tight">
                        {stats.convertido}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48 rounded-full">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="Nuevo">Nuevo</SelectItem>
              <SelectItem value="Contactado">Contactado</SelectItem>
              <SelectItem value="Seguimiento">Seguimiento</SelectItem>
              <SelectItem value="Convertido">Convertido</SelectItem>
              <SelectItem value="Desestimado">Desestimado</SelectItem>
              <SelectItem value="Recontactar">Recontactar</SelectItem>
            </SelectContent>
          </Select>

          <Select value={nameSort} onValueChange={setNameSort}>
            <SelectTrigger className="w-full lg:w-56 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a-z">Ordenar por nombre de A-Z</SelectItem>
              <SelectItem value="z-a">Ordenar por nombre de Z-A</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateSort} onValueChange={setDateSort}>
            <SelectTrigger className="w-full lg:w-56 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin ordenar por fecha</SelectItem>
              <SelectItem value="desc">
                Fecha asignada: más reciente primero
              </SelectItem>
              <SelectItem value="asc">
                Fecha asignada: más antigua primero
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#656464]" />
            <Input
              placeholder="Buscar por nombre..."
              className="pl-10 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Container with Scroll */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="border-b bg-white sticky top-0 z-10">
                <tr>
                  <th className="text-left p-4 font-semibold text-[#000000]">
                    Nombre
                  </th>
                  <th className="text-left p-4 font-semibold text-[#000000]">
                    Estado
                  </th>
                  <th className="text-left p-4 font-semibold text-[#000000]">
                    Fecha asignada
                  </th>
                  <th className="text-left p-4 font-semibold text-[#000000]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((prospect, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <button
                        className="text-[#000000] hover:text-[#7e78de] hover:underline cursor-pointer text-left"
                        onClick={() => openContactModal(prospect)}
                      >
                        {prospect.name}
                      </button>
                    </td>
                    <td className="p-4">{getStatusBadge(prospect.status)}</td>
                    <td className="p-4 text-[#656464]">{prospect.date}</td>
                    <td className="p-4">
                      <div className="flex flex-col lg:flex-row gap-2">
                        <ContactPopover prospect={prospect} />
                        <Button
                          size="sm"
                          style={{ backgroundColor: "#7e78de" }}
                          className="text-white hover:opacity-90 text-xs rounded-full"
                          onClick={() => openAddInteractionModal(prospect)}
                        >
                          Interacción
                        </Button>
                        <Button
                          size="sm"
                          style={{ backgroundColor: "#7e78de" }}
                          className="text-white hover:opacity-90 text-xs rounded-full"
                          onClick={() => openInteractionModal(prospect)}
                        >
                          Historial
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Mostrando {indexOfFirstItem + 1} a{" "}
                {Math.min(indexOfLastItem, filteredProspects.length)} de{" "}
                {filteredProspects.length} resultados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => paginate(pageNumber)}
                      style={{
                        backgroundColor:
                          currentPage === pageNumber ? "#7e78de" : undefined,
                        borderColor:
                          currentPage === pageNumber ? "#7e78de" : undefined,
                      }}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {filteredProspects.length === 0 && (
          <div className="text-center py-8 text-[#656464]">
            No se encontraron prospectos que coincidan con los filtros
            aplicados.
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-0 overflow-hidden rounded-2xl bg-white">
          <div className="bg-white">
            {/* Header */}
            <DialogHeader className="text-2xl font-bold p-6 pb-4">
              <DialogTitle className="text-2xl font-bold text-[#000000]">
                Perfil
              </DialogTitle>
            </DialogHeader>

            {/* Content */}
            <div className="px-6 pb-0">
              {/* Personal Data Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#000000] mb-4">
                  Datos Personales
                </h3>
                <div className="flex gap-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, #e91e63 0%, #ff9800 100%)",
                      }}
                    >
                      {selectedProspect?.name?.charAt(0)}
                    </div>
                  </div>

                  {/* Personal Info Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[#656464] font-medium">Nombre</p>
                      <p className="text-[#000000]">{selectedProspect?.name}</p>
                    </div>
                    <div>
                      <p className="text-[#656464] font-medium">Teléfono</p>
                      <p className="text-[#000000]">
                        {selectedProspect?.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#656464] font-medium">Género</p>
                      <p className="text-[#000000]">
                        {selectedProspect?.gender}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#656464] font-medium">Correo</p>
                      <p className="text-[#000000] text-xs break-words max-w-[100px]">
                        {selectedProspect?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Data Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#000000] mb-4">
                  Datos de Campaña
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#656464] font-medium">
                      Nombre de la campaña
                    </p>
                    <p className="text-[#000000]">
                      {selectedProspect?.campaign}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#656464] font-medium">
                      Categoría de interés
                    </p>
                    <p className="text-[#000000]">
                      {selectedProspect?.interests}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#656464] font-medium">
                      Canales de origen
                    </p>
                    <p className="text-[#000000]">
                      {selectedProspect?.channels}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#656464] font-medium">Interacciones</p>
                    <p className="text-[#000000]">
                      {selectedProspect?.interactions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="mb-6 flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#000000]">Estado</h3>
                <div className="">
                  {selectedProspect && getStatusBadge(selectedProspect.status)}
                </div>
              </div>
            </div>

            {/* Contact Channels Footer */}
            <div className="overflow-hidden">
              {/* Purple section */}
              <div
                className="p-2 flex flex-col items-center justify-center w-full"
                style={{ backgroundColor: "#7e78de" }}
              >
                <h3 className="text-lg font-bold text-white text-left">
                  Canales de Contacto
                </h3>
              </div>

              {/* Dark section with icons */}
              <div className="bg-[#0f1729] p-6 flex flex-row justify-center items-center gap-4">
                <a className="w-12 h-12 flex items-center justify-center rounded-sm cursor-pointer group hover:bg-white transition-all duration-300 ease-in-out">
                  <Linkedin className="h-7 w-7 flex items-center justify-center text-white group-hover:text-black transition-all duration-300 ease-in-out" />
                </a>
                <a className="w-12 h-12 flex items-center justify-center rounded-sm cursor-pointer group hover:bg-white transition-all duration-300 ease-in-out">
                  <Facebook className="h-7 w-7 flex items-center justify-center text-white group-hover:text-black transition-all duration-300 ease-in-out" />
                </a>
                <a className="w-12 h-12 flex items-center justify-center rounded-sm cursor-pointer group hover:bg-white transition-all duration-300 ease-in-out">
                  <Instagram className="h-7 w-7 flex items-center justify-center text-white group-hover:text-black transition-all duration-300 ease-in-out" />
                </a>
                <a className="w-12 h-12 flex items-center justify-center rounded-sm cursor-pointer group hover:bg-white transition-all duration-300 ease-in-out">
                  <Telegram className="h-7 w-7 flex items-center justify-center text-white group-hover:text-black transition-all duration-300 ease-in-out" />
                </a>
                <a className="w-12 h-12 flex items-center justify-center rounded-sm cursor-pointer group hover:bg-white transition-all duration-300 ease-in-out">
                  <WhatsApp className="h-7 w-7 flex items-center justify-center text-white group-hover:text-black transition-all duration-300 ease-in-out" />
                </a>
                <a className="w-12 h-12 flex items-center justify-center rounded-sm cursor-pointer group hover:bg-white transition-all duration-300 ease-in-out">
                  <TikTok className="h-7 w-7 flex items-center justify-center text-white group-hover:text-black transition-all duration-300 ease-in-out" />
                </a>

                <a className="w-12 h-12 flex items-center justify-center rounded-sm cursor-pointer group hover:bg-white transition-all duration-300 ease-in-out">
                  <Twitter className="h-7 w-7 flex items-center justify-center text-white group-hover:text-black transition-all duration-300 ease-in-out" />
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interaction History Modal */}
      <InteractionModal
        isOpen={isInteractionModalOpen}
        onClose={() => setIsInteractionModalOpen(false)}
        prospect={selectedProspect}
        prospectInteractions={
          prospectInteractions[selectedProspect?.name] || []
        }
        prospectStatusHistory={
          prospectStatusHistory[selectedProspect?.name] || []
        }
      />

      {/* Add Interaction Modal */}
      <AddInteractionModal
        isOpen={isAddInteractionModalOpen}
        onClose={() => setIsAddInteractionModalOpen(false)}
        prospect={selectedProspect}
        onSave={addNewInteraction}
      />
    </div>
  );
}
