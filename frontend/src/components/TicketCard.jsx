import React from 'react';
import { Card, CardContent } from './Card';
import { getTranslations } from '../i18n';

export const Badge = ({ status = 'pending', theme = 'light', copy }) => {
  const isDark = theme === 'dark';
  const translations = copy || getTranslations('en');
  const label = translations.kanban.statuses[status] || status;
  const statusColors = {
    pending: isDark ? 'bg-amber-950/50 text-amber-200 ring-1 ring-amber-900/70' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    accepted: isDark ? 'bg-orange-950/50 text-orange-200 ring-1 ring-orange-900/70' : 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    resolved: isDark ? 'bg-emerald-950/50 text-emerald-200 ring-1 ring-emerald-900/70' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    rejected: isDark ? 'bg-rose-950/50 text-rose-200 ring-1 ring-rose-900/70' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusColors[status] || statusColors.pending}`}>
      {label}
    </span>
  );
};

export const TicketCard = ({ ticket, onClick, draggableProps, dragHandleProps, className = '', theme = 'light', copy, lang = 'en', isDragging = false }) => {
  const isDark = theme === 'dark';
  const translations = copy || getTranslations('en');
  const t = translations.card;
  const truncateText = (text, length) => (text.length > length ? `${text.substring(0, length)}...` : text);
  const dateLocale = lang === 'th' ? 'th-TH' : 'en-US';
  const updatedAt = ticket.updated_at ? new Date(ticket.updated_at).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' }) : translations.card.notAvailable;
  const handleKeyDown = (event) => {
    if (!onClick) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event);
    }
  };

  const handlePointerUp = (event) => {
    if (!onClick || isDragging || event.button !== 0) {
      return;
    }

    onClick(event);
  };

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${t.ticket} #${ticket.id}` : undefined}
      className={`group mb-3 ${onClick ? 'cursor-grab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40' : 'cursor-move'} transition-all duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <Card theme={theme} className={`overflow-hidden shadow-sm transition-all duration-200 group-hover:shadow-xl ${isDark ? 'border-stone-700/70 bg-stone-950/80 group-hover:border-amber-700/40 group-hover:shadow-black/20' : 'border-stone-200/70 bg-white/95 group-hover:border-amber-200 group-hover:shadow-stone-900/5'}`}>
        <div className={`h-1 bg-gradient-to-r ${isDark ? 'from-amber-400 via-orange-400 to-rose-500' : 'from-amber-400 via-orange-400 to-rose-300'}`} />
        <CardContent className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                  {t.ticket} #{ticket.id}
                </span>
                <Badge theme={theme} status={ticket.status} copy={translations} />
              </div>
              <h3 className={`line-clamp-2 text-sm font-semibold leading-6 ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
                {truncateText(ticket.title, 56)}
              </h3>
            </div>
          </div>

          <p className={`line-clamp-3 text-sm leading-6 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
            {truncateText(ticket.description, 110)}
          </p>

          <div className={`flex items-center justify-between border-t pt-3 text-xs ${isDark ? 'border-stone-800 text-stone-400' : 'border-stone-100 text-stone-500'}`}>
            <span className="truncate">{ticket.contact_info}</span>
            <span>{updatedAt}</span>
          </div>
          <div className={`text-[11px] uppercase tracking-[0.2em] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
            {t.dragToMove}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
