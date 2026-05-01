'use client';

import { useState, useCallback, useRef } from 'react';

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
        <div key={t.id} className="toast cursor-pointer bg-white border border-gray-200 rounded-xl px-5 py-3.5 flex items-center gap-2.5 shadow-xl animate-slide-up" onClick={() => remove(t.id)}>
          <span className="text-lg">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span className="text-[13px] text-gray-800 font-medium">{t.message}</span>
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
      addToast(`Found ${result.length} businesses without a website`, 'success');
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
    return <span className="text-[#00d4aa]">{sortAsc ? '↑' : '↓'}</span>;
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

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(108,99,255,0.06)_0%,transparent_70%)]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,212,170,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 min-h-screen px-6 w-full">
        {/* Header */}
        <header className="w-full mx-auto pt-10 pb-8 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#00d4aa] flex items-center justify-center text-xl shadow-md">🎯</div>
              <h1 className="text-[26px] font-extrabold tracking-tight">
                <span className="bg-gradient-to-br from-[#6c63ff] to-[#00a383] bg-clip-text text-transparent">Lead Extractor</span>
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-[52px]">
              Extract businesses with <strong className="text-[#00a383]">no website</strong> from Google Places data
            </p>
          </div>
          {extracted.length > 0 && (
            <div className="flex gap-2.5 flex-wrap">
              <button className="btn-secondary" onClick={exportJSON}>
                ⬇️ Export JSON
              </button>
              <button className="btn-success" onClick={exportCSV}>
                📋 Export CSV
              </button>
            </div>
          )}
        </header>

        <main className="w-full mx-auto py-9 pb-20">

          {/* Upload Zone */}
          <section
            className={`upload-zone${dragOver ? ' drag-over' : ''} p-12 text-center mb-9`}
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
                <div className="spinner w-9 h-9 border-[3px] border-t-[#6c63ff] border-gray-200" />
                <p className="text-gray-500 text-[15px]">Processing your file…</p>
              </div>
            ) : (
              <>
                <div className="text-[52px] mb-4">
                  {dragOver ? '📂' : '📁'}
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  {dragOver ? 'Drop to upload' : 'Upload your JSON file'}
                </h2>
                <p className="text-gray-500 text-sm mb-5">
                  Drag & drop or click to browse — Google Places JSON format
                </p>
                <button
                  className="btn-primary pointer-events-none text-sm px-7 py-2.5"
                >
                  Choose File
                </button>
                {fileName && (
                  <p className="mt-4 text-xs text-[#00a383] font-semibold tracking-wider">
                    ✓ Last file: {fileName}
                  </p>
                )}
              </>
            )}
          </section>

          {/* Stats */}
          {stats && (
            <section className="mb-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Records', value: stats.total, icon: '📊', color: 'text-gray-900' },
                  { label: 'Have Website', value: stats.withWebsite, icon: '🌐', color: 'text-gray-500' },
                  { label: 'No Website', value: stats.withoutWebsite, icon: '🚫', color: 'text-[#00a383]' },
                  { label: 'Showing (filtered)', value: filtered.length, icon: '🎯', color: 'text-[#6c63ff]' },
                ].map(stat => (
                  <div key={stat.label} className="stat-card">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[22px]">{stat.icon}</span>
                      <span className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase">
                        {stat.label}
                      </span>
                    </div>
                    <div className={`text-[32px] font-extrabold tracking-tight ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </div>
                    {stat.label !== 'Total Records' && (
                      <div className="mt-2.5">
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.round((stat.value / stats.total) * 100)}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1 text-right">
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
            <section className="flex gap-3 flex-wrap mb-6 items-center">
              <div className="flex-1 min-w-[280px]">
                <input
                  className="search-input"
                  placeholder="🔍  Search by name, phone, city…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <div className="flex-none w-[220px]">
                <select
                  className="search-input appearance-none cursor-pointer"
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
                <button className="btn-secondary whitespace-nowrap text-[13px]"
                  onClick={() => { setSearch(''); setCategoryFilter(''); setPage(1); }}>
                  ✕ Clear filters
                </button>
              )}
            </section>
          )}

          {/* Results Table */}
          {extracted.length > 0 && (
            <section className="card overflow-hidden animate-fade-in w-full">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-3">
                  <h3 className="text-[15px] font-bold text-gray-900">
                    Businesses Without Website
                  </h3>
                  <span className="badge badge-no-website">
                    {filtered.length} leads
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Page {page} of {totalPages || 1}
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th className="w-9 text-center">#</th>
                      {(
                        [
                          { key: 'title', label: 'Business Name' },
                          { key: 'phone', label: 'Phone' },
                          { key: 'categories', label: 'Categories' },
                          { key: 'street', label: 'Street' },
                          { key: 'city', label: 'City' },
                        ] as { key: keyof ExtractedBusiness; label: string }[]
                      ).map(col => (
                        <th
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          className="cursor-pointer select-none"
                        >
                          {col.label} <SortIcon field={col.key} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center p-10 text-gray-500">
                          No results match your search
                        </td>
                      </tr>
                    ) : (
                      paginated.map((b, i) => (
                        <tr key={i} className="animate-fade-in">
                          <td className="text-center text-gray-400 text-[11px] font-semibold">
                            {(page - 1) * PER_PAGE + i + 1}
                          </td>
                          <td>
                            <div className="font-semibold text-gray-900 text-[13px]">
                              {b.title}
                            </div>
                          </td>
                          <td>
                            {b.phone !== '—' ? (
                              <a
                                href={`tel:${b.phone}`}
                                className="text-[#00a383] no-underline font-medium hover:underline"
                              >
                                📞 {b.phone}
                              </a>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {b.categories.length > 0
                                ? b.categories.map(c => (
                                  <span key={c} className="badge badge-category">{c}</span>
                                ))
                                : <span className="text-gray-400">—</span>
                              }
                            </div>
                          </td>
                          <td className="max-w-[220px]">
                            {b.street !== '—' ? b.street : <span className="text-gray-400">—</span>}
                          </td>
                          <td>{b.city !== '—' ? b.city : <span className="text-gray-400">—</span>}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-center gap-2">
                  <button
                    className="btn-secondary px-3.5 py-1.5 text-[13px]"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >← Prev</button>

                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) pageNum = i + 1;
                    else if (page <= 4) pageNum = i + 1;
                    else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                    else pageNum = page - 3 + i;
                    
                    const isCurrent = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center text-[13px] font-inter transition-all duration-200 cursor-pointer ${
                          isCurrent 
                            ? 'border-[#6c63ff] bg-[#6c63ff]/10 text-[#6c63ff] font-bold' 
                            : 'border-gray-200 bg-white text-gray-500 font-normal hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="btn-secondary px-3.5 py-1.5 text-[13px]"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >Next →</button>
                </div>
              )}
            </section>
          )}

          {/* Empty state */}
          {!loading && extracted.length === 0 && !stats && (
            <div className="text-center pt-10 text-gray-500">
              <div className="text-[60px] mb-4 opacity-50">🗂️</div>
              <p className="text-[15px]">Upload a JSON file to get started</p>
              <p className="text-[13px] mt-1.5">Supports Google Places dataset format</p>
            </div>
          )}

          {/* Loaded but none without website */}
          {!loading && stats && extracted.length === 0 && (
            <div className="text-center pt-10">
              <div className="text-[60px] mb-4">🎉</div>
              <p className="text-base text-[#00a383] font-semibold">
                All {stats.total} businesses have a website!
              </p>
              <p className="text-[13px] text-gray-500 mt-1.5">
                No leads without a website were found in this dataset.
              </p>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
