"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function UploadHomestayForm() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!imageFile) return alert("Please select an image");
        setLoading(true);

        try {
            const imageRef = ref(storage, `homestays/${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(imageRef);

            await addDoc(collection(db, "homestays"), {
                title,
                location,
                price,
                description,
                imageUrl,
                createdAt: new Date(),
            });

            alert("Homestay uploaded successfully!");
            setTitle("");
            setLocation("");
            setPrice("");
            setDescription("");
            setImageFile(null);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Error uploading homestay");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto space-y-4 mt-10">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <Input type="number" placeholder="Price per night" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <Button onClick={handleUpload} disabled={loading} className="bg-[#FF385C] w-full">
                {loading ? "Uploading..." : "Upload Homestay"}
            </Button>
        </div>
    );
}
