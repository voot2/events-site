import { supabase } from "@/supabaseClient";
import { EventsView } from "@/components/EventsView";

export type Event = {
  id: string;
  title: string;
  slug: string;
  start_at: string;
  end_at: string | null;
  location_name: string | null;
  location_address: string | null;
  city: string | null;
  event_type: string | null;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  ticket_url: string | null;
  status: string;
};

export default async function Home() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_at", { ascending: true });

  if (error) {
    console.error(error);
  }

  const events = (data ?? []) as Event[];

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
              Events
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What&apos;s happening
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Browse upcoming events in a simple list or switch to a calendar
              view. All content is coming directly from your Supabase{" "}
              <code className="rounded-md bg-zinc-900/5 px-1.5 py-0.5 text-xs dark:bg-zinc-50/10">
                events
              </code>{" "}
              table.
            </p>
          </div>
        </header>

        <EventsView events={events} />
      </main>
    </div>
  );
}
