'use client';

import { useState } from 'react';
import { submitFormBySlug } from '@/actions/formActions';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function PublicFormClient({ form }: { form: any }) {
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (fieldId: string, value: any) => {
        setResponses((prev) => ({ ...prev, [fieldId]: value }));
        if (error) setError('');
    };

    const handleCheckbox = (fieldId: string, option: string, checked: boolean) => {
        setResponses((prev) => {
            const current = prev[fieldId] || [];
            const updated = checked
                ? [...current, option]
                : current.filter((o: string) => o !== option);
            return { ...prev, [fieldId]: updated };
        });
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Validation
        for (const field of form.fields) {
            if (field.required && (!responses[field.id] || responses[field.id].length === 0)) {
                setError(`${field.label} is required to continue`);
                setIsSubmitting(false);
                return;
            }
        }

        try {
            await submitFormBySlug(form.slug, responses);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred submitting your response.');
        }
        setIsSubmitting(false);
    };

    const LogoBlock = () => (
        <div className="w-full flex justify-center pt-8 pb-10">
            <div className="relative w-[280px] h-[80px]">
                <Image src="/logo.png" alt="Brand Logo" fill className="object-contain" priority />
            </div>
        </div>
    );

    if (success) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col items-center selection:bg-blue-100 selection:text-blue-900 font-sans px-4">
                <LogoBlock />
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-md w-full bg-white p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center mt-4"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 250, damping: 20 }}
                        className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    >
                        <Check className="w-8 h-8" strokeWidth={3} />
                    </motion.div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">Response Received</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">Thank you. Your information has been securely submitted and recorded.</p>
                </motion.div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 selection:bg-blue-100 selection:text-blue-900 font-sans pb-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <LogoBlock />
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                    className="bg-white shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-gray-200/60 rounded-[2rem] overflow-hidden"
                >
                    {/* Header Area */}
                    <motion.div variants={itemVariants} className="px-8 sm:px-12 pt-12 pb-8 border-b border-gray-100 bg-white">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
                            {form.title}
                        </h1>
                        {form.description && (
                            <p className="text-base text-gray-500 leading-relaxed max-w-xl">
                                {form.description}
                            </p>
                        )}

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2 overflow-hidden"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">
                        {form.fields.map((field: any) => (
                            <motion.div key={field.id} variants={itemVariants} className="group">
                                <label className="block text-[15px] font-semibold text-gray-900 mb-3 flex items-start">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1.5 text-lg leading-none shrink-0">*</span>}
                                </label>

                                {['text', 'email', 'date'].includes(field.type) && (
                                    <input
                                        type={field.type}
                                        required={field.required}
                                        placeholder={field.placeholder || "Enter your text"}
                                        value={responses[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                                    />
                                )}

                                {field.type === 'textarea' && (
                                    <textarea
                                        required={field.required}
                                        placeholder={field.placeholder || "Enter your text..."}
                                        value={responses[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 resize-y"
                                    />
                                )}

                                {field.type === 'dropdown' && (
                                    <div className="relative">
                                        <select
                                            required={field.required}
                                            value={responses[field.id] || ''}
                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                            className="w-full appearance-none bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none px-4 py-3.5 text-base text-gray-900 transition-all duration-200 cursor-pointer"
                                        >
                                            <option value="" disabled hidden className="text-gray-400">Select an option</option>
                                            {(field.options || []).map((opt: string) => (
                                                <option key={opt} value={opt} className="text-gray-900">{opt}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            ▼
                                        </div>
                                    </div>
                                )}

                                {field.type === 'radio' && (
                                    <div className="space-y-2.5">
                                        {(field.options || []).map((opt: string) => (
                                            <label key={opt} className="relative flex items-center p-3.5 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50 group/radio">
                                                <input
                                                    type="radio"
                                                    name={field.id}
                                                    value={opt}
                                                    required={field.required}
                                                    checked={responses[field.id] === opt}
                                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-4 flex-shrink-0 peer-checked:border-blue-600 flex items-center justify-center bg-white transition-colors">
                                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
                                                </div>
                                                <span className="text-[15px] text-gray-700 peer-checked:text-gray-900 font-medium transition-colors">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {field.type === 'checkbox' && (
                                    <div className="space-y-2.5">
                                        {(field.options || []).map((opt: string) => (
                                            <label key={opt} className="relative flex items-center p-3.5 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50 group/check">
                                                <input
                                                    type="checkbox"
                                                    checked={(responses[field.id] || []).includes(opt)}
                                                    onChange={(e) => handleCheckbox(field.id, opt, e.target.checked)}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-5 h-5 border-2 border-gray-300 rounded-md mr-4 flex-shrink-0 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center bg-white peer-checked:bg-blue-600 transition-all duration-200">
                                                    <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                                                </div>
                                                <span className="text-[15px] text-gray-700 peer-checked:text-gray-900 font-medium transition-colors">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        <motion.div variants={itemVariants} className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold text-[15px] py-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit Form</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-center mt-8"
                >
                    <span className="text-xs font-medium text-gray-400">Powered by FormFlow</span>
                </motion.div>
            </div>
        </div>
    );
}
