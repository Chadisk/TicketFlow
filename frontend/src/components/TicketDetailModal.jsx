import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './TicketCard';
import { getTranslations } from '../i18n';

const formatTicketDate = (value, lang) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const locale = lang === 'th' ? 'th-TH' : 'en-US';
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const TicketDetailModal = ({ ticket, onClose, theme = 'light', copy, lang = 'en' }) => {
  const isDark = theme === 'dark';
  const translations = copy || getTranslations(lang);
  const t = translations.ticketDetails;

  useEffect(() => {
    if (!ticket) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [ticket, onClose]);

  if (!ticket || typeof document === 'undefined') {
    return null;
  }

  const createdAt = formatTicketDate(ticket.created_at, lang) || translations.card.notAvailable;
  const updatedAt = formatTicketDate(ticket.updated_at, lang) || translations.card.notAvailable;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" />
      <Card
        theme={theme}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-detail-title"
        className={`relative z-10 w-full max-w-2xl overflow-hidden border shadow-2xl ${isDark ? 'border-stone-700/80 bg-stone-950 text-stone-100' : 'border-stone-200 bg-white text-stone-900'}`}
      >
        <div className={`h-1 bg-gradient-to-r ${isDark ? 'from-amber-400 via-orange-400 to-rose-500' : 'from-amber-400 via-orange-400 to-rose-300'}`} />
        <CardHeader className={`flex items-start justify-between gap-4 border-0 ${isDark ? 'bg-transparent' : 'bg-white'}`}>
          <div className="min-w-0 space-y-2">
            <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              {t.title}
            </p>
            <CardTitle id="ticket-detail-title" className={`text-2xl ${isDark ? 'text-stone-50' : 'text-stone-950'}`}>
              {ticket.title}
            </CardTitle>
          </div>
          <Button theme={theme} variant="ghost" onClick={onClose} className={`${isDark ? 'text-stone-200 hover:bg-stone-900' : 'text-stone-700 hover:bg-stone-100'}`}>
            {t.close}
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 p-6 pt-0">
          <div className="flex flex-wrap items-center gap-3">
            <Badge theme={theme} status={ticket.status} copy={translations} />
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'bg-stone-900 text-stone-300 ring-1 ring-stone-700' : 'bg-stone-100 text-stone-600 ring-1 ring-stone-200'}`}>
              {t.ticketId} #{ticket.id}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`rounded-2xl border p-4 ${isDark ? 'border-stone-800 bg-stone-900/70' : 'border-stone-200 bg-stone-50'}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{t.contact}</p>
              <p className={`mt-2 break-words text-sm ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>{ticket.contact_info}</p>
            </div>

            <div className={`rounded-2xl border p-4 ${isDark ? 'border-stone-800 bg-stone-900/70' : 'border-stone-200 bg-stone-50'}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{t.status}</p>
              <div className="mt-2">
                <Badge theme={theme} status={ticket.status} copy={translations} />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border p-4 ${isDark ? 'border-stone-800 bg-stone-900/70' : 'border-stone-200 bg-stone-50'}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{t.description}</p>
            <p className={`mt-3 whitespace-pre-wrap text-sm leading-7 ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
              {ticket.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`rounded-2xl border p-4 ${isDark ? 'border-stone-800 bg-stone-900/70' : 'border-stone-200 bg-stone-50'}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{t.createdAt}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>{createdAt}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? 'border-stone-800 bg-stone-900/70' : 'border-stone-200 bg-stone-50'}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{t.updatedAt}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>{updatedAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};
