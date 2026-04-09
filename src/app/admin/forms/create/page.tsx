import FormBuilderClient from '@/components/FormBuilderClient';

export default function CreateFormPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Create New Form</h1>
            </div>
            <FormBuilderClient />
        </div>
    );
}
