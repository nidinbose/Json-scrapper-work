'use client';

import { useCallback, useRef, useState } from 'react';

const EMPTY_VALUE = '-';
const PER_PAGE = 25;

const MapIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const PhoneIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z" />
  </svg>
);

const CopyIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
  </svg>
);

const WhatsAppIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const TargetIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.05 2A9 9 0 0 1 22.05 9.94" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.53 21C3.51 19.7 2.18 17.48 2.05 14.9" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.47 21c2.02-1.3 3.35-3.52 3.48-6.1" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.06 9.94A9 9 0 0 1 10 2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0" />
  </svg>
);

const DownloadIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" />
  </svg>
);

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
  website: string;
}

interface Stats {
  total: number;
  withWebsite: number;
  withoutWebsite: number;
  filtered: number;
}

interface ToastMsg {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

function hasWebsite(record: BusinessRecord): boolean {
  const website = record.website;
  return !!(website && website.trim() !== '');
}

function extractRecord(record: BusinessRecord): ExtractedBusiness {
  return {
    title: record.title?.trim() || EMPTY_VALUE,
    phone: record.phone?.trim() || EMPTY_VALUE,
    categories: record.categories?.filter(Boolean) ?? (record.categoryName ? [record.categoryName] : []),
    street: record.street?.trim() || EMPTY_VALUE,
    city: record.city?.trim() || EMPTY_VALUE,
    website: EMPTY_VALUE,
  };
}

function Toast({ toasts, remove }: { toasts: ToastMsg[]; remove: (id: number) => void }) {
  return (
    <div className="fixed inset-x-4 top-4 z-[9999] flex flex-col gap-2 sm:inset-x-auto sm:right-6 sm:w-[22rem]">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          className="toast animate-slide-up text-left"
          onClick={() => remove(toast.id)}
        >
          <span className="toast-indicator" aria-hidden="true">
            {toast.type === 'success' ? 'OK' : toast.type === 'error' ? 'ER' : 'IN'}
          </span>
          <span className="text-sm font-semibold tracking-tight">{toast.message}</span>
        </button>
      ))}
    </div>
  );
}

