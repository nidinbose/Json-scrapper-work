'use client';

import { useState, useCallback, useRef } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────

const MapIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const CopyIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TargetIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.05 2a9 9 0 0 1 8 7.94" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.53 21c-2.02-1.3-3.35-3.52-3.48-6.1" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.47 21c2.02-1.3 3.35-3.52 3.48-6.1" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.06 9.94A9 9 0 0 1 10 2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0" />
  </svg>
);

const DownloadIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);



// ─── Types ────────────────────────────────────────────────────────────────────

interface BusinessRecord {
  title?: string;
  totalScore?: number | null;
  reviewsCount?: number | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  countryCode?: string;
  website?: string | null;
  phone?: string | null;
  categories?: string[];
  categoryName?: string;
  url?: string;
}

interface ExtractedBusiness {
  title: string;
  phone: string;
  categories: string[];
  street: string;
  city: string;
  website: string; // always empty or "—"
}

interface Stats {
  total: number;
  withWebsite: number;
  withoutWebsite: number;
  filtered: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasWebsite(record: BusinessRecord): boolean {
  const w = record.website;
  return !!(w && w.trim() !== '');
}

function extractRecord(record: BusinessRecord): ExtractedBusiness {
  return {
    title: record.title?.trim() || '—',
    phone: record.phone?.trim() || '—',
    categories: record.categories?.filter(Boolean) ?? (record.categoryName ? [record.categoryName] : []),
    street: record.street?.trim() || '—',
    city: record.city?.trim() || '—',
    website: '—',
  };
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastMsg { id: number; message: string; type: 'success' | 'error' | 'info' }

function Toast({ toasts, remove }: { toasts: ToastMsg[]; remove: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2.5">
      {toasts.map(t => (
        <div key={t.id} className="toast cursor-pointer bg-white border border-black/10 rounded-xl px-5 py-3.5 flex items-center gap-3 shadow-2xl animate-slide-up" onClick={() => remove(t.id)}>
          <span className="text-xl">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span className="text-[14px] text-black font-semibold tracking-tight">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedBusiness[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState<keyof ExtractedBusiness>('title');
  const [sortAsc, setSortAsc] = useState(true);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [fileName, setFileName] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 25;

  const fileInputRef = useRef<HTMLInputElement>(null);
  let toastId = useRef(0);

  const addToast = (message: string, type: ToastMsg['type'] = 'info') => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const copyToClipboard = (text: string, label: string = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      addToast(`${label} copied!`, 'success');
    }).catch(() => {
      addToast(`Failed to copy ${label}`, 'error');
    });
  };

  const getMapsLink = (b: ExtractedBusiness) => {
    const query = encodeURIComponent(`${b.title} ${b.city} ${b.street !== '—' ? b.street : ''}`.trim());
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getWhatsAppLink = (phone: string) => {
    // Remove all non-numeric characters (except leading + if it exists)
    let cleanPhone = phone.replace(/[^\d+]/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.json')) {
      addToast('Please upload a valid .json file', 'error');
      return;
    }
    setLoading(true);
    setExtracted([]);
    setStats(null);
    setSearch('');
    setCategoryFilter('');
    setPage(1);
    setFileName(file.name);

    try {
      const text = await file.text();
      const data: BusinessRecord[] = JSON.parse(text);

      if (!Array.isArray(data)) {
        addToast('JSON must be an array of business objects', 'error');
        setLoading(false);
        return;
      }

      const total = data.length;
      const withWebsite = data.filter(hasWebsite).length;
      const withoutWebsite = total - withWebsite;

      // Only extract businesses with NO website
      const noWebsiteRecords = data.filter(r => !hasWebsite(r));
      const result = noWebsiteRecords.map(extractRecord);

      setExtracted(result);
      setStats({ total, withWebsite, withoutWebsite, filtered: result.length });
      addToast(`Found ${result.length} leads without a website`, 'success');
    } catch {
      addToast('Failed to parse JSON — make sure the file is valid', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  // Get unique categories for filter dropdown
  const allCategories = Array.from(
    new Set(extracted.flatMap(b => b.categories))
  ).sort();

  // Filter + sort
  const filtered = extracted
    .filter(b => {
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        b.title.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.street.toLowerCase().includes(q) ||
        b.categories.some(c => c.toLowerCase().includes(q));
      const matchesCategory = !categoryFilter || b.categories.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const av = String(a[sortField] ?? '');
      const bv = String(b[sortField] ?? '');
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (field: keyof ExtractedBusiness) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: keyof ExtractedBusiness }) => {
    if (sortField !== field) return <span className="opacity-30">↕</span>;
    return <span className="text-black font-extrabold">{sortAsc ? '↑' : '↓'}</span>;
  };

  // Export CSV
  const exportCSV = () => {
    if (!filtered.length) return;
    const header = ['Title', 'Phone', 'Categories', 'Street', 'City'];
    const rows = filtered.map(b => [
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.phone}"`,
      `"${b.categories.join('; ')}"`,
      `"${b.street.replace(/"/g, '""')}"`,
      `"${b.city.replace(/"/g, '""')}"`,
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'no_website_leads.csv';
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${filtered.length} leads to CSV`, 'success');
  };

  // Export JSON
  const exportJSON = () => {
    if (!filtered.length) return;
    const data = filtered.map(b => ({
      title: b.title,
      phone: b.phone,
      categories: b.categories,
      street: b.street,
      city: b.city,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'no_website_leads.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${filtered.length} leads to JSON`, 'success');
  };

  return (
    <>
      <Toast toasts={toasts} remove={removeToast} />

      {/* Background blobs removed */}
      {/* Full screen wrapper */}
      <div className="relative z-10 min-h-full py-20 px-4 md:px-8 lg:px-12 w-full bg-transparent text-black">
        {/* Header */}
        <header className="w-full pt-8 md:pt-10 pb-6 md:pb-8 border-b border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-center mt-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center justify-center gap-3 mb-1.5">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-sm">
                <TargetIcon />
              </div>
              <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight text-black">
                Lead Extractor
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-[52px]">
              Extract businesses with <strong className="text-black">no website</strong> from Google Places data
            </p>
          </div>
          {extracted.length > 0 && (
            <div className="hidden md:flex gap-2.5 flex-wrap">
              <button className="btn-secondary flex items-center gap-2" onClick={exportJSON}>
                <DownloadIcon className="w-4 h-4" /> JSON
              </button>
              <button className="btn-success flex items-center gap-2" onClick={exportCSV}>
                <DownloadIcon className="w-4 h-4" /> CSV
              </button>
            </div>
          )}
        </header>

        <main className="w-full py-8 md:py-9 pb-32 md:pb-20">

          {/* Upload Zone */}
          <section
            className={`upload-zone${dragOver ? ' drag-over' : ''} w-full p-10 md:p-14 text-center mb-10 py-6 bg-white shadow-sm border-black/10`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileInput}
            />
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="spinner w-9 h-9 border-[3px] border-t-black border-black/10" />
                <p className="text-black font-medium text-[15px]">Processing your file…</p>
              </div>
            ) : (
              <>
                <div className="text-[52px] mb-4">
                  {dragOver ? '📂' : '📁'}
                </div>
                <h2 className="text-2xl font-bold mb-2 text-black">
                  {dragOver ? 'Drop to upload' : 'Upload your JSON file'}
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Drag & drop or click to browse — Google Places JSON format
                </p>
                <button
                  className="btn-primary pointer-events-none text-sm px-8 py-3 bg-black text-white hover:bg-gray-800 shadow-xl shadow-black/10"
                >
                  Choose File
                </button>
                {fileName && (
                  <p className="mt-5 text-xs text-black font-semibold tracking-wider">
                    ✓ Last file: {fileName}
                  </p>
                )}
              </>
            )}
          </section>

          {/* Stats */}
          {stats && (
            <section className="mb-10 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 w-full">
                {[
                  { label: 'Total Records', value: stats.total, icon: '📊', color: 'text-black' },
                  { label: 'Have Website', value: stats.withWebsite, icon: '🌐', color: 'text-gray-500' },
                  { label: 'No Website', value: stats.withoutWebsite, icon: '🚫', color: 'text-black' },
                  { label: 'Filtered', value: filtered.length, icon: '🎯', color: 'text-black' },
                ].map(stat => (
                  <div key={stat.label} className="stat-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[22px] md:text-2xl">{stat.icon}</span>
                      <span className="text-[10px] md:text-[11px] text-gray-500 font-bold tracking-wider uppercase">
                        {stat.label}
                      </span>
                    </div>
                    <div className={`text-2xl md:text-[32px] font-extrabold tracking-tight ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </div>
                    {stat.label !== 'Total Records' && (
                      <div className="mt-3">
                        <div className="progress-bar bg-gray-100">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.round((stat.value / stats.total) * 100)}%` }}
                          />
                        </div>
                        <div className="text-[10px] md:text-[11px] text-gray-500 mt-1.5 text-right font-medium">
                          {Math.round((stat.value / stats.total) * 100)}%
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Filters */}
          {extracted.length > 0 && (
            <section className="flex gap-3 flex-wrap mb-8 items-center bg-gray-50 p-4 rounded-xl border border-black/5 shadow-sm w-full">
              <div className="flex-1 min-w-[240px] relative">
                <input
                  className="search-input !border-black/10 !bg-white shadow-sm text-black placeholder-gray-400 focus:!border-black focus:!ring-1 focus:!ring-black"
                  placeholder="Search by name, phone, city…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <div className="flex-1 sm:flex-none w-full sm:w-[220px]">
                <select
                  className="search-input appearance-none cursor-pointer !border-black/10 !bg-white shadow-sm text-black focus:!border-black focus:!ring-1 focus:!ring-black"
                  value={categoryFilter}
                  onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
                >
                  <option value="">All Categories</option>
                  {allCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {(search || categoryFilter) && (
                <button className="btn-secondary whitespace-nowrap text-[13px] w-full sm:w-auto border-black/10 text-black hover:bg-black/5"
                  onClick={() => { setSearch(''); setCategoryFilter(''); setPage(1); }}>
                  ✕ Clear filters
                </button>
              )}
            </section>
          )}

          {/* Results Area */}
          {extracted.length > 0 && (
            <section className="animate-fade-in w-full">
              
              <div className="px-1 py-4 flex items-center justify-between flex-wrap gap-2.5 mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-black">
                    Businesses Without Website
                  </h3>
                  <span className="badge badge-no-website">
                    {filtered.length} leads
                  </span>
                </div>
                <div className="text-xs font-bold text-black bg-gray-100 px-3 py-1.5 rounded-md">
                  Page {page} of {totalPages || 1}
                </div>
              </div>

              {paginated.length === 0 ? (
                <div className="card text-center p-12 text-black font-medium border-black/10 shadow-sm">
                  No results match your search
                </div>
              ) : (
                <>
                  {/* MOBILE CARDS VIEW */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:hidden">
                    {paginated.map((b, i) => (
                      <div key={i} className="card p-5 flex flex-col gap-3 border-black/10 shadow-sm bg-white">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-black text-lg leading-tight">{b.title}</h4>
                          <span className="text-xs text-black font-bold bg-gray-100 px-2 py-1 rounded-md shrink-0">
                            #{((page - 1) * PER_PAGE) + i + 1}
                          </span>
                        </div>
                        
                        <div className="text-[13px] text-gray-600 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 font-medium">
                            <MapIcon className="w-4 h-4 text-black shrink-0" />
                            <span className="truncate">{b.street !== '—' ? b.street : ''} {b.city !== '—' ? b.city : 'No location'}</span>
                          </div>
                        </div>

                        {b.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {b.categories.slice(0, 3).map(c => (
                              <span key={c} className="badge badge-category">{c}</span>
                            ))}
                            {b.categories.length > 3 && <span className="text-xs text-gray-500 font-bold">+{b.categories.length - 3}</span>}
                          </div>
                        )}

                        <div className="h-px bg-black/5 my-2" />

                        {/* Mobile Fast Actions (2x2 Grid) */}
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={b.phone !== '—' ? `tel:${b.phone}` : '#'}
                            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                              b.phone !== '—' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 pointer-events-none'
                            }`}
                          >
                            <PhoneIcon className="w-4 h-4" /> Call
                          </a>
                          
                          <a
                            href={b.phone !== '—' ? getWhatsAppLink(b.phone) : '#'}
                            target={b.phone !== '—' ? '_blank' : undefined}
                            rel={b.phone !== '—' ? 'noopener noreferrer' : undefined}
                            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                              b.phone !== '—' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 pointer-events-none'
                            }`}
                          >
                            <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                          </a>

                          <a
                            href={getMapsLink(b)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold bg-white border border-black/10 text-black hover:bg-gray-50 transition-colors"
                          >
                            <MapIcon className="w-4 h-4" /> Map
                          </a>

                          <button
                            onClick={() => copyToClipboard(b.phone !== '—' ? b.phone : '', 'Phone')}
                            disabled={b.phone === '—'}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold bg-white border border-black/10 text-black hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:pointer-events-none transition-colors"
                          >
                            <CopyIcon className="w-4 h-4" /> Copy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP TABLE VIEW */}
                  <div className="card overflow-hidden hidden md:block border-black/10 shadow-sm bg-white w-full">
                    <div className="overflow-x-auto w-full">
                      <table className="data-table w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="w-12 text-center !py-4 text-black font-bold border-b border-black/10 bg-transparent">#</th>
                            <th onClick={() => handleSort('title')} className="cursor-pointer select-none !py-4 hover:bg-black/5 transition-colors text-black font-bold border-b border-black/10 bg-transparent">
                              Business Name <SortIcon field="title" />
                            </th>
                            <th onClick={() => handleSort('phone')} className="cursor-pointer select-none !py-4 hover:bg-black/5 transition-colors text-black font-bold border-b border-black/10 bg-transparent">
                              Phone <SortIcon field="phone" />
                            </th>
                            <th onClick={() => handleSort('categories')} className="cursor-pointer select-none !py-4 hover:bg-black/5 transition-colors text-black font-bold border-b border-black/10 bg-transparent">
                              Categories <SortIcon field="categories" />
                            </th>
                            <th onClick={() => handleSort('city')} className="cursor-pointer select-none !py-4 hover:bg-black/5 transition-colors text-black font-bold border-b border-black/10 bg-transparent">
                              Location <SortIcon field="city" />
                            </th>
                            <th className="text-right !py-4 text-black font-bold border-b border-black/10 bg-transparent">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginated.map((b, i) => (
                            <tr key={i} className="animate-fade-in group hover:bg-gray-50 transition-colors">
                              <td className="text-center text-gray-500 text-[12px] font-bold !py-4 border-r border-black/5 border-b border-black/5">
                                {(page - 1) * PER_PAGE + i + 1}
                              </td>
                              <td className="!py-4 border-b border-black/5">
                                <div className="font-bold text-black text-[14px]">
                                  {b.title}
                                </div>
                              </td>
                              <td className="!py-4 border-b border-black/5">
                                {b.phone !== '—' ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-black text-[13px]">{b.phone}</span>
                                    <button onClick={() => copyToClipboard(b.phone, 'Phone')} className="text-gray-400 hover:text-black transition-colors p-1" title="Copy Phone">
                                      <CopyIcon className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-gray-300 font-bold">—</span>
                                )}
                              </td>
                              <td className="!py-4 border-b border-black/5">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {b.categories.length > 0
                                    ? b.categories.slice(0, 2).map(c => (
                                      <span key={c} className="badge badge-category">{c}</span>
                                    ))
                                    : <span className="text-gray-300 font-bold">—</span>
                                  }
                                  {b.categories.length > 2 && <span className="text-xs text-black align-middle font-bold">+{b.categories.length - 2}</span>}
                                </div>
                              </td>
                              <td className="max-w-[200px] !py-4 border-b border-black/5">
                                <div className="truncate text-[13px] text-gray-600 font-medium">
                                  {b.street !== '—' ? `${b.street}, ` : ''}{b.city !== '—' ? b.city : '—'}
                                </div>
                              </td>
                              <td className="!py-4 border-b border-black/5">
                                <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                  {b.phone !== '—' && (
                                    <>
                                      <a href={`tel:${b.phone}`} className="p-2 text-white bg-black hover:bg-gray-800 rounded-md transition-colors shadow-sm" title="Call">
                                        <PhoneIcon className="w-4 h-4" />
                                      </a>
                                      <a href={getWhatsAppLink(b.phone)} target="_blank" rel="noopener noreferrer" className="p-2 text-white bg-black hover:bg-gray-800 rounded-md transition-colors shadow-sm" title="WhatsApp">
                                        <WhatsAppIcon className="w-4 h-4" />
                                      </a>
                                    </>
                                  )}
                                  <a href={getMapsLink(b)} target="_blank" rel="noopener noreferrer" className="p-2 text-black bg-white border border-black/10 hover:bg-gray-50 rounded-md transition-colors shadow-sm" title="View on Map">
                                    <MapIcon className="w-4 h-4" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-8 flex items-center justify-center gap-2 w-full">
                  <button
                    className="btn-secondary px-4 py-2 text-[13px] shadow-sm font-bold border-black/10 text-black hover:bg-black/5"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >← Prev</button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;
                    
                    const isCurrent = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center text-[13px] font-inter transition-all duration-200 cursor-pointer shadow-sm ${
                          isCurrent 
                            ? 'border-black bg-black text-white font-extrabold' 
                            : 'border-black/10 bg-white text-black font-bold hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="btn-secondary px-4 py-2 text-[13px] shadow-sm font-bold border-black/10 text-black hover:bg-black/5"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >Next →</button>
                </div>
              )}
            </section>
          )}

          {/* Empty state */}
          {!loading && extracted.length === 0 && !stats && (
            <div className="text-center pt-20 pb-16 text-black w-full">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center text-black">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-xl font-extrabold text-black mb-2">No Data Uploaded</p>
              <p className="text-[15px] font-medium text-gray-500 max-w-md mx-auto">Upload a JSON file of Google Places data to instantly extract actionable leads.</p>
            </div>
          )}

          {/* Loaded but none without website */}
          {!loading && stats && extracted.length === 0 && (
            <div className="text-center pt-20 pb-16 w-full">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-black/5 border border-black/10 shadow-sm flex items-center justify-center text-black">
                  <TargetIcon className="w-10 h-10" />
                </div>
              </div>
              <p className="text-2xl text-black font-extrabold mb-3">
                All {stats.total} businesses have a website!
              </p>
              <p className="text-[15px] text-gray-500 font-medium max-w-md mx-auto">
                No leads without a website were found in this dataset. You can try uploading a different file.
              </p>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      {extracted.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-black/10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] flex items-center justify-between gap-3 z-50 md:hidden">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Found Leads</span>
            <span className="text-base font-extrabold text-black">{filtered.length}</span>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary px-4 py-2.5 flex items-center gap-2 font-bold border-black/10 text-black bg-white shadow-sm" onClick={exportJSON}>
              <DownloadIcon className="w-4 h-4" /> JSON
            </button>
            <button className="btn-success px-4 py-2.5 flex items-center gap-2 shadow-md shadow-black/20 font-bold bg-black text-white" onClick={exportCSV}>
              <DownloadIcon className="w-4 h-4" /> CSV
            </button>
          </div>
        </div>
      )}
    </>
  );
}
