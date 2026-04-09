import { getFormBySlug } from '@/actions/formActions';
import PublicFormClient from '@/components/PublicFormClient';
import { notFound } from 'next/navigation';

export default async function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const form = await getFormBySlug(slug);

    if (!form) return notFound();

    return <PublicFormClient form={form} />;
}
