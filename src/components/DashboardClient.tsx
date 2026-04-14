'use client';

import { useEffect, useState, useMemo } from 'react';
import { getForms, deleteForm } from '@/actions/formActions';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Users, ExternalLink, Search, X } from 'lucide-react';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 8;

export default function DashboardClient() {
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        setLoading(true);
        try {
            const data = await getForms();
            setForms(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, e: any) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this form and all its submissions?')) {
            await deleteForm(id);
            loadForms();
            setPage(1);
        }
    };

    // Filter by title, slug, or description
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return forms;
        return forms.filter(f =>
            f.title?.toLowerCase().includes(q) ||
            f.slug?.toLowerCase().includes(q) ||
            f.description?.toLowerCase().includes(q)
        );
    }, [forms, query]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginatedForms = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSearch = (val: string) => {
        setQuery(val);
        setPage(1); // Always reset to page 1 on new search
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap gap-3 justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a2d7a] tracking-tight">Your Forms</h1>
                    {!loading && forms.length > 0 && (
                        <p className="text-sm font-medium text-[#93AAEF] mt-1">
                            {filtered.length !== forms.length
                                ? `${filtered.length} of ${forms.length} forms`
                                : `${forms.length} total form${forms.length !== 1 ? 's' : ''}`}
                        </p>
                    )}
                </div>
                <Link
                    href="/admin/forms/create"
                    className="bg-[#2B4ECC] hover:bg-[#1E3A9F] text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(43,78,204,0.3)] hover:shadow-[0_6px_20px_rgba(43,78,204,0.4)] text-[15px] font-bold whitespace-nowrap active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" strokeWidth={2.5} />
                    Create Form
                </Link>
            </div>

            {/* Search bar */}
            {!loading && forms.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Search by title, slug or description…"
                        className="w-full pl-11 pr-11 py-3.5 text-[15px] font-medium bg-white border-2 border-gray-100 rounded-2xl shadow-[0_2px_10px_rgba(30,58,159,0.04)] focus:outline-none focus:border-[#2B4ECC] transition-all placeholder-gray-400 text-[#1a2d7a]"
                    />
                    {query && (
                        <button
                            onClick={() => handleSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>)}
                </div>
            ) : forms.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No forms exist yet.</p>
                    <Link href="/admin/forms/create" className="text-blue-600 hover:underline">Create your first form</Link>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                    <Search className="mx-auto w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No forms match &ldquo;{query}&rdquo;</p>
                    <button onClick={() => handleSearch('')} className="mt-2 text-sm text-blue-600 hover:underline">
                        Clear search
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {paginatedForms.map(form => (
                            <div key={form._id} className="bg-white p-5 sm:p-7 rounded-2xl border-2 border-gray-100/60 shadow-[0_4px_16px_rgba(30,58,159,0.04)] flex flex-col sm:flex-row sm:items-center gap-5 hover:border-[#2B4ECC]/20 hover:shadow-[0_8px_24px_rgba(30,58,159,0.08)] transition-all">
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                                        <h3 className="font-extrabold text-lg sm:text-xl text-[#1a2d7a] truncate">{form.title}</h3>
                                        <span className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-black tracking-wide ${form.status === 'published' ? 'bg-[#EEF2FF] text-[#2B4ECC]' : 'bg-gray-100 text-gray-600'}`}>
                                            {form.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-[15px] font-medium text-gray-500 line-clamp-1">{form.description}</p>
                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#93AAEF]">
                                        <span className="bg-[#F4F6FD] border border-[#2B4ECC]/10 text-[#2B4ECC] px-2.5 py-1 rounded-md font-mono">/form/{form.slug}</span>
                                        <span>{form.fields?.length || 0} fields</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2.5 shrink-0">
                                    {form.status === 'published' && (
                                        <a href={`/form/${form.slug}`} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors" title="View Public Form">
                                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </a>
                                    )}
                                    <Link href={`/admin/forms/${form._id}/submissions`} className="p-3 bg-[#EEF2FF] text-[#2B4ECC] hover:bg-[#2B4ECC] hover:text-white rounded-xl transition-colors" title="View Submissions">
                                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </Link>
                                    <Link href={`/admin/forms/${form._id}/edit`} className="p-3 bg-[#E8920A]/10 text-[#E8920A] hover:bg-[#E8920A] hover:text-white rounded-xl transition-colors" title="Edit Form">
                                        <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </Link>
                                    <button onClick={(e) => handleDelete(form._id, e)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors" title="Delete Form">
                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalItems={filtered.length}
                        pageSize={PAGE_SIZE}
                        onPageChange={(p) => {
                            setPage(p);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                </>
            )}
        </div>
    );
}
