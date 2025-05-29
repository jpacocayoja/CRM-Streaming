"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Linkedin,
  Facebook,
  Instagram,
  Music,
  Twitter,
  Send,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react";

interface ContactPopoverProps {
  prospect: any;
}

export function ContactPopover({ prospect }: ContactPopoverProps) {
  const contactOptions = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-4 w-4 text-white" />,
      bgColor: "#0077B5",
      action: () => console.log("Contactar por LinkedIn", prospect),
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-4 w-4 text-white" />,
      bgColor: "#1877F2",
      action: () => console.log("Contactar por Facebook", prospect),
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-4 w-4 text-white" />,
      bgColor: "#E4405F",
      action: () => console.log("Contactar por Instagram", prospect),
    },
    {
      name: "TikTok",
      icon: <Music className="h-4 w-4 text-white" />,
      bgColor: "#000000",
      action: () => console.log("Contactar por TikTok", prospect),
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-4 w-4 text-white" />,
      bgColor: "#1DA1F2",
      action: () => console.log("Contactar por Twitter", prospect),
    },
    {
      name: "Telegram",
      icon: <Send className="h-4 w-4 text-white" />,
      bgColor: "#0088cc",
      action: () => console.log("Contactar por Telegram", prospect),
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4 text-white" />,
      bgColor: "#25D366",
      action: () => console.log("Contactar por WhatsApp", prospect),
    },
    {
      name: "E-mail",
      icon: <Mail className="h-4 w-4 text-white" />,
      bgColor: "#7e78de",
      action: () => console.log("Contactar por E-mail", prospect),
    },
    {
      name: "Llamar",
      icon: <Phone className="h-4 w-4 text-white" />,
      bgColor: "#4CAF50",
      action: () => console.log("Llamar a", prospect),
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          style={{ backgroundColor: "#7e78de" }}
          className="text-white hover:opacity-90 text-xs rounded-full"
        >
          Contacto
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-40 p-1 rounded-lg shadow-lg border"
        align="start"
      >
        <div className="space-y-0.5">
          {contactOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="w-full flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-md transition-colors text-left"
            >
              <span className="text-xs font-medium text-gray-900">
                {option.name}
              </span>
              <div
                className="p-1 rounded-md flex items-center justify-center"
                style={{ backgroundColor: option.bgColor }}
              >
                {option.icon}
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
