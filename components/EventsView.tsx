'use client';

import Link from "next/link";
import { useState } from "react";
import type { Event } from "@/app/page";

type ViewMode = "list" | "calendar";

type Props = {
  events: Event[];
};

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDay(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function groupEventsByDay(events: Event[]) {
  return events.reduce<Record<string, Event[]>>((acc, event) => {
    const key = new Date(event.start_at).toISOString().slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});
}

export function EventsView({ events }: Props) {
  const [view, setView] = useState<ViewMode>("list");

  if (events.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No events yet. Try adding a few rows in your Supabase{" "}
        <span className="font-medium">Table Editor</span>.
      </p>
    );
  }

  const eventsByDay = groupEventsByDay(events);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 p-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-full px-3 py-1 transition ${
              view === "list"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            List
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            className={`rounded-full px-3 py-1 transition ${
              view === "calendar"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Calendar
          </button>
        </div>

        <p className="hidden text-xs text-zinc-500 sm:block">
          {events.length} {events.length === 1 ? "event" : "events"}
        </p>
      </div>

      {view === "list" ? (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/events/${encodeURIComponent(event.slug)}`}
                className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                      {formatDay(event.start_at)}
                    </p>
                    <h2 className="text-lg font-medium leading-tight group-hover:underline group-hover:underline-offset-4">
                      {event.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
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
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                  <span>{formatDateTime(event.start_at)}</span>
                  {event.city && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      <span>{event.city}</span>
                    </>
                  )}
                </div>

                {event.short_description && (
                  <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {event.short_description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Calendar
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Object.entries(eventsByDay).map(([date, dayEvents]) => (
              <div
                key={date}
                className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white/70 p-3 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <p className="font-medium text-zinc-800 dark:text-zinc-50">
                  {formatDay(dayEvents[0].start_at)}
                </p>
                <ul className="space-y-1">
                  {dayEvents.map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/events/${encodeURIComponent(event.slug)}`}
                        className="group flex flex-col gap-0.5 rounded-md px-1.5 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <span className="line-clamp-2 text-[0.78rem] font-medium">
                          {event.title}
                        </span>
                        <span className="text-[0.7rem] text-zinc-500 dark:text-zinc-400">
                          {formatDateTime(event.start_at)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
