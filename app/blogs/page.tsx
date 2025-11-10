import { blogs } from "@/lib/data/blogs";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Read our latest blogs about homestays and travel in Konkan.",
};

export default function BlogsPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-12 text-center text-4xl font-bold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link href={`/blogs/${blog.slug}`} key={blog.id}>
              <Card className="flex h-full flex-col overflow-hidden transition-transform hover:scale-[1.02]">
                <div className="relative h-48">
                  <Image
                    src={blog.images[0]}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="text-xl font-semibold">{blog.title}</h2>
                  <p className="mt-2 line-clamp-4 flex-1 text-gray-600">
                    {blog.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
