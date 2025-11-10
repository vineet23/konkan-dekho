import { blogs } from "@/lib/data/blogs";
import Link from "next/link";
import Image from "next/image";
import "./blogs.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Read our latest blogs about homestays and travel in Konkan.",
};

export default function BlogsPage() {
  return (
    <div className="blogs-container">
      <h1>Blogs</h1>
      <div className="blogs-grid">
        {blogs.map((blog) => (
          <Link href={`/blogs/${blog.slug}`} key={blog.id} className="blog-card">
            <Image
              src={blog.images[0]}
              alt={blog.title}
              width={400}
              height={250}
              className="blog-image"
            />
            <div className="blog-content">
              <h2>{blog.title}</h2>
              <p>{blog.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
