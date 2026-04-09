import SubmissionsClient from '@/components/SubmissionsClient';

export default async function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <SubmissionsClient formId={id} />;
}