function StatCard({ label, value, percentage }: { label: string; value: number; percentage?: number }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-neutral-500">{label}</p>
        <span className="rounded-full border border-black/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Live
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-black sm:text-4xl">{value.toLocaleString()}</p>
      {typeof percentage === 'number' && (
        <div className="mt-5">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
          </div>
          <p className="mt-2 text-right text-xs font-medium text-neutral-500">{percentage}% of total records</p>
        </div>
      )}
    </div>
  );
}

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastId = useRef(0);

  const addToast = (message: string, type: ToastMsg['type'] = 'info') => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  const copyToClipboard = (text: string, label = 'Text') => {
    navigator.clipboard
      .writeText(text)
      .then(() => addToast(`${label} copied`, 'success'))
      .catch(() => addToast(`Failed to copy ${label}`, 'error'));
  };

  const getMapsLink = (business: ExtractedBusiness) => {
    const query = encodeURIComponent(
      `${business.title} ${business.city} ${business.street !== EMPTY_VALUE ? business.street : ''}`.trim()
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getWhatsAppLink = (phone: string) => `https://wa.me/${phone.replace(/[^\d+]/g, '')}`;

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
      const noWebsiteRecords = data.filter((record) => !hasWebsite(record));
      const result = noWebsiteRecords.map(extractRecord);

      setExtracted(result);
      setStats({ total, withWebsite, withoutWebsite, filtered: result.length });
      addToast(`Found ${result.length} leads without a website`, 'success');
    } catch {
      addToast('Failed to parse JSON. Make sure the file is valid.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragOver(false);
      const file = event.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    event.target.value = '';
  };

  const allCategories = Array.from(new Set(extracted.flatMap((business) => business.categories))).sort();

  const filtered = extracted
    .filter((business) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        business.title.toLowerCase().includes(query) ||
        business.phone.toLowerCase().includes(query) ||
        business.city.toLowerCase().includes(query) ||
        business.street.toLowerCase().includes(query) ||
        business.categories.some((category) => category.toLowerCase().includes(query));

      const matchesCategory = !categoryFilter || business.categories.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = String(a[sortField] ?? '');
      const bValue = String(b[sortField] ?? '');
      return sortAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (field: keyof ExtractedBusiness) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setPage(1);
  };

  const getSortIcon = (field: keyof ExtractedBusiness) => {
    if (sortField !== field) {
      return '+';
    }
    return sortAsc ? '↑' : '↓';
  };

  const exportCSV = () => {
    if (!filtered.length) {
      return;
    }

    const header = ['Title', 'Phone', 'Categories', 'Street', 'City'];
    const rows = filtered.map((business) => [
      `"${business.title.replace(/"/g, '""')}"`,
      `"${business.phone}"`,
      `"${business.categories.join('; ')}"`,
      `"${business.street.replace(/"/g, '""')}"`,
      `"${business.city.replace(/"/g, '""')}"`,
    ]);

    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'no_website_leads.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${filtered.length} leads to CSV`, 'success');
  };

  const exportJSON = () => {
    if (!filtered.length) {
      return;
    }

    const data = filtered.map((business) => ({
      title: business.title,
      phone: business.phone,
      categories: business.categories,
      street: business.street,
      city: business.city,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'no_website_leads.json';
    anchor.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${filtered.length} leads to JSON`, 'success');
  };

  return (
    <>
      <Toast toasts={toasts} remove={removeToast} />

      <div className="page-shell">
        <div className="page-grid">
          <section className="hero-panel">
            <div className="hero-mark">
              <TargetIcon className="h-7 w-7" />
            </div>
            <div className="hero-copy">
              <p className="eyebrow">Lead intelligence suite</p>
              <h1 className="hero-title">Lead Extractor</h1>
              <p className="hero-description">
                Upload Google Places exports and instantly isolate businesses that do not have a website, ready for focused outreach.
              </p>
            </div>

            <div className="hero-metrics">
              <div className="hero-metric">
                <span className="hero-metric-label">Input</span>
                <strong>JSON datasets</strong>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Output</span>
                <strong>Qualified no-site leads</strong>
              </div>
            </div>

            {extracted.length > 0 && (
              <div className="hidden lg:flex lg:flex-wrap lg:gap-3">
                <button className="btn-secondary flex items-center gap-2" onClick={exportJSON}>
                  <DownloadIcon className="w-4 h-4" />
                  Export JSON
                </button>
                <button className="btn-primary flex items-center gap-2" onClick={exportCSV}>
                  <DownloadIcon className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            )}
          </section>

          <main className="content-panel">
            <section
              className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileInput} />

              {loading ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="spinner" />
                  <div>
                    <p className="text-lg font-semibold text-black">Processing file</p>
                    <p className="mt-1 text-sm text-neutral-500">Reading and filtering businesses without websites.</p>
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-2xl text-center">
                  <p className="eyebrow">Upload</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                    {dragOver ? 'Drop the file here' : 'Drop a Google Places JSON file'}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base">
                    Clean monochrome workspace, instant filtering, and export-ready results for mobile and desktop teams.
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <button className="btn-primary pointer-events-none px-8 py-3">Choose file</button>
                    <span className="text-sm text-neutral-500">{fileName ? `Last upload: ${fileName}` : 'JSON only'}</span>
                  </div>
                </div>
              )}
            </section>

            {stats && (
              <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                <StatCard label="Total records" value={stats.total} />
                <StatCard label="Have website" value={stats.withWebsite} percentage={Math.round((stats.withWebsite / stats.total) * 100)} />
                <StatCard label="No website" value={stats.withoutWebsite} percentage={Math.round((stats.withoutWebsite / stats.total) * 100)} />
                <StatCard label="Filtered leads" value={filtered.length} percentage={Math.round((filtered.length / stats.total) * 100)} />
              </section>
            )}

            {extracted.length > 0 && (
              <>
                <section className="filter-bar mt-6">
                  <div className="w-full flex-1">
                    <input
                      className="search-input"
                      placeholder="Search by business, phone, city, or category"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                      }}
                    />
                  </div>

                  <div className="w-full sm:w-[15rem]">
                    <select
                      className="search-input appearance-none"
                      value={categoryFilter}
                      onChange={(event) => {
                        setCategoryFilter(event.target.value);
                        setPage(1);
                      }}
                    >
                      <option value="">All categories</option>
                      {allCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(search || categoryFilter) && (
                    <button
                      className="btn-secondary w-full sm:w-auto"
                      onClick={() => {
                        setSearch('');
                        setCategoryFilter('');
                        setPage(1);
                      }}
                    >
                      Clear filters
                    </button>
                  )}
                </section>

                <section className="results-panel mt-6">
                  <div className="results-header">
                    <div>
                      <p className="eyebrow">Results</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-black">Businesses without websites</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="badge badge-no-website">{filtered.length} leads</span>
                      <span className="page-pill">
                        Page {page} of {totalPages || 1}
                      </span>
                    </div>
                  </div>

                  {paginated.length === 0 ? (
                    <div className="empty-panel">No results match the current filters.</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4 xl:hidden">
                        {paginated.map((business, index) => (
                          <article key={`${business.title}-${index}`} className="lead-card">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                                  Lead {(page - 1) * PER_PAGE + index + 1}
                                </p>
                                <h4 className="mt-2 text-lg font-semibold leading-tight text-black">{business.title}</h4>
                              </div>
                              <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-neutral-500">
                                {business.city !== EMPTY_VALUE ? business.city : 'Unknown city'}
                              </span>
                            </div>

                            <div className="mt-5 grid gap-3 text-sm text-neutral-600">
                              <div className="flex items-start gap-2">
                                <MapIcon className="mt-0.5 w-4 h-4 text-black" />
                                <span>
                                  {business.street !== EMPTY_VALUE ? business.street : 'Street unavailable'}
                                  {business.city !== EMPTY_VALUE ? `, ${business.city}` : ''}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <PhoneIcon className="mt-0.5 w-4 h-4 text-black" />
                                <span>{business.phone}</span>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                              {business.categories.length > 0 ? (
                                business.categories.slice(0, 4).map((category) => (
                                  <span key={category} className="badge badge-category">
                                    {category}
                                  </span>
                                ))
                              ) : (
                                <span className="badge badge-category">No category</span>
                              )}
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                              <a
                                href={business.phone !== EMPTY_VALUE ? `tel:${business.phone}` : '#'}
                                className={`action-chip ${business.phone !== EMPTY_VALUE ? 'action-chip-solid' : 'action-chip-disabled'}`}
                              >
                                <PhoneIcon className="w-4 h-4" />
                                Call
                              </a>
                              <a
                                href={business.phone !== EMPTY_VALUE ? getWhatsAppLink(business.phone) : '#'}
                                target={business.phone !== EMPTY_VALUE ? '_blank' : undefined}
                                rel={business.phone !== EMPTY_VALUE ? 'noopener noreferrer' : undefined}
                                className={`action-chip ${business.phone !== EMPTY_VALUE ? 'action-chip-solid' : 'action-chip-disabled'}`}
                              >
                                <WhatsAppIcon className="w-4 h-4" />
                                WhatsApp
                              </a>
                              <a
                                href={getMapsLink(business)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-chip"
                              >
                                <MapIcon className="w-4 h-4" />
                                Map
                              </a>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(business.phone !== EMPTY_VALUE ? business.phone : '', 'Phone')}
                                disabled={business.phone === EMPTY_VALUE}
                                className="action-chip disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <CopyIcon className="w-4 h-4" />
                                Copy
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>

                      <div className="hidden overflow-hidden rounded-[1.75rem] border border-black/10 bg-white xl:block">
                        <div className="overflow-x-auto">
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th className="w-14 text-center">#</th>
                                <th onClick={() => handleSort('title')} className="cursor-pointer">
                                  Business <span className={sortField === 'title' ? 'text-black' : 'text-neutral-400'}>{getSortIcon('title')}</span>
                                </th>
                                <th onClick={() => handleSort('phone')} className="cursor-pointer">
                                  Phone <span className={sortField === 'phone' ? 'text-black' : 'text-neutral-400'}>{getSortIcon('phone')}</span>
                                </th>
                                <th onClick={() => handleSort('categories')} className="cursor-pointer">
                                  Categories <span className={sortField === 'categories' ? 'text-black' : 'text-neutral-400'}>{getSortIcon('categories')}</span>
                                </th>
                                <th onClick={() => handleSort('city')} className="cursor-pointer">
                                  Location <span className={sortField === 'city' ? 'text-black' : 'text-neutral-400'}>{getSortIcon('city')}</span>
                                </th>
                                <th className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginated.map((business, index) => (
                                <tr key={`${business.title}-${index}`}>
                                  <td className="text-center text-xs font-semibold text-neutral-400">
                                    {(page - 1) * PER_PAGE + index + 1}
                                  </td>
                                  <td>
                                    <div className="font-semibold text-black">{business.title}</div>
                                  </td>
                                  <td>
                                    {business.phone !== EMPTY_VALUE ? (
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-black">{business.phone}</span>
                                        <button type="button" onClick={() => copyToClipboard(business.phone, 'Phone')} className="icon-button">
                                          <CopyIcon className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-neutral-400">{EMPTY_VALUE}</span>
                                    )}
                                  </td>
                                  <td>
                                    <div className="flex max-w-[18rem] flex-wrap gap-2">
                                      {business.categories.length > 0 ? (
                                        business.categories.slice(0, 3).map((category) => (
                                          <span key={category} className="badge badge-category">
                                            {category}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-neutral-400">{EMPTY_VALUE}</span>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <span className="text-sm text-neutral-600">
                                      {business.street !== EMPTY_VALUE ? `${business.street}, ` : ''}
                                      {business.city !== EMPTY_VALUE ? business.city : EMPTY_VALUE}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="flex items-center justify-end gap-2">
                                      {business.phone !== EMPTY_VALUE && (
                                        <>
                                          <a href={`tel:${business.phone}`} className="icon-button icon-button-solid" title="Call">
                                            <PhoneIcon className="w-4 h-4" />
                                          </a>
                                          <a
                                            href={getWhatsAppLink(business.phone)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="icon-button icon-button-solid"
                                            title="WhatsApp"
                                          >
                                            <WhatsAppIcon className="w-4 h-4" />
                                          </a>
                                        </>
                                      )}
                                      <a href={getMapsLink(business)} target="_blank" rel="noopener noreferrer" className="icon-button" title="Map">
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

                  {totalPages > 1 && (
                    <div className="pagination-bar">
                      <button className="btn-secondary px-4 py-2" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                        Previous
                      </button>

                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                          let pageNum = 1;
                          if (totalPages <= 5) {
                            pageNum = index + 1;
                          } else if (page <= 3) {
                            pageNum = index + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + index;
                          } else {
                            pageNum = page - 2 + index;
                          }

                          const isCurrent = pageNum === page;
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setPage(pageNum)}
                              className={`page-button ${isCurrent ? 'page-button-active' : ''}`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        className="btn-secondary px-4 py-2"
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </section>
              </>
            )}

            {!loading && extracted.length === 0 && !stats && (
              <section className="empty-state">
                <div className="empty-state-icon">
                  <TargetIcon className="h-10 w-10" />
                </div>
                <p className="eyebrow">Ready</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black">No data uploaded yet</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500 sm:text-base">
                  Start by uploading a Google Places JSON export to surface businesses that still need a web presence.
                </p>
              </section>
            )}

            {!loading && stats && extracted.length === 0 && (
              <section className="empty-state">
                <div className="empty-state-icon">
                  <TargetIcon className="h-10 w-10" />
                </div>
                <p className="eyebrow">Complete</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black">All {stats.total} businesses already have websites</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500 sm:text-base">
                  No leads without a website were found in this dataset. Upload another file to continue prospecting.
                </p>
              </section>
            )}
          </main>
        </div>
      </div>

      {extracted.length > 0 && (
        <div className="mobile-export-bar w-sm lg:hidden ">
      
          <div className="flex items-center gap-2">
            <button className="btn-secondary px-4 py-1" onClick={exportJSON}>
              JSON
            </button>
            <button className="btn-primary px-4 py-1" onClick={exportCSV}>
              CSV
            </button>
          </div>
        </div>
      )}
    </>
  );
}
