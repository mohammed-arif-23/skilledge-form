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
            <div className="flex flex-wrap gap-3 justify-between items-center">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Forms</h1>
                    {!loading && forms.length > 0 && (
                        <p className="text-sm text-gray-500 mt-0.5">
                            {filtered.length !== forms.length
                                ? `${filtered.length} of ${forms.length} forms`
                                : `${forms.length} form${forms.length !== 1 ? 's' : ''} total`}
                        </p>
                    )}
                </div>
                <Link
                    href="/admin/forms/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
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
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder-gray-400"
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
                            <div key={form._id} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{form.title}</h3>
                                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {form.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-1">{form.description}</p>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                        <span className="bg-gray-50 border border-gray-100 px-2 py-0.5 rounded font-mono">/form/{form.slug}</span>
                                        <span>{form.fields?.length || 0} fields</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {form.status === 'published' && (
                                        <a href={`/form/${form.slug}`} target="_blank" rel="noreferrer" className="p-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg" title="View Public Form">
                                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </a>
                                    )}
                                    <Link href={`/admin/forms/${form._id}/submissions`} className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg" title="View Submissions">
                                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </Link>
                                    <Link href={`/admin/forms/${form._id}/edit`} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg" title="Edit Form">
                                        <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </Link>
                                    <button onClick={(e) => handleDelete(form._id, e)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg" title="Delete Form">
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
