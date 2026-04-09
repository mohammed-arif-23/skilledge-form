'use client';

import { useEffect, useState } from 'react';
import { getForms, deleteForm } from '@/actions/formActions';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Users, ExternalLink } from 'lucide-react';

export default function DashboardClient() {
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-3 justify-between items-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Forms</h1>
                <Link href="/admin/forms/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium whitespace-nowrap">
                    <Plus className="w-4 h-4" />
                    Create Form
                </Link>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>)}
                </div>
            ) : forms.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No forms exist yet.</p>
                    <Link href="/admin/forms/create" className="text-blue-600 hover:underline">Create your first form</Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {forms.map(form => (
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
            )}
        </div>
    );
}
