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
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} className="toast" onClick={() => remove(t.id)} style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: 18 }}>
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{t.message}</span>
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
    if (sortField !== field) return <span style={{ opacity: 0.3 }}>↕</span>;
    return <span style={{ color: 'var(--accent-2)' }}>{sortAsc ? '↑' : '↓'}</span>;
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
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-10%', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '0 24px' }}>
        {/* Header */}
        <header style={{
          maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 32,
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>🎯</div>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
                <span className="gradient-text">Lead Extractor</span>
              </h1>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginLeft: 52 }}>
              Extract businesses with <strong style={{ color: 'var(--accent-2)' }}>no website</strong> from Google Places data
            </p>
          </div>
          {extracted.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={exportJSON}>
                ⬇️ Export JSON
              </button>
              <button className="btn-success" onClick={exportCSV}>
                📋 Export CSV
              </button>
            </div>
          )}
        </header>

        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 0 80px' }}>

          {/* Upload Zone */}
          <section
            className={`upload-zone${dragOver ? ' drag-over' : ''}`}
            style={{ padding: '52px 40px', textAlign: 'center', marginBottom: 36 }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Processing your file…</p>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 52, marginBottom: 16 }}>
                  {dragOver ? '📂' : '📁'}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                  {dragOver ? 'Drop to upload' : 'Upload your JSON file'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
                  Drag & drop or click to browse — Google Places JSON format
                </p>
                <button
                  className="btn-primary"
                  style={{ pointerEvents: 'none', fontSize: 14, padding: '10px 28px' }}
                >
                  Choose File
                </button>
                {fileName && (
                  <p style={{
                    marginTop: 16, fontSize: 12, color: 'var(--accent-2)',
                    fontWeight: 600, letterSpacing: '0.04em',
                  }}>
                    ✓ Last file: {fileName}
                  </p>
                )}
              </>
            )}
          </section>

          {/* Stats */}
          {stats && (
            <section style={{ marginBottom: 32, animation: 'fadeIn 0.4s ease' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 16,
              }}>
                {[
                  { label: 'Total Records', value: stats.total, icon: '📊', color: 'var(--text-primary)' },
                  { label: 'Have Website', value: stats.withWebsite, icon: '🌐', color: '#9090b0' },
                  { label: 'No Website', value: stats.withoutWebsite, icon: '🚫', color: 'var(--accent-2)' },
                  { label: 'Showing (filtered)', value: filtered.length, icon: '🎯', color: 'var(--accent)' },
                ].map(stat => (
                  <div key={stat.label} className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 22 }}>{stat.icon}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {stat.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, letterSpacing: '-0.02em' }}>
                      {stat.value.toLocaleString()}
                    </div>
                    {stat.label !== 'Total Records' && (
                      <div style={{ marginTop: 10 }}>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.round((stat.value / stats.total) * 100)}%` }}
                          />
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
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
            <section style={{
              display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24,
              alignItems: 'center',
            }}>
              <div style={{ flex: '1 1 280px' }}>
                <input
                  className="search-input"
                  placeholder="🔍  Search by name, phone, city…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <div style={{ flex: '0 1 220px' }}>
                <select
                  className="search-input"
                  value={categoryFilter}
                  onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="">All Categories</option>
                  {allCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {(search || categoryFilter) && (
                <button className="btn-secondary" style={{ whiteSpace: 'nowrap', fontSize: 13 }}
                  onClick={() => { setSearch(''); setCategoryFilter(''); setPage(1); }}>
                  ✕ Clear filters
                </button>
              )}
            </section>
          )}

          {/* Results Table */}
          {extracted.length > 0 && (
            <section className="card" style={{ overflow: 'hidden', animation: 'fadeIn 0.5s ease' }}>
              <div style={{
                padding: '18px 20px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>
                    Businesses Without Website
                  </h3>
                  <span className="badge badge-no-website">
                    {filtered.length} leads
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Page {page} of {totalPages || 1}
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 36, textAlign: 'center' }}>#</th>
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
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                          {col.label} <SortIcon field={col.key} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                          No results match your search
                        </td>
                      </tr>
                    ) : (
                      paginated.map((b, i) => (
                        <tr key={i} className="animate-fade-in">
                          <td style={{
                            textAlign: 'center', color: 'var(--text-muted)',
                            fontSize: 11, fontWeight: 600,
                          }}>
                            {(page - 1) * PER_PAGE + i + 1}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                              {b.title}
                            </div>
                          </td>
                          <td>
                            {b.phone !== '—' ? (
                              <a
                                href={`tel:${b.phone}`}
                                style={{ color: 'var(--accent-2)', textDecoration: 'none', fontWeight: 500 }}
                              >
                                📞 {b.phone}
                              </a>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {b.categories.length > 0
                                ? b.categories.map(c => (
                                  <span key={c} className="badge badge-category">{c}</span>
                                ))
                                : <span style={{ color: 'var(--text-muted)' }}>—</span>
                              }
                            </div>
                          </td>
                          <td style={{ maxWidth: 220 }}>
                            {b.street !== '—' ? b.street : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                          </td>
                          <td>{b.city !== '—' ? b.city : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '7px 14px', fontSize: 13 }}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >← Prev</button>

                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) pageNum = i + 1;
                    else if (page <= 4) pageNum = i + 1;
                    else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                    else pageNum = page - 3 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        style={{
                          width: 36, height: 36, borderRadius: 8,
                          border: pageNum === page ? '1px solid var(--accent)' : '1px solid var(--border)',
                          background: pageNum === page ? 'rgba(108,99,255,0.2)' : 'transparent',
                          color: pageNum === page ? 'var(--accent)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          fontWeight: pageNum === page ? 700 : 400,
                          fontSize: 13,
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="btn-secondary"
                    style={{ padding: '7px 14px', fontSize: 13 }}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >Next →</button>
                </div>
              )}
            </section>
          )}

          {/* Empty state */}
          {!loading && extracted.length === 0 && !stats && (
            <div style={{ textAlign: 'center', paddingTop: 40, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 60, marginBottom: 16, opacity: 0.5 }}>🗂️</div>
              <p style={{ fontSize: 15 }}>Upload a JSON file to get started</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Supports Google Places dataset format</p>
            </div>
          )}

          {/* Loaded but none without website */}
          {!loading && stats && extracted.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
              <p style={{ fontSize: 16, color: 'var(--accent-2)', fontWeight: 600 }}>
                All {stats.total} businesses have a website!
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                No leads without a website were found in this dataset.
              </p>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
