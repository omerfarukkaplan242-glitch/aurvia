"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="px-5 py-16" role="alert">
      <h1 className="serif text-3xl text-white">Something went wrong</h1>
      <button className="mt-4 rounded-full bg-cyan px-4 py-2 font-semibold text-ink" type="button" onClick={() => reset()}>Try again</button>
    </section>
  );
}
