"use client";

import { useState } from "react";
import { Review } from "@/lib/types";

interface ReviewsProps {
  reviews: Review[];
  onSubmit: (review: Review) => void;
}

export function Reviews({ reviews, onSubmit }: ReviewsProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReview: Review = {
      id: Date.now().toString(),
      name,
      comment,
      media: [],
      date: new Date().toLocaleDateString(),
    };

    if (mediaFiles) {
      newReview.media = Array.from(mediaFiles).map((file) => ({
        type: file.type.startsWith("video") ? "video" : "image",
        url: URL.createObjectURL(file),
      }));
    }

    onSubmit(newReview);
    setName("");
    setComment("");
    setMediaFiles(null);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          required
          placeholder="Your name"
          className="w-full border px-3 py-2 rounded text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          required
          placeholder="Your review"
          className="w-full border px-3 py-2 rounded text-sm"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setMediaFiles(e.target.files)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#FF385C] text-white rounded text-sm"
        >
          Submit Review
        </button>
      </form>

      {/* Display reviews */}
      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border p-4 rounded text-sm">
            <div className="font-semibold">{review.name}</div>
            <div className="text-gray-600 text-xs mb-2">{review.date}</div>
            <p>{review.comment}</p>
            {review.media && review.media.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {review.media.map((file, index) =>
                  file.type === "video" ? (
                    <video key={index} src={file.url} controls className="w-full rounded" />
                  ) : (
                    <img key={index} src={file.url} alt="Review media" className="w-full rounded" />
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
