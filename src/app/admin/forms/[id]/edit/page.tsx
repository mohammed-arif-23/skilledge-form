import FormBuilderClient from '@/components/FormBuilderClient';

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Edit Form</h1>
            </div>
            <FormBuilderClient formId={id} />
        </div>
    );
}
