import UploadHomestayForm from "@/components/plots/upload-homestay-form";

export default function UploadPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-6">Upload a New Homestay</h1>
            <UploadHomestayForm />
        </div>
    );
}
