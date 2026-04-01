import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TicketForm } from '../components/TicketForm';
import { TicketKanban } from '../components/TicketKanban';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useTickets } from '../hooks/useTickets';
import { getTranslations } from '../i18n';

export const Dashboard = ({ theme = 'light', lang = 'en', copy, onToggleTheme, onToggleLang }) => {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { tickets, loading, error, createTicket, updateTicket } = useTickets(statusFilter, sortBy);
  const sortMenuRef = useRef(null);
  const isDark = theme === 'dark';
  const t = copy || getTranslations('en');

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const stats = useMemo(() => {
    const counts = tickets.reduce((acc, ticket) => {
      acc.total += 1;
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, { total: 0 });

    return [
      { label: t.stats.total, value: counts.total || 0, tone: 'from-stone-900 to-stone-700' },
      { label: t.stats.pending, value: counts.pending || 0, tone: 'from-amber-500 to-yellow-500' },
      { label: t.stats.accepted, value: counts.accepted || 0, tone: 'from-orange-500 to-amber-500' },
      { label: t.stats.resolved, value: counts.resolved || 0, tone: 'from-emerald-500 to-lime-500' },
    ];
  }, [t, tickets]);

  const filteredTickets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesStatus = !statusFilter || ticket.status === statusFilter;
      const searchable = [ticket.title, ticket.description, ticket.contact_info, ticket.status];
      const matchesSearch = !normalizedQuery || searchable.some((value) => String(value || '').toLowerCase().includes(normalizedQuery));

      return matchesStatus && matchesSearch;
    });
  }, [tickets, searchQuery, statusFilter]);

  const handleCreateTicket = async (data) => {
    try {
      await createTicket(data);
      setShowForm(false);
      alert(t.notifications.ticketCreated);
    } catch (err) {
      alert(`${t.notifications.errorPrefix} ${err.response?.data?.error || err.message}`);
    }
  };

  const handleUpdateTicket = async (id, data) => {
    try {
      await updateTicket(id, data);
    } catch (err) {
      alert(`${t.notifications.errorPrefix} ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className={`ticketflow-shell min-h-screen ${isDark ? 'bg-[#0f0c09] text-stone-100' : 'text-stone-900'}`}>
      <div className="ticketflow-glow" />
      <div className="ticketflow-glow-alt" />

      <header className={`relative overflow-hidden border-b backdrop-blur-xl ${isDark ? 'border-stone-800/80 bg-[#18130f]/80' : 'border-white/60 bg-white/60'}`}>
        <div className="absolute inset-0 ticketflow-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${isDark ? 'bg-stone-900/70 text-stone-300 ring-1 ring-stone-700' : 'bg-white/80 text-stone-500 ring-1 ring-stone-200'}`}>
                SUPPORT OPERATIONS CENTER
              </div>
              <div className="space-y-3">
                <h1 className={`text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl ${isDark ? 'text-stone-50' : 'text-stone-950'}`}>
                    {t.hero.title}
                </h1>
                <p className={`max-w-2xl text-base leading-7 sm:text-lg ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {t.hero.description}
                </p>
              </div>
              <div className={`flex flex-wrap gap-3 text-sm ${isDark ? 'text-stone-300' : 'text-stone-500'}`}>
                  {t.hero.chips.map((chip) => (
                    <span key={chip} className={`rounded-full px-3 py-1 ${isDark ? 'bg-stone-900/70 ring-1 ring-stone-700' : 'bg-white/80 ring-1 ring-stone-200'}`}>
                      {chip}
                    </span>
                  ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button theme={theme} onClick={() => setShowForm((value) => !value)} disabled={loading}>
                  {showForm ? t.actions.closeForm : t.actions.newTicket}
              </Button>
              <Button theme={theme} variant="ghost" className="border-0 shadow-none ring-0" onClick={onToggleTheme} disabled={loading}>
                  {isDark ? `☀️ ${t.themeToggle.light}` : `🌙 ${t.themeToggle.dark}`}
                </Button>
                <Button theme={theme} variant="ghost" className="border-0 shadow-none ring-0" onClick={onToggleLang} disabled={loading}>
                  {t.languageToggle}
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <Card theme={theme} key={stat.label} className="ticketflow-panel ticketflow-board-shadow border-white/60">
                <CardContent className="p-5">
                  <div className={`mb-4 h-2 w-16 rounded-full bg-gradient-to-r ${stat.tone}`} />
                  <p className={`text-sm font-medium ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{stat.label}</p>
                  <p className={`mt-2 text-3xl font-black tracking-tight ${isDark ? 'text-stone-50' : 'text-stone-950'}`}>{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {error && (
          <Card theme={theme} className="mb-6 border-rose-200 bg-rose-50/90 dark:border-rose-900/50 dark:bg-rose-950/40">
            <CardContent className={`flex items-start gap-3 ${isDark ? 'text-rose-200' : 'text-rose-700'}`}>
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
              <div>
                <p className="font-semibold">Something went wrong</p>
                <p className={`mt-1 text-sm ${isDark ? 'text-rose-300' : 'text-rose-600'}`}>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card theme={theme} className="ticketflow-panel ticketflow-board-shadow mb-8 border-white/70">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] xl:items-start">
              <div className="min-w-0 flex-1 space-y-2">
                <label className={`text-xs font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {t.controls.searchBy}
                </label>
                <Input
                  theme={theme}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.controls.searchPlaceholder}
                  className={isDark
                    ? '!h-11 !py-0 !border-stone-700/70 !bg-stone-900/58 !text-stone-100 !shadow-[0_1px_1px_rgba(0,0,0,0.18)]'
                    : '!h-11 !py-0 !border-stone-200/60 !bg-white/96 !text-stone-900 !shadow-[0_1px_1px_rgba(15,23,42,0.03)]'
                  }
                />
                <p aria-hidden="true" className="text-xs leading-5 invisible">
                  {t.controls.sortHelper}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-end gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className={`text-xs font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {t.controls.sortBy}
                    </label>

                    <div ref={sortMenuRef} className="relative">
                      <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={sortMenuOpen}
                        onClick={() => setSortMenuOpen((current) => !current)}
                        className={`flex h-11 w-full items-center justify-between rounded-2xl border px-4 text-left text-sm font-medium transition-all ${isDark ? 'border-stone-700/70 bg-gradient-to-b from-stone-900/58 via-stone-900/54 to-stone-950/58 text-stone-100 shadow-[0_1px_1px_rgba(0,0,0,0.18)] hover:border-stone-600' : 'border-stone-200/60 bg-gradient-to-b from-white/96 via-white/92 to-stone-50/82 text-stone-900 shadow-[0_1px_1px_rgba(15,23,42,0.03)] hover:border-stone-300'} focus:outline-none focus:ring-1 focus:ring-amber-400/15`}
                      >
                        <span>{sortBy === 'updated' ? t.controls.latestUpdate : t.controls.createdDate}</span>
                        <span className={`ml-4 text-xs transition-transform duration-200 ${sortMenuOpen ? 'rotate-180' : ''} ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                          ▾
                        </span>
                      </button>

                      {sortMenuOpen && (
                        <div className={`absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border backdrop-blur-xl ${isDark ? 'border-stone-700/80 bg-gradient-to-b from-stone-900/96 to-stone-950/96 shadow-[0_20px_60px_rgba(0,0,0,0.32)]' : 'border-stone-200/80 bg-gradient-to-b from-white/98 to-stone-50/96 shadow-[0_20px_50px_rgba(92,64,51,0.08)]'}`} role="menu">
                          {[
                            { value: 'updated', label: t.controls.latestUpdate },
                            { value: 'created', label: t.controls.createdDate },
                          ].map((option) => {
                            const active = sortBy === option.value;

                            return (
                              <button
                                key={option.value}
                                type="button"
                                role="menuitemradio"
                                aria-checked={active}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setSortMenuOpen(false);
                                }}
                                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${active ? (isDark ? 'bg-amber-400/12 text-amber-200' : 'bg-amber-50 text-amber-800') : (isDark ? 'text-stone-200 hover:bg-stone-800/80' : 'text-stone-700 hover:bg-stone-100')}`}
                              >
                                <span>{option.label}</span>
                                {active && <span className="text-xs font-semibold">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    theme={theme}
                    variant="secondary"
                    className="h-11 shrink-0 px-5"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('');
                      setSortBy('updated');
                    }}
                    disabled={loading}
                  >
                    {t.actions.reset}
                  </Button>
                </div>

                <p className={`text-xs leading-5 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                  {t.controls.sortHelper}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 xl:col-span-2">
              {['', 'pending', 'accepted', 'resolved', 'rejected'].map((status) => {
                const active = statusFilter === status;
                const label = status === '' ? t.filters.all : t.filters[status];

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      active
                        ? isDark
                          ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/20'
                          : 'bg-stone-900 text-white shadow-lg shadow-stone-900/10'
                        : isDark
                          ? 'bg-stone-900/80 text-stone-300 ring-1 ring-stone-700 hover:bg-stone-800'
                          : 'bg-white/80 text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            </div>
          </CardContent>
        </Card>

        {showForm && (
          <div className="ticketflow-animate-in mb-8">
            <TicketForm
              theme={theme}
              copy={t}
              onSubmit={handleCreateTicket}
              loading={loading}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="ticketflow-animate-in">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{t.board.view}</p>
              <h2 className={`mt-1 text-2xl font-black tracking-tight sm:text-3xl ${isDark ? 'text-stone-50' : 'text-stone-950'}`}>{t.board.kanban}</h2>
            </div>
            <div className={`text-right text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              <p>{filteredTickets.length} {t.board.visibleTickets}</p>
              <p>{tickets.length} {t.board.loadedFromServer}</p>
            </div>
          </div>

          {loading && !showForm ? (
            <Card theme={theme} className="ticketflow-panel ticketflow-board-shadow border-white/70">
              <CardContent className={`py-16 text-center ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {t.board.loading}
              </CardContent>
            </Card>
          ) : (
            <TicketKanban
              theme={theme}
              lang={lang}
              copy={t}
              tickets={filteredTickets}
              onUpdateTicket={handleUpdateTicket}
              loading={loading}
              activeStatus={statusFilter}
            />
          )}
        </div>
      </main>

      <footer className={`border-t py-6 backdrop-blur-xl ${isDark ? 'border-stone-800/80 bg-[#120f0c]/80' : 'border-white/60 bg-white/50'}`}>
        <div className={`mx-auto max-w-7xl px-4 text-center text-sm sm:px-6 lg:px-8 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          {t.hero.title} © 2026 · {t.pageTitle}
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
