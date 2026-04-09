'use client';

import { useState, useEffect } from 'react';
import { getSubmissions } from '@/actions/formActions';
import ExcelJS from 'exceljs';
import { Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SubmissionsClient({ formId }: { formId: string }) {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSub, setSelectedSub] = useState<any>(null);

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

    const handleExport = async () => {
        if (!form || submissions.length === 0) return;

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Submissions');

        // Create columns based on form fields
        const columns = [
            { header: 'Submission ID', key: 'id', width: 25 },
            { header: 'Date', key: 'date', width: 20 },
            ...(form.fields || []).map((f: any) => ({
                header: f.label,
                key: f.id,
                width: 30
            }))
        ];

        sheet.columns = columns;

        submissions.forEach(sub => {
            const row: any = {
                id: sub._id,
                date: new Date(sub.createdAt).toLocaleString(),
            };

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

    if (loading) return <div>Loading...</div>;
    if (!form) return <div>Form not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
                        <p className="text-gray-500">Submissions ({submissions.length})</p>
                    </div>
                </div>
                <button
                    onClick={handleExport}
                    disabled={submissions.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    <Download className="w-5 h-5" />
                    Export to Excel
                </button>
            </div>

            <div className="flex gap-6">
                <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Date</th>
                                    {form.fields.slice(0, 3).map((f: any) => (
                                        <th key={f.id} className="px-6 py-3 font-semibold truncate max-w-[150px]">{f.label}</th>
                                    ))}
                                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No submissions yet</td></tr>
                                ) : submissions.map(sub => (
                                    <tr key={sub._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                        {form.fields.slice(0, 3).map((f: any) => {
                                            let val = sub.responses[f.id] || '-';
                                            if (Array.isArray(val)) val = val.join(', ');
                                            return <td key={f.id} className="px-6 py-4 truncate max-w-[150px]">{val}</td>
                                        })}
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => setSelectedSub(sub)} className="text-blue-600 hover:underline font-medium">View Detail</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedSub && (
                    <div className="w-96 bg-white border border-gray-200 rounded-xl p-6 shadow-sm self-start sticky top-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-900">Submission Details</h3>
                            <button onClick={() => setSelectedSub(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <div className="space-y-4">
                            <div className="text-sm text-gray-500 mb-4">
                                Submitted on: {new Date(selectedSub.createdAt).toLocaleString()}
                            </div>
                            {form.fields.map((f: any) => (
                                <div key={f.id} className="border-b border-gray-100 pb-3 last:border-0">
                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{f.label}</span>
                                    <div className="text-gray-800 break-words">
                                        {Array.isArray(selectedSub.responses[f.id])
                                            ? selectedSub.responses[f.id].join(', ')
                                            : (selectedSub.responses[f.id] || '-')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
