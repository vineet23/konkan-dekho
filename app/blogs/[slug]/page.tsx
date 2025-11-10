import { blogs } from "@/lib/data/blogs";
import { notFound } from "next/navigation";
import Image from "next/image";
import "../blogs.css";
import { Metadata } from "next";

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = blogs.find((blog) => blog.slug === params.slug);

  if (!blog) {
    return {
      title: "Blog not found",
    };
  }

  return {
    title: blog.title,
    description: blog.description,
  };
}

export default function BlogPage({ params }: Props) {
  const blog = blogs.find((blog) => blog.slug === params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">
          {blog.title}
        </h1>
        <div className="relative mt-8 h-96">
          <Image
            src={blog.images[0]}
            alt={blog.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <article
          className="blog-post-body mx-auto mt-8"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />
      </div>
    </section>
  );
}
