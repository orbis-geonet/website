import { BASE_URL, TEVENT } from "@/lib/ts";
import {
  formatDateForSchema,
  formatTimeForSchema,
  getData,
  getURL,
  parseAddress,
} from "..";

export const getEventPageSchema = async ({
  url,
  events,
  id,
}: {
  url: string;
  events: TEVENT[];
  id?: string;
}) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    "@id": `${url}/#${id ? id : "group"}`,
    event: await Promise.all(
      events.map(async (event) => {
        return await getEventSchema({ event: event });
      }),
    ),
  };
};

export const getEventSchema = async ({ event }: { event: TEVENT }) => {
  const address = parseAddress(event.placeaddress);
  let confirmedAttendees: any = [];
  const fetchConfirmedAttendees = async () => {
    try {
      const data = await getData(`events/${event.id}/attendees?size=3`);

      if (data.error) {
        return;
      }

      confirmedAttendees = await Promise.all(
        data.map(async (user: any) => {
          return {
            id: user.userKey,
            name: user.name,
            image: user.imageName
              ? await getURL(`profilePictures/${user.imageName}`)
              : `${BASE_URL}/default/user.svg`,
          };
        }),
      );
    } catch (error) {
      console.error("Error loading more groups:", error);
    }
  };

  await fetchConfirmedAttendees();

  return {
    "@type": "Event",
    name: event.title,
    description: event.details ? event.details : "",
    image: event.mediaSrc
      ? await getURL(`events/images/${event.mediaSrc}`)
      : `${BASE_URL}/logos/logo.webp`,
    startDate: `${formatDateForSchema(event.starttime)}T${formatTimeForSchema(
      event.starttime,
    )}-03:00`,
    endDate: `${formatDateForSchema(event.endtime)}T${formatTimeForSchema(
      event.endtime,
    )}-03:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    inLanguage: "pt",
    attendee:
      confirmedAttendees &&
      confirmedAttendees.length !== 0 &&
      confirmedAttendees.map((user: any) => {
        return {
          "@type": "Person",
          name: user.name,
          url: `${BASE_URL}/user/${user.id}`,
          image: user.image,
        };
      }),
    location: {
      "@type": "Place",
      name: event.placename,
      address: {
        "@type": "PostalAddress",
        streetAddress: address.street,
        addressLocality: address.city,
        postalCode: address.postal_code,
        addressCountry: "BR",
      },
    },
  };
};
