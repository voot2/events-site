import { supabase } from "@/supabaseClient";
import type { Event } from "@/app/page";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDateRange(start: string, end: string | null) {
  const startDate = new Date(start);
  const startText = startDate.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  if (!end) return startText;

  const endDate = new Date(end);
  const sameDay =
    startDate.toDateString() === endDate.toDateString();

  const endText = endDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return sameDay
    ? `${startText} – ${endText}`
    : `${startText} → ${endDate.toLocaleString()}`;
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .limit(1);

  const eventArray = Array.isArray(data) ? data : data ? [data] : [];
  const event = eventArray[0] as Event | undefined;

  if (error || !event) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <nav className="text-sm text-zinc-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            ← Back to events
          </Link>
        </nav>

        <article className="space-y-6 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 md:p-8">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              {event.event_type && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  {event.event_type}
                </span>
              )}
              <span
                className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wide ${
                  event.status === "published"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {event.status}
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {event.title}
            </h1>

            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {formatDateRange(event.start_at, event.end_at)}
            </p>

            {(event.city || event.location_name) && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                {event.city && <span>{event.city}</span>}
                {event.location_name && (
                  <>
                    {event.city && (
                      <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    )}
                    <span>{event.location_name}</span>
                  </>
                )}
              </div>
            )}
          </header>

          {event.description && (
            <section className="space-y-3 text-sm leading-7 text-zinc-700 dark:text-zinc-200">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                About
              </h2>
              <p className="whitespace-pre-line">{event.description}</p>
            </section>
          )}

          {(event.location_address || event.ticket_url) && (
            <section className="grid gap-4 border-t border-dashed border-zinc-200 pt-4 text-sm dark:border-zinc-800 md:grid-cols-2">
              {event.location_address && (
                <div className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Location
                  </h2>
                  <p className="text-zinc-700 dark:text-zinc-200 whitespace-pre-line">
                    {event.location_address}
                  </p>
                </div>
              )}

              {event.ticket_url && (
                <div className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Tickets
                  </h2>
                  <Link
                    href={event.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-50 transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    Get tickets
                  </Link>
                </div>
              )}
            </section>
          )}
        </article>
      </main>
    </div>
  );
}
