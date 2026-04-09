'use client';

import { useState } from 'react';
import { submitFormBySlug } from '@/actions/formActions';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function PublicFormClient({ form }: { form: any }) {
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [focused, setFocused] = useState<string | null>(null);

    const handleChange = (fieldId: string, value: any) => {
        setResponses((prev) => ({ ...prev, [fieldId]: value }));
        if (error) setError('');
    };

    const handleCheckbox = (fieldId: string, option: string, checked: boolean) => {
        setResponses((prev) => {
            const current = prev[fieldId] || [];
            const updated = checked ? [...current, option] : current.filter((o: string) => o !== option);
            return { ...prev, [fieldId]: updated };
        });
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        for (const field of form.fields) {
            if (field.required && (!responses[field.id] || responses[field.id].length === 0)) {
                setError(`"${field.label}" is required`);
                setIsSubmitting(false);
                return;
            }
        }
        try {
            await submitFormBySlug(form.slug, responses);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Submission failed. Please try again.');
        }
        setIsSubmitting(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#F4F6FD] flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center"
                >
                    <div className="h-2 w-full bg-[#E8920A]" />
                    <div className="p-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                            className="w-20 h-20 rounded-full bg-[#EEF2FF] border-4 border-[#2B4ECC] flex items-center justify-center mx-auto mb-8"
                        >
                            <Check className="w-9 h-9 text-[#2B4ECC]" strokeWidth={3} />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-[#1a2d7a] mb-3 tracking-tight">Submission Received!</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Thank you. Your form has been successfully submitted.
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.07 } }
    };
    const item = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
    };

    const inputBase = (id: string) =>
        `w-full outline-none text-[15px] text-gray-900 placeholder:text-gray-400 transition-all duration-200 rounded-xl px-4 py-3.5 border-2 ${focused === id
            ? 'border-[#2B4ECC] bg-white shadow-[0_0_0_4px_rgba(43,78,204,0.08)]'
            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
        }`;

    return (
        <div className="min-h-screen bg-[#F4F6FD] font-sans pb-24">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-[#E8920A]" />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-center">
                    <div className="relative w-[320px] h-[70px]">
                        <Image src="/logo.png" alt="AVS Engineering College" fill className="object-contain" priority />
                    </div>
                </div>
            </div>

            {/* Form hero banner */}
            <div className="bg-[#1E3A9F] text-white">
                <div className="max-w-3xl mx-auto px-6 py-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-6 w-1.5 bg-[#E8920A] rounded-full" />
                        <span className="text-[#93AAEF] text-xs font-semibold uppercase tracking-widest">Elite Students Programme</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        {form.title}
                    </h1>
                    {form.description && (
                        <p className="mt-3 text-[#93AAEF] text-base leading-relaxed max-w-xl">
                            {form.description}
                        </p>
                    )}
                    <div className="mt-5 flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-[#2B4ECC]/40 rounded-full px-3 py-1">
                            <div className="w-2 h-2 rounded-full bg-[#E8920A] animate-pulse" />
                            <span className="text-xs text-[#c5d0f8] font-medium">{form.fields?.length || 0} questions</span>
                        </div>
                        <span className="text-xs text-[#7b94dd]">All starred fields are mandatory</span>
                    </div>
                </div>
            </div>

            {/* Form body */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-4">
                <motion.div initial="hidden" animate="show" variants={container}>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium border border-red-200 flex items-center gap-2.5 mb-4">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {form.fields.map((field: any) => (
                            <motion.div
                                key={field.id}
                                variants={item}
                                className="bg-white rounded-2xl border border-gray-200/80 p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(30,58,159,0.08)] transition-shadow duration-300"
                            >
                                <label className="block text-[15px] font-bold text-gray-800 mb-4 leading-snug">
                                    {field.label}
                                    {field.required && <span className="text-[#E8920A] ml-1.5 text-base font-black">*</span>}
                                </label>

                                {/* Text / Email / Date */}
                                {['text', 'email', 'date'].includes(field.type) && (
                                    <input
                                        type={field.type}
                                        required={field.required}
                                        placeholder={field.placeholder || 'Type here...'}
                                        value={responses[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        onFocus={() => setFocused(field.id)}
                                        onBlur={() => setFocused(null)}
                                        className={inputBase(field.id)}
                                    />
                                )}

                                {/* Textarea */}
                                {field.type === 'textarea' && (
                                    <textarea
                                        required={field.required}
                                        placeholder={field.placeholder || 'Type here...'}
                                        value={responses[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        onFocus={() => setFocused(field.id)}
                                        onBlur={() => setFocused(null)}
                                        rows={3}
                                        className={`${inputBase(field.id)} resize-y`}
                                    />
                                )}

                                {/* Dropdown */}
                                {field.type === 'dropdown' && (
                                    <div className="relative">
                                        <select
                                            required={field.required}
                                            value={responses[field.id] || ''}
                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                            onFocus={() => setFocused(field.id)}
                                            onBlur={() => setFocused(null)}
                                            className={`${inputBase(field.id)} appearance-none cursor-pointer`}
                                        >
                                            <option value="" disabled hidden>Select option...</option>
                                            {(field.options || []).map((opt: string) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                )}

                                {/* Radio */}
                                {field.type === 'radio' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {(field.options || []).map((opt: string) => {
                                            const isSelected = responses[field.id] === opt;
                                            return (
                                                <label
                                                    key={opt}
                                                    className={`flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                                                        ? 'border-[#2B4ECC] bg-[#EEF2FF] shadow-[0_0_0_4px_rgba(43,78,204,0.07)]'
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                                                        }`}
                                                >
                                                    <input type="radio" name={field.id} value={opt} checked={isSelected}
                                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                                        required={field.required} className="sr-only peer"
                                                    />
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${isSelected ? 'border-[#2B4ECC]' : 'border-gray-300 bg-white'}`}>
                                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#2B4ECC]" />}
                                                    </div>
                                                    <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-[#1E3A9F]' : 'text-gray-700'}`}>{opt}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Checkbox */}
                                {field.type === 'checkbox' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {(field.options || []).map((opt: string) => {
                                            const isChecked = (responses[field.id] || []).includes(opt);
                                            return (
                                                <label
                                                    key={opt}
                                                    className={`flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isChecked
                                                        ? 'border-[#2B4ECC] bg-[#EEF2FF]'
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                                                        }`}
                                                >
                                                    <input type="checkbox" checked={isChecked}
                                                        onChange={(e) => handleCheckbox(field.id, opt, e.target.checked)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${isChecked ? 'bg-[#2B4ECC] border-[#2B4ECC]' : 'border-gray-300 bg-white'}`}>
                                                        {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
                                                    </div>
                                                    <span className={`text-sm font-semibold transition-colors ${isChecked ? 'text-[#1E3A9F]' : 'text-gray-700'}`}>{opt}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {/* Submit */}
                        <motion.div variants={item} className="pt-2 pb-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 bg-[#1E3A9F] hover:bg-[#162d85] active:scale-[0.99] text-white font-bold text-base py-5 rounded-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_24px_rgba(30,58,159,0.3)] hover:shadow-[0_12px_30px_rgba(30,58,159,0.4)]"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Submitting...</span></>
                                ) : (
                                    <><span>Submit Registration</span><ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                By submitting, you confirm all details are accurate • AVSEC SkillEdge © 2026
                            </p>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
