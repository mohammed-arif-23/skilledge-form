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
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-[#1E3A9F]/5 overflow-hidden text-center border border-gray-100"
                >
                    <div className="h-2 w-full bg-[#E8920A]" />
                    <div className="p-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 250, damping: 15 }}
                            className="w-20 h-20 rounded-full bg-[#EEF2FF] border-4 border-[#2B4ECC] flex items-center justify-center mx-auto mb-8 shadow-inner"
                        >
                            <Check className="w-10 h-10 text-[#2B4ECC]" strokeWidth={3} />
                        </motion.div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Submission Received!</h2>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto font-medium">
                            Thank you. Your details have been securely recorded by the system.
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const item = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
    };

    const inputBase = (id: string) =>
        `w-full outline-none text-[15px] font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal transition-all duration-200 rounded-xl px-5 py-4 border-2 ${focused === id
            ? 'border-[#2B4ECC] bg-white ring-4 ring-[#2B4ECC]/10'
            : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-gray-300'
        }`;

    return (
        <div className="min-h-screen bg-[#F4F6FD] font-sans pb-24 selection:bg-[#E8920A]/20 selection:text-[#1E3A9F]">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-[#E8920A]" />

            {/* Clean White Header for Logo */}
            <div className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-2 py-2 flex items-center justify-center sm:justify-start">
                    <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[75px] sm:h-[60px]">
                        <Image src="/logo.png" alt="AVS Engineering College" fill className="object-contain object-center sm:object-left" priority />
                    </div>
                </div>
            </div>

            {/* Refined Blue Hero Banner */}
            <div className="relative overflow-hidden bg-[#1E3A9F] pb-24 pt-12 text-center sm:text-left">
                {/* Subtle embedded background designs - NOT overlapping actual content colors */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-white opacity-[0.03] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute left-0 bottom-0 w-80 h-80 bg-[#E8920A] opacity-10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/3 pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto px-6">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                        <span className="flex items-center tracking-widest text-[#E8920A] text-xs font-bold uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E8920A] mr-2"></div>
                            Elite Programme
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                        {form.title}
                    </h1>
                    {form.description && (
                        <p className="mt-4 text-[#93AAEF] font-medium text-base sm:text-lg leading-relaxed max-w-2xl mx-auto sm:mx-0">
                            {form.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Main Form Body Container */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-14 relative z-20">
                <motion.div initial="hidden" animate="show" variants={container} className="bg-white rounded-3xl shadow-xl shadow-[#1E3A9F]/5 border border-gray-100 p-6 sm:p-10 lg:p-12">

                    <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-[#2B4ECC] rounded-full" />
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Registration Details</h3>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-1.5 border border-gray-100">
                            <span className="text-sm font-bold text-[#2B4ECC]">{form.fields?.length || 0}</span>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Questions</span>
                        </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-6"
                            >
                                <div className="bg-red-50 text-red-700 px-4 py-3.5 rounded-xl text-sm font-semibold border border-red-200 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {form.fields.map((field: any) => (
                            <motion.div key={field.id} variants={item} className="group">
                                <label className="block text-[15px] font-bold text-gray-800 tracking-wide mb-3 px-1">
                                    {field.label}
                                    {field.required && <span className="text-[#E8920A] ml-1 text-lg leading-none">*</span>}
                                </label>

                                {/* Text / Email / Date */}
                                {['text', 'email', 'date'].includes(field.type) && (
                                    <input
                                        type={field.type}
                                        required={field.required}
                                        placeholder={field.placeholder || 'Type your answer...'}
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
                                        placeholder={field.placeholder || 'Provide detailed information...'}
                                        value={responses[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        onFocus={() => setFocused(field.id)}
                                        onBlur={() => setFocused(null)}
                                        rows={4}
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
                                            className={`${inputBase(field.id)} appearance-none cursor-pointer pr-12`}
                                        >
                                            <option value="" disabled hidden>Select an option...</option>
                                            {(field.options || []).map((opt: string) => (
                                                <option key={opt} value={opt} className="font-medium">{opt}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100/50 flex items-center justify-center pointer-events-none group-hover:bg-gray-200/50 transition-colors">
                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                        </div>
                                    </div>
                                )}

                                {/* Radio */}
                                {field.type === 'radio' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(field.options || []).map((opt: string) => {
                                            const isSelected = responses[field.id] === opt;
                                            return (
                                                <label
                                                    key={opt}
                                                    className={`flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                                                        ? 'border-[#2B4ECC] bg-[#EEF2FF]'
                                                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <input type="radio" name={field.id} value={opt} checked={isSelected}
                                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                                        required={field.required} className="sr-only"
                                                    />
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-[#2B4ECC]' : 'border-gray-300 bg-white'}`}>
                                                        <div className={`w-2.5 h-2.5 rounded-full bg-[#2B4ECC] transition-all duration-200 ${isSelected ? 'scale-100' : 'scale-0'}`} />
                                                    </div>
                                                    <span className={`text-[15px] font-semibold transition-colors ${isSelected ? 'text-[#1E3A9F]' : 'text-gray-700'}`}>{opt}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Checkbox */}
                                {field.type === 'checkbox' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(field.options || []).map((opt: string) => {
                                            const isChecked = (responses[field.id] || []).includes(opt);
                                            return (
                                                <label
                                                    key={opt}
                                                    className={`flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isChecked
                                                        ? 'border-[#E8920A] bg-[#EEF2FF]'
                                                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <input type="checkbox" checked={isChecked}
                                                        onChange={(e) => handleCheckbox(field.id, opt, e.target.checked)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isChecked ? 'bg-[#E8920A] border-[#E8920A]' : 'border-gray-300 bg-white'}`}>
                                                        <Check className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${isChecked ? 'scale-100' : 'scale-0'}`} strokeWidth={4} />
                                                    </div>
                                                    <span className={`text-[15px] font-semibold transition-colors ${isChecked ? 'text-gray-900' : 'text-gray-700'}`}>{opt}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {/* Submit Field */}
                        <motion.div variants={item} className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 bg-[#1E3A9F] hover:bg-[#162d85] active:scale-[0.99] text-white font-bold text-[16px] py-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#1E3A9F]/20"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Submitting...</span></>
                                ) : (
                                    <><span>Submit Form</span><ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-5 font-medium tracking-wide">
                                AVSEC SkillEdge © 2026. All rights reserved.
                            </p>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
