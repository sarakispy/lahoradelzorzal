import React from 'react';
import { ZorzalLogo } from './ZorzalLogo.tsx';
import { RadioConfig } from '../types.ts';
import { MessageSquare } from 'lucide-react';

interface FooterProps {
  config: RadioConfig;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  const currentYear = new Date().getFullYear();
  const rawNumber = config.whatsapp_number || '595981123456';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const message = config.whatsapp_message || '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <footer className="w-full bg-[#0D0B0E] border-t border-[#D4AF37]/20 py-4 px-4 sm:px-6 shrink-0">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <ZorzalLogo size={32} showText={false} />
          <div>
            <span className="font-serif-display font-bold text-sm text-[#FAF7F2] tracking-wider">
              {config.station_name || 'LA HORA DEL ZORZAL'}
            </span>
            <span className="text-[#D4AF37] text-[11px] ml-2 hidden md:inline">
              · {config.slogan || 'El Canto de Nuestra Tierra'}
            </span>
          </div>
        </div>

        {/* WhatsApp & Copyright */}
        <div className="flex items-center gap-5 text-[#FAF7F2]/60">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp (+{cleanNumber})</span>
          </a>

          <span>© {currentYear} Todos los derechos reservados</span>
        </div>

      </div>
    </footer>
  );
};
