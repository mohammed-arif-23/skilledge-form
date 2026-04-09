'use client';

import { useState, useEffect } from 'react';
import { getSubmissions, deleteSubmission } from '@/actions/formActions';
import ExcelJS from 'exceljs';
import { Download, ArrowLeft, Eye, Trash2, X, AlertTriangle, Search } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 10;

export default function SubmissionsClient({ formId }: { formId: string }) {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSub, setSelectedSub] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');

    useEffect(() => {
        loadData();
    }, [formId]);

    const loadData = async () => {
        try {
            const data = await getSubmissions(formId);
            setSubmissions(data.submissions);
            setForm(data.form);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteSubmission(id);
            setSubmissions((prev) => {
                const updated = prev.filter((s) => s._id !== id);
                // If deleting makes current page empty, go back one
                const newTotalPages = Math.ceil(updated.length / PAGE_SIZE);
                if (page > newTotalPages) setPage(Math.max(1, newTotalPages));
                return updated;
            });
            if (selectedSub?._id === id) setSelectedSub(null);
        } catch (e) {
            console.error(e);
        }
        setDeletingId(null);
        setConfirmId(null);
    };

    const handleSearch = (val: string) => {
        setQuery(val);
        setPage(1);
        setSelectedSub(null);
    };

    const handleExport = async () => {
        if (!form || submissions.length === 0) return;

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Submissions');

        sheet.columns = [
            { header: 'Submission ID', key: 'id', width: 28 },
            { header: 'Date', key: 'date', width: 22 },
            ...(form.fields || []).map((f: any) => ({ header: f.label, key: f.id, width: 30 }))
        ];

        submissions.forEach((sub) => {
            const row: any = { id: sub._id, date: new Date(sub.createdAt).toLocaleString() };
            form.fields.forEach((f: any) => {
                let val = sub.responses[f.id] || '';
                if (Array.isArray(val)) val = val.join(', ');
                row[f.id] = val;
            });
            sheet.addRow(row);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${form.title}-submissions.xlsx`;
        a.click();
    };

    if (loading) return (
        <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg w-1/3" />
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg" />)}
        </div>
    );
    if (!form) return <div className="text-red-500">Form not found.</div>;

    // Filter submissions across all response values + date string
    const filtered = (() => {
        const q = query.trim().toLowerCase();
        if (!q) return submissions;
        return submissions.filter(sub => {
            const dateStr = new Date(sub.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase();
            if (dateStr.includes(q)) return true;
            return Object.values(sub.responses || {}).some((v: any) => {
                const str = Array.isArray(v) ? v.join(', ') : String(v ?? '');
                return str.toLowerCase().includes(q);
            });
        });
    })();

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginatedSubs = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
                        <p className="text-sm text-gray-500">
                            {query
                                ? `${filtered.length} of ${submissions.length} submission${submissions.length !== 1 ? 's' : ''}`
                                : `${submissions.length} submission${submissions.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleExport}
                    disabled={submissions.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Export to Excel
                </button>
            </div>

            {/* Search bar */}
            {submissions.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Search by response value or date…"
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

            {/* Mobile modal overlay for detail panel */}
            {selectedSub && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center lg:hidden bg-black/40 backdrop-blur-sm" onClick={() => setSelectedSub(null)}>
                    <div className="w-full sm:w-auto sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Submission Detail</h3>
                            <button onClick={() => setSelectedSub(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            <p className="text-xs text-gray-400 mb-2">
                                Submitted on: {new Date(selectedSub.createdAt).toLocaleString('en-IN')}
                            </p>
                            {form.fields.map((f: any) => (
                                <div key={f.id} className="border-b border-gray-100 pb-3 last:border-0">
                                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{f.label}</span>
                                    <div className="text-sm text-gray-800 break-words">
                                        {Array.isArray(selectedSub.responses[f.id])
                                            ? selectedSub.responses[f.id].join(', ')
                                            : (selectedSub.responses[f.id] || <span className="text-gray-400 italic">No answer</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100">
                            {confirmId === selectedSub._id ? (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                    <span className="text-xs text-red-600 flex-1">Delete this submission?</span>
                                    <button onClick={() => handleDelete(selectedSub._id)} disabled={deletingId === selectedSub._id}
                                        className="text-xs font-bold text-red-600 hover:underline disabled:opacity-60">
                                        {deletingId === selectedSub._id ? '...' : 'Yes, delete'}
                                    </button>
                                    <button onClick={() => setConfirmId(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmId(selectedSub._id)}
                                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete this submission
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Table */}
                <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-3.5 font-semibold">#</th>
                                    <th className="px-5 py-3.5 font-semibold">Date</th>
                                    {form.fields.slice(0, 3).map((f: any) => (
                                        <th key={f.id} className="px-5 py-3.5 font-semibold truncate max-w-[140px]">{f.label}</th>
                                    ))}
                                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center">
                                            {query ? (
                                                <div>
                                                    <Search className="mx-auto w-7 h-7 text-gray-300 mb-2" />
                                                    <p className="text-gray-400 font-medium">No results for &ldquo;{query}&rdquo;</p>
                                                    <button onClick={() => handleSearch('')} className="mt-1 text-sm text-blue-600 hover:underline">Clear search</button>
                                                </div>
                                            ) : (
                                                <p className="text-gray-400">No submissions yet for this form.</p>
                                            )}
                                        </td>
                                    </tr>
                                ) : paginatedSubs.map((sub, idx) => (
                                    <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                                            {new Date(sub.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        {form.fields.slice(0, 3).map((f: any) => {
                                            let val = sub.responses[f.id] || '—';
                                            if (Array.isArray(val)) val = val.join(', ');
                                            return (
                                                <td key={f.id} className="px-5 py-4 text-gray-700">
                                                    <span className="block truncate max-w-[120px]" title={val}>{val}</span>
                                                </td>
                                            );
                                        })}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => setSelectedSub(sub)}
                                                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {confirmId === sub._id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleDelete(sub._id)}
                                                            disabled={deletingId === sub._id}
                                                            className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition-colors disabled:opacity-60"
                                                        >
                                                            {deletingId === sub._id ? '...' : 'Confirm'}
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmId(null)}
                                                            className="p-1 text-gray-400 hover:text-gray-600"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmId(sub._id)}
                                                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Delete Submission"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail Panel — desktop only sidebar */}
                {selectedSub && (
                    <div className="hidden lg:block w-96 bg-white border border-gray-200 rounded-xl shadow-sm self-start sticky top-6">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Submission Detail</h3>
                            <button onClick={() => setSelectedSub(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <p className="text-xs text-gray-400 mb-2">
                                Submitted on: {new Date(selectedSub.createdAt).toLocaleString('en-IN')}
                            </p>
                            {form.fields.map((f: any) => (
                                <div key={f.id} className="border-b border-gray-100 pb-3 last:border-0">
                                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{f.label}</span>
                                    <div className="text-sm text-gray-800 break-words">
                                        {Array.isArray(selectedSub.responses[f.id])
                                            ? selectedSub.responses[f.id].join(', ')
                                            : (selectedSub.responses[f.id] || <span className="text-gray-400 italic">No answer</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Delete from panel */}
                        <div className="px-6 py-4 border-t border-gray-100">
                            {confirmId === selectedSub._id ? (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                    <span className="text-xs text-red-600 flex-1">Delete this submission?</span>
                                    <button onClick={() => handleDelete(selectedSub._id)} disabled={deletingId === selectedSub._id}
                                        className="text-xs font-bold text-red-600 hover:underline disabled:opacity-60">
                                        {deletingId === selectedSub._id ? '...' : 'Yes, delete'}
                                    </button>
                                    <button onClick={() => setConfirmId(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmId(selectedSub._id)}
                                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete this submission
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => {
                    setPage(p);
                    setSelectedSub(null);
                }}
            />
        </div>
    );
}
