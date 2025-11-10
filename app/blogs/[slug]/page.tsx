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
    <div className="blog-post-container">
      <h1>{blog.title}</h1>
      <Image
        src={blog.images[0]}
        alt={blog.title}
        width={800}
        height={400}
        className="blog-post-image"
      />
      <article
        className="blog-post-body"
        dangerouslySetInnerHTML={{ __html: blog.body }}
      />
    </div>
  );
}
