import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-5 py-16">
      <h1 className="serif text-4xl text-white">This page is not available.</h1>
      <Link className="mt-4 inline-block text-cyan" href="/en">AURVIA</Link>
    </section>
  );
}
