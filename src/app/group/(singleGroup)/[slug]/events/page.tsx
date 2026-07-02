import { ClientEventsFeed, Eventcard, Noexistence } from "@components";
import React from "react";
import { eventsMapper, getData, getEventPageSchema } from "@/lib/utils";
import { BASE_URL, TEVENT } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";

const Events = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(`groups/slug/${params.slug}/events`);
  const { dictionary } = await getDictionary();

  if (data.error)
    return (
      <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
        <Noexistence message="Something went wrong" />
      </main>
    );

  const events: TEVENT[] = eventsMapper(data);

  let eventPageSchema;

  try {
    eventPageSchema = await getEventPageSchema({
      url: `${BASE_URL}/group/${params.slug}`,
      events: events,
    });
  } catch (err) {
    // console.log(err);
  }

  return (
    <>
      {eventPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventPageSchema),
          }}
        />
      )}
      <section className="space-y-8 max-w-6xl mx-auto">
        {events.map((event: TEVENT) => {
          return <Eventcard key={event.id} {...event} />;
        })}

        {events.length === 0 ? (
          <Noexistence message={dictionary.errors.noEvents} />
        ) : (
          events.length === 20 && (
            <ClientEventsFeed endpoint={`groups/slug/${params.slug}/events`} />
          )
        )}
      </section>
    </>
  );
};

export default Events;
