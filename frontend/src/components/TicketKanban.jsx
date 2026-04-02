import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { TicketCard } from './TicketCard';
import { getTranslations } from '../i18n';

export const TicketKanban = ({ tickets, onUpdateTicket, onTicketClick, loading = false, theme = 'light', activeStatus = '', copy, lang = 'en' }) => {
  const isDark = theme === 'dark';
  const translations = copy || getTranslations('en');
  const t = translations.kanban;
  const [draggingTicketId, setDraggingTicketId] = useState(null);
  const statuses = [
    { key: 'pending', label: t.statuses.pending, tone: 'from-amber-500 to-yellow-500', border: isDark ? 'border-amber-900/50' : 'border-amber-200', glow: isDark ? 'bg-amber-950/20' : 'bg-amber-50' },
    { key: 'accepted', label: t.statuses.accepted, tone: 'from-orange-500 to-amber-500', border: isDark ? 'border-orange-900/50' : 'border-orange-200', glow: isDark ? 'bg-orange-950/20' : 'bg-orange-50' },
    { key: 'resolved', label: t.statuses.resolved, tone: 'from-emerald-500 to-lime-500', border: isDark ? 'border-emerald-900/50' : 'border-emerald-200', glow: isDark ? 'bg-emerald-950/20' : 'bg-emerald-50' },
    { key: 'rejected', label: t.statuses.rejected, tone: 'from-rose-500 to-red-500', border: isDark ? 'border-rose-900/50' : 'border-rose-200', glow: isDark ? 'bg-rose-950/20' : 'bg-rose-50' },
  ];

  const buildOrderedTickets = (currentTickets, previousOrder = {}) => statuses.reduce((acc, status) => {
    const statusTickets = currentTickets.filter((ticket) => ticket.status === status.key);
    const previousIds = previousOrder[status.key] || [];
    const orderedTickets = [
      ...previousIds
        .map((ticketId) => statusTickets.find((ticket) => ticket.id === ticketId))
        .filter(Boolean),
      ...statusTickets.filter((ticket) => !previousIds.includes(ticket.id)),
    ];

    acc[status.key] = orderedTickets;
    return acc;
  }, {});

  const [orderedTickets, setOrderedTickets] = useState(() => buildOrderedTickets(tickets));

  useEffect(() => {
    setOrderedTickets((currentOrder) => buildOrderedTickets(tickets, Object.fromEntries(
      Object.entries(currentOrder).map(([statusKey, statusTickets]) => [statusKey, statusTickets.map((ticket) => ticket.id)])
    )));
  }, [tickets]);

  const groupedTickets = useMemo(() => statuses.reduce((acc, status) => {
    acc[status.key] = orderedTickets[status.key] || [];
    return acc;
  }, {}), [orderedTickets]);

  const visibleStatuses = activeStatus
    ? statuses.filter((status) => status.key === activeStatus)
    : statuses;

  const gridClassName = activeStatus ? 'grid gap-4 md:grid-cols-1' : 'grid gap-4 md:grid-cols-2 xl:grid-cols-4';

  const handleDragStart = (e, ticket) => {
    setDraggingTicketId(ticket.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('ticketId', ticket.id);
  };

  const reorderWithinStatus = (ticketId, targetTicketId, statusKey) => {
    setOrderedTickets((currentOrder) => {
      const nextOrder = { ...currentOrder };
      const currentTickets = [...(currentOrder[statusKey] || [])];
      const sourceIndex = currentTickets.findIndex((ticket) => ticket.id === ticketId);
      const targetIndex = currentTickets.findIndex((ticket) => ticket.id === targetTicketId);

      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return currentOrder;
      }

      const [movedTicket] = currentTickets.splice(sourceIndex, 1);
      currentTickets.splice(targetIndex, 0, movedTicket);
      nextOrder[statusKey] = currentTickets;
      return nextOrder;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const ticketId = parseInt(e.dataTransfer.getData('ticketId'));
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket && ticket.status !== status) {
      onUpdateTicket(ticketId, { status });
    }
    setDraggingTicketId(null);
  };

  const handleCardDrop = (e, targetStatus, targetTicketId) => {
    e.preventDefault();
    e.stopPropagation();
    const ticketId = parseInt(e.dataTransfer.getData('ticketId'));
    const draggedTicket = tickets.find((ticket) => ticket.id === ticketId);

    if (!draggedTicket || draggedTicket.id === targetTicketId) {
      return;
    }

    if (draggedTicket.status === targetStatus) {
      reorderWithinStatus(draggedTicket.id, targetTicketId, targetStatus);
      setDraggingTicketId(null);
      return;
    }

    onUpdateTicket(ticketId, { status: targetStatus });
    setDraggingTicketId(null);
  };

  const handleTicketClick = (ticket) => {
    if (draggingTicketId !== null) {
      return;
    }

    onTicketClick?.(ticket);
  };

  return (
    <div className="space-y-5">
      <div className={gridClassName}>
        {visibleStatuses.map((status) => (
          <Card theme={theme} key={status.key} className={`border ${status.border} ${status.glow} overflow-hidden ${isDark ? 'text-stone-100' : ''}`}>
            <CardHeader className="border-0 bg-transparent px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Workflow</p>
                  <CardTitle className={`mt-1 text-base ${isDark ? 'text-stone-50' : ''}`}>{status.label}</CardTitle>
                </div>
                <span className={`rounded-full bg-gradient-to-r ${status.tone} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
                  {groupedTickets[status.key].length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status.key)}
                className={`min-h-[22rem] rounded-2xl border border-dashed p-3 ${isDark ? 'border-stone-700/80 bg-stone-950/40' : 'border-stone-200/80 bg-white/70'}`}
              >
                {groupedTickets[status.key].length === 0 ? (
                  <div className={`flex min-h-[12rem] items-center justify-center rounded-2xl border border-dashed px-4 text-center text-sm ${isDark ? 'border-stone-700 bg-stone-900/60 text-stone-500' : 'border-stone-200 bg-white/70 text-stone-400'}`}>
                    {t.dropHere}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {groupedTickets[status.key].map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        theme={theme}
                        lang={lang}
                        ticket={ticket}
                        onClick={() => handleTicketClick(ticket)}
                        isDragging={draggingTicketId !== null}
                        copy={translations}
                        draggableProps={{
                          draggable: true,
                          onDragStart: (e) => handleDragStart(e, ticket),
                          onDragOver: handleDragOver,
                          onDrop: (e) => handleCardDrop(e, status.key, ticket.id),
                          onDragEnd: () => setDraggingTicketId(null),
                        }}
                        className="mb-0"
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className={`rounded-3xl px-4 py-3 text-sm ${isDark ? 'border border-amber-900/40 bg-amber-950/25 text-amber-200' : 'border border-amber-100 bg-amber-50/70 text-amber-800'}`}>
          {t.refreshing}
        </div>
      )}
    </div>
  );
};
