'use client';

import { useState, useEffect } from 'react';
import { saveForm, getForm } from '@/actions/formActions';
import { useRouter } from 'next/navigation';
import { GripVertical, Plus, Trash2, Save } from 'lucide-react';


export default function FormBuilderClient({ formId }: { formId?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(!!formId);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [fields, setFields] = useState<any[]>([]);

    useEffect(() => {
        if (formId) {
            loadForm(formId);
        } else {
            setSlug(generateSlug());
        }
    }, [formId]);

    const loadForm = async (id: string) => {
        try {
            const data = await getForm(id);
            setTitle(data.title);
            setDescription(data.description || '');
            setSlug(data.slug);
            setStatus(data.status);
            setFields(data.fields || []);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const generateSlug = () => Math.random().toString(36).substring(2, 10);

    const addField = (type: string) => {
        setFields([...fields, {
            id: crypto.randomUUID(),
            type,
            label: `New ${type} field`,
            placeholder: '',
            required: false,
            options: type === 'dropdown' || type === 'radio' || type === 'checkbox' ? ['Option 1'] : []
        }]);
    };

    const updateField = (id: string, updates: any) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const handleSave = async () => {
        if (!title) return alert("Title is required");
        setSaving(true);
        try {
            await saveForm({
                ...(formId ? { _id: formId } : {}),
                title,
                description,
                slug,
                status,
                fields
            });
            router.push('/admin/dashboard');
        } catch (e: any) {
            alert("Error: " + e.message);
        }
        setSaving(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Builder Core */}
            <div className="flex-1 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Form Title"
                        className="w-full text-3xl font-bold border-none focus:ring-0 px-0 placeholder-gray-300"
                    />
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Form description (optional)"
                        className="w-full mt-2 text-gray-500 border-none focus:ring-0 px-0 resize-none"
                        rows={2}
                    />
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex gap-4 group">
                            <div className="cursor-move text-gray-300 group-hover:text-gray-500 pt-2"><GripVertical /></div>
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <input
                                        type="text"
                                        value={field.label}
                                        onChange={e => updateField(field.id, { label: e.target.value })}
                                        className="flex-1 min-w-0 font-medium bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded px-3 py-1"
                                    />
                                    <select
                                        value={field.type}
                                        onChange={e => updateField(field.id, { type: e.target.value })}
                                        className="border-gray-200 rounded text-sm shrink-0"
                                    >
                                        <option value="text">Short Text</option>
                                        <option value="textarea">Long Text</option>
                                        <option value="email">Email</option>
                                        <option value="dropdown">Dropdown</option>
                                        <option value="radio">Radio Buttons</option>
                                        <option value="checkbox">Checkboxes</option>
                                        <option value="date">Date</option>
                                    </select>
                                </div>

                                {['text', 'textarea', 'email'].includes(field.type) && (
                                    <input
                                        type="text"
                                        value={field.placeholder || ''}
                                        onChange={e => updateField(field.id, { placeholder: e.target.value })}
                                        placeholder="Placeholder text"
                                        className="w-full text-sm border-gray-300 rounded pb-1"
                                    />
                                )}

                                {['dropdown', 'radio', 'checkbox'].includes(field.type) && (
                                    <div className="space-y-2">
                                        {(field.options || []).map((opt: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={e => {
                                                        const newOpts = [...(field.options || [])];
                                                        newOpts[i] = e.target.value;
                                                        updateField(field.id, { options: newOpts });
                                                    }}
                                                    className="flex-1 text-sm border-gray-300 rounded py-1"
                                                />
                                                <button onClick={() => {
                                                    const newOpts = [...(field.options || [])];
                                                    newOpts.splice(i, 1);
                                                    updateField(field.id, { options: newOpts });
                                                }} className="text-red-400 hover:text-red-600 px-2">&times;</button>
                                            </div>
                                        ))}
                                        <button onClick={() => updateField(field.id, { options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] })} className="text-sm text-blue-600 mt-2 block">
                                            + Add Option
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                        <input type="checkbox" checked={field.required} onChange={e => updateField(field.id, { required: e.target.checked })} />
                                        Required field
                                    </label>
                                    <button onClick={() => removeField(field.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {fields.length === 0 && (
                        <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500">
                            Your form is empty. Add a field from the right sidebar.
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Controls */}
            <div className="lg:w-72 w-full space-y-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">Form Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full border-gray-300 rounded">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">Custom Slug</label>
                            <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full border-gray-300 rounded text-sm" />
                            <p className="text-xs text-gray-400 mt-1">/form/{slug}</p>
                        </div>
                        <button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex justify-center items-center gap-2">
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Form'}
                        </button>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">Add Field</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { type: 'text', icon: 'Aa' },
                            { type: 'textarea', icon: '¶' },
                            { type: 'email', icon: '@' },
                            { type: 'dropdown', icon: '▼' },
                            { type: 'radio', icon: '○' },
                            { type: 'checkbox', icon: '☑' },
                            { type: 'date', icon: '📅' }
                        ].map(f => (
                            <button key={f.type} onClick={() => addField(f.type)} className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-200 transition-colors text-sm text-gray-700">
                                <span className="w-5 text-center font-bold text-gray-400">{f.icon}</span>
                                <span className="capitalize">{f.type === 'textarea' ? 'Paragraph' : f.type}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
