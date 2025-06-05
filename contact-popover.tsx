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
  Telegram,
  WhatsApp,
  TikTok,
  Twitter,
  Send,
  Mail,
} from "@/icons";

interface ContactPopoverProps {
  prospect: any;
}

export function ContactPopover({ prospect }: ContactPopoverProps) {
  const contactOptions = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5 text-[#7E78DE]" />,
      bgColor: "white",
      action: () => console.log("Contactar por LinkedIn", prospect),
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5 text-[#7E78DE]" />,
      bgColor: "white",
      action: () => console.log("Contactar por Facebook", prospect),
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5 text-[#7E78DE]" />,
      bgColor: "white",
      action: () => console.log("Contactar por Instagram", prospect),
    },
    {
      name: "TikTok",
      icon: <TikTok className="h-5 w-5 text-[#7E78DE]" />,
      bgColor: "white",
      action: () => console.log("Contactar por TikTok", prospect),
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5 text-[#7E78DE]" />,
      bgColor: "white",
      action: () => console.log("Contactar por Twitter", prospect),
    },
    {
      name: "Telegram",
      icon: <Telegram className="h-5 w-5 text-[#7E78DE]" />,
      bgColor: "white",
      action: () => console.log("Contactar por Telegram", prospect),
    },
    {
      name: "WhatsApp",
      icon: <WhatsApp className="h-5 w-5 text-[#7E78DE]" />,
      bgColor: "white",
      action: () => console.log("Contactar por WhatsApp", prospect),
    },
    {
      name: "E-mail",
      icon: <Mail className="h-5 w-5 text-[#7E78DE]" />,
      bgColor: "white",
      action: () => console.log("Contactar por E-mail", prospect),
    },
    {
      name: "Llamar",
      icon: <Send className="h-5 w-5 text-[#7E78DE]" />,
      bgColor: "white",
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
              className="w-full flex items-center justify-between p-1.5  hover:bg-gray-500 rounded-md transition-colors text-left group"
            >
              <span className="text-xs font-medium text-gray-900 group-hover:text-white">
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
