import { MessageCircle } from "lucide-react";
import { SCHOOL_CONFIG } from "@/lib/config";

export function HomeFloatingWa() {
  const waUrl = SCHOOL_CONFIG.contacts.fadil.waLink;

  return (
    <aside aria-label="Bantuan WhatsApp" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl active:scale-95 transition-all min-h-[44px] min-w-[44px] focus:outline-none focus:ring-4 focus:ring-emerald-300"
        aria-label="Tanya Humas via WhatsApp"
      >
        <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="hidden xs:inline sm:inline">Tanya Humas</span>
      </a>
    </aside>
  );
}

