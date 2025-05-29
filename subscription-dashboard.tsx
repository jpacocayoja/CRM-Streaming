"use client";

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
import {
  Menu,
  User,
  CheckCircle,
  Search,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ContactPopover } from "./contact-popover";
import { Badge } from "@/components/ui/badge";

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

interface SubscriptionDashboardProps {
  onViewChange?: (view: string) => void;
  allProspects: any[];
}

export default function SubscriptionDashboard({
  onViewChange,
  allProspects,
}: SubscriptionDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeFilter, setTimeFilter] = useState("todo");
  const [activeTab, setActiveTab] = useState("prueba-gratuita");
  const [trialFilter, setTrialFilter] = useState("todos");
  const [subscriptionFilter, setSubscriptionFilter] = useState("todos");
  const [planFilter, setPlanFilter] = useState("todos");
  const [nameSort, setNameSort] = useState("a-z");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Helper function to parse date from dd/mm/yyyy format
  const parseDate = (dateStr: string) => {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const day = Number.parseInt(parts[0], 10);
      const month = Number.parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = Number.parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date();
  };

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to add days to a date
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Helper function to calculate days remaining
  const calculateDaysRemaining = (endDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Filter prospects by status for each section
  const trialsData = useMemo(() => {
    return allProspects
      .filter((prospect) => prospect.status === "Seguimiento")
      .map((prospect) => {
        // Parse the prospect's assigned date
        const assignedDate = parseDate(prospect.date);

        // Start date should be between assigned date and 30 days after
        const minStartDate = assignedDate;
        const maxStartDate = addDays(assignedDate, 30);
        const randomDaysAfterAssigned = Math.floor(Math.random() * 31); // 0-30 days
        const startDate = addDays(assignedDate, randomDaysAfterAssigned);

        // End date is 7 days after start date (trial period)
        const endDate = addDays(startDate, 7);

        return {
          name: prospect.name,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          daysRemaining: calculateDaysRemaining(endDate),
          status: "active",
          prospectStatus: prospect.status,
        };
      });
  }, [allProspects]);

  const subscriptionsData = useMemo(() => {
    const plans = [
      { name: "Mensual Básico", duration: 30 },
      { name: "Mensual Estándar", duration: 30 },
      { name: "Mensual Premium", duration: 30 },
      { name: "Anual Básico", duration: 365 },
      { name: "Anual Estándar", duration: 365 },
      { name: "Anual Premium", duration: 365 },
    ];

    return allProspects
      .filter((prospect) => prospect.status === "Convertido")
      .map((prospect) => {
        // Parse the prospect's assigned date
        const assignedDate = parseDate(prospect.date);

        // Start date should be between assigned date and 60 days after (more time for conversion)
        const minStartDate = assignedDate;
        const maxStartDate = addDays(assignedDate, 60);
        const randomDaysAfterAssigned = Math.floor(Math.random() * 61); // 0-60 days
        const startDate = addDays(assignedDate, randomDaysAfterAssigned);

        // Select random plan
        const selectedPlan = plans[Math.floor(Math.random() * plans.length)];

        // End date based on plan duration
        const endDate = addDays(startDate, selectedPlan.duration);

        return {
          name: prospect.name,
          plan: selectedPlan.name,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          daysRemaining: calculateDaysRemaining(endDate),
          status: "active",
          prospectStatus: prospect.status,
        };
      });
  }, [allProspects]);

  const currentData =
    activeTab === "prueba-gratuita" ? trialsData : subscriptionsData;

  const filteredData = useMemo(() => {
    let filtered = [...currentData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab === "prueba-gratuita") {
      // Filter by trial status (only for prueba-gratuita tab)
      if (trialFilter !== "todos") {
        switch (trialFilter) {
          case "activas":
            filtered = filtered.filter((item) => item.daysRemaining > 0);
            break;
          case "expiradas":
            filtered = filtered.filter((item) => item.daysRemaining === 0);
            break;
          case "por-vencer":
            filtered = filtered.filter(
              (item) => item.daysRemaining === 1 || item.daysRemaining === 2
            );
            break;
        }
      }
    } else {
      // Filter by subscription status (only for suscritos tab)
      if (subscriptionFilter !== "todos") {
        switch (subscriptionFilter) {
          case "activas":
            filtered = filtered.filter((item) => item.daysRemaining > 0);
            break;
          case "por-vencer":
            filtered = filtered.filter(
              (item) => item.daysRemaining <= 30 && item.daysRemaining > 0
            );
            break;
          case "vencidas":
            filtered = filtered.filter((item) => item.daysRemaining <= 0);
            break;
        }
      }

      // Filter by plan (only for suscritos tab)
      if (planFilter !== "todos") {
        filtered = filtered.filter((item) => {
          const subscription = item as any;
          return subscription.plan
            ?.toLowerCase()
            .includes(planFilter.toLowerCase());
        });
      }
    }

    // Sort by name
    if (nameSort === "a-z") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (nameSort === "z-a") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }, [
    searchTerm,
    nameSort,
    currentData,
    trialFilter,
    subscriptionFilter,
    planFilter,
    activeTab,
  ]);

  const CircularProgress = ({
    percentage,
    color,
  }: {
    percentage: number;
    color: string;
  }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

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

  const getStatsData = () => {
    // Calculate stats based on filtered prospect data
    const totalTrials = trialsData.length;
    const activeTrials = trialsData.filter(
      (trial) => trial.daysRemaining > 0
    ).length;
    const expiringTrials = trialsData.filter(
      (trial) => trial.daysRemaining === 1 || trial.daysRemaining === 2
    ).length;

    return {
      freeTrials: totalTrials,
      trialsInUse: activeTrials,
      trialsInUsePercent:
        totalTrials > 0 ? Math.round((activeTrials / totalTrials) * 100) : 0,
      subscribedClients: subscriptionsData.length,
      subscriptionsExpiring: expiringTrials,
      subscriptionsExpiringPercent:
        totalTrials > 0 ? Math.round((expiringTrials / totalTrials) * 100) : 0,
    };
  };

  const stats = getStatsData();

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
              } text-white hover:bg-[#43407c] rounded-lg h-12 transition-all duration-300`}
              onClick={() => onViewChange?.("prospectos")}
            >
              <User className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="ml-3 transition-opacity duration-300">
                  Prospectos
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-white hover:bg-[#7e78de] bg-[#7e78de] rounded-lg h-12 transition-all duration-300`}
            >
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="ml-3 transition-opacity duration-300">
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

        {/* Subscription Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#000000]">
            Suscripción
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="rounded-2xl p-3 lg:p-4 mb-6 bg-gradient-to-b from-[#0f1729] to-[#7e78de]">
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 [&>div]:max-w-[220px] [&>div]:w-full">
            <Card className="bg-white rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-lg">
                      <Clock className="h-10 w-10 text-[#7e78de]" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#656464] leading-tight">
                      Pruebas
                    </p>
                    <p className="text-sm font-semibold text-[#000000] leading-tight">
                      Gratuitas
                    </p>
                    <p className="text-3xl font-bold text-[#000000] leading-tight">
                      {stats.freeTrials}
                    </p>
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
                      percentage={stats.trialsInUsePercent}
                      color="#7e78de"
                    />
                  </div>

                  {/* Info al lado derecho */}
                  <div className="flex-1">
                    <p className="text-xs text-[#656464] leading-tight">
                      Pruebas gratuitas
                    </p>
                    <p className="text-sm font-semibold text-black leading-tight">
                      En Uso
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      {/* Ícono */}
                      <div className="relative w-7 h-8">
                        <Clock className="h-8 w-8 text-[#7e78de]" />
                      </div>
                      {/* Número */}
                      <p className="text-3xl font-bold text-black leading-tight">
                        {stats.trialsInUse}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-lg">
                      <CheckCircle className="h-10 w-10 text-[#7e78de]" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#656464] leading-tight">
                      Clientes
                    </p>
                    <p className="text-sm font-semibold text-[#000000] leading-tight">
                      Suscritos
                    </p>
                    <p className="text-3xl font-bold text-[#000000] leading-tight">
                      {stats.subscribedClients}
                    </p>
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
                      percentage={stats.subscriptionsExpiringPercent}
                      color="#7e78de"
                    />
                  </div>

                  {/* Info al lado derecho */}
                  <div className="flex-1">
                    <p className="text-xs text-[#656464] leading-tight">
                      Suscripciones
                    </p>
                    <p className="text-sm font-semibold text-black leading-tight">
                      Por vencer
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      {/* Ícono */}
                      <div className="relative w-7 h-8">
                        <CheckCircle className="h-8 w-8 text-[#7e78de]" />
                      </div>
                      {/* Número */}
                      <p className="text-3xl font-bold text-black leading-tight">
                        {stats.subscriptionsExpiring}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setActiveTab("prueba-gratuita")}
            className={`px-8 py-2 rounded-full font-medium ${
              activeTab === "prueba-gratuita"
                ? "text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            style={{
              backgroundColor:
                activeTab === "prueba-gratuita" ? "#7e78de" : undefined,
            }}
          >
            Prueba Gratuita
          </Button>
          <Button
            onClick={() => setActiveTab("suscritos")}
            className={`px-8 py-2 rounded-full font-medium ${
              activeTab === "suscritos"
                ? "text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            style={{
              backgroundColor:
                activeTab === "suscritos" ? "#7e78de" : undefined,
            }}
          >
            Suscritos
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {activeTab === "prueba-gratuita" ? (
            <>
              <Select value={trialFilter} onValueChange={setTrialFilter}>
                <SelectTrigger className="w-full lg:w-48 rounded-full">
                  <SelectValue placeholder="Todos las pruebas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos las pruebas</SelectItem>
                  <SelectItem value="activas">Activas</SelectItem>
                  <SelectItem value="expiradas">Expiradas</SelectItem>
                  <SelectItem value="por-vencer">Por vencer</SelectItem>
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
            </>
          ) : (
            <>
              <Select
                value={subscriptionFilter}
                onValueChange={setSubscriptionFilter}
              >
                <SelectTrigger className="w-full lg:w-48 rounded-full">
                  <SelectValue placeholder="Todos las suscripciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos las suscripciones</SelectItem>
                  <SelectItem value="activas">Activas</SelectItem>
                  <SelectItem value="por-vencer">Por vencer</SelectItem>
                  <SelectItem value="vencidas">Vencidas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full lg:w-48 rounded-full">
                  <SelectValue placeholder="Todos los planes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los planes</SelectItem>
                  <SelectItem value="básico">Básico</SelectItem>
                  <SelectItem value="estándar">Estándar</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
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
            </>
          )}

          <div className="relative w-full lg:w-64 lg:ml-auto">
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
                  {activeTab === "prueba-gratuita" ? (
                    <>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Prospecto
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Estado
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Inicio
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Fin
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Días Restantes
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Acciones
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Cliente
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Estado
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Plan de Suscripción
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Inicio
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Fin
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Tiempo restante
                      </th>
                      <th className="text-left p-4 font-semibold text-[#000000]">
                        Acciones
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <span className="text-[#000000] font-medium">
                        {item.name}
                      </span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge((item as any).prospectStatus)}
                    </td>
                    {activeTab === "suscritos" && (
                      <td className="p-4">
                        <span className="text-[#000000]">
                          {(item as any).plan}
                        </span>
                      </td>
                    )}
                    <td className="p-4 text-[#656464]">{item.startDate}</td>
                    <td className="p-4 text-[#656464]">{item.endDate}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <Clock className="h-5 w-5 text-[#7e78de]" />
                        </div>
                        <span className="text-[#000000] font-medium">
                          {item.daysRemaining}{" "}
                          {item.daysRemaining === 1 ? "día" : "días"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <ContactPopover prospect={item} />
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
                {Math.min(indexOfLastItem, filteredData.length)} de{" "}
                {filteredData.length} resultados
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

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-[#656464]">
            No se encontraron{" "}
            {activeTab === "prueba-gratuita"
              ? "pruebas gratuitas"
              : "suscripciones"}{" "}
            que coincidan con los filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
}
