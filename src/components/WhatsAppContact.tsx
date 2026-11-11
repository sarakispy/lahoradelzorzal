import React from 'react';
import { MessageCircle } from 'lucide-react';
import { RadioConfig } from '../types.ts';

interface WhatsAppContactProps {
  config: RadioConfig;
}

export const WhatsAppContact: React.FC<WhatsAppContactProps> = ({ config }) => {
  const rawNumber = config.whatsapp_number || '595985160699';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const message = config.whatsapp_message || '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <section id="contacto" className="w-full py-16 md:py-24 px-4 sm:px-6 relative">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        
        {/* Subtle decorative divider with Zorzal feather / harp accent */}
        <div className="flex items-center justify-center gap-4 text-[#D4AF37]/50">
          <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
          <span className="text-xs uppercase tracking-[0.25em] font-serif-display text-[#D4AF37]">
            Línea Directa con los Oyentes
          </span>
          <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
        </div>

        {/* Section Heading */}
        <div className="space-y-3">
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF7F2]">
            CONTACTANOS
          </h2>
          <p className="text-base sm:text-lg text-[#FAF7F2]/80 max-w-xl mx-auto font-light">
            ¿Querés comunicarte con nosotros? Escribinos directamente por WhatsApp.
          </p>
        </div>

        {/* Big WhatsApp CTA Button */}
        <div className="pt-2 flex flex-col items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3.5 px-8 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-[0_10px_30px_rgba(37,211,102,0.35)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50"
          >
            {/* Official WhatsApp SVG Icon */}
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 fill-current shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.7C7.02 10.92 7.91 12.09 8.03 12.25C8.16 12.41 9.77 14.9 12.24 15.96C12.83 16.21 13.28 16.36 13.64 16.48C14.23 16.67 14.77 16.64 15.2 16.58C15.68 16.51 16.68 15.97 16.89 15.38C17.1 14.79 17.1 14.28 17.04 14.18C16.98 14.07 16.81 14.01 16.56 13.88C16.31 13.76 15.08 13.15 14.85 13.07C14.62 12.99 14.46 12.95 14.29 13.19C14.13 13.44 13.65 14.01 13.51 14.18C13.36 14.34 13.22 14.36 12.97 14.24C12.72 14.11 11.92 13.85 10.97 13.01C10.23 12.35 9.73 11.54 9.58 11.29C9.44 11.04 9.57 10.91 9.69 10.78C9.8 10.67 9.94 10.49 10.07 10.34C10.2 10.19 10.24 10.08 10.32 9.92C10.4 9.75 10.36 9.61 10.3 9.49C10.24 9.36 9.77 8.2 9.57 7.74C9.38 7.29 9.19 7.35 9.04 7.34C8.9 7.33 8.73 7.33 8.53 7.33Z"/>
            </svg>
            <span className="tracking-wide uppercase font-extrabold whitespace-nowrap">
              ESCRIBINOS POR WHATSAPP
            </span>
          </a>

          {/* Number Display */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#FAF7F2]/60 pt-2">
            <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>Número de atención: <strong className="text-[#FAF7F2] font-mono font-medium">+{cleanNumber}</strong></span>
          </div>

          <p className="text-xs text-[#FAF7F2]/50 italic max-w-md text-center">
            Envianos tus saludos, pedidos de polcas y guaranias, o comentarios sobre nuestra programación.
          </p>
        </div>

      </div>
    </section>
  );
};
