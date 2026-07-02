import { TEVENT } from "../../ts";

const getEventItems = (data?: any): any[] => {
  if (!data || data.error) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.events)) return data.events;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.data?.content)) return data.data.content;
  if (Array.isArray(data.data?.events)) return data.data.events;

  return [];
};

export const eventsMapper = (data?: any) => {
  const eventItems = getEventItems(data);

  const events: TEVENT[] = eventItems.map((event: any) => {
    const source = event.post ?? event;
    const eventHolder: TEVENT = {
      id: source.postKey,
      title: source.title,
      details: source.details,
      mediaSrc:
        source.mediaUrls && source.mediaUrls.length !== 0
          ? source.mediaUrls[0]
          : "",
      starttime: source.plannedTime,
      endtime: source.plannedEndTime,
      placeid: source.place?.placeKey,
      placeslug: source.place?.slug,
      placename: source.place?.name,
      placeaddress: source.place?.address,
    };

    return eventHolder;
  });

  return events;
};
