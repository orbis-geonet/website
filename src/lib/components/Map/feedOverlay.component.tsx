import {
  cn,
  eventsMapper,
  getData,
  getDefaultPlaceImagePath,
  postsMapper,
} from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Truncatedtext from "../Typography/truncated-text.component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkinslider, Eventcard, Image, Postcard } from "..";
import Link from "next/link";
import DImage from "next/image";
import useLocale from "@/hooks/useLocale";
import Spinner from "@public/spinner.gif";
import { TEVENT } from "@/lib/ts";
import { memo } from "react";

type PARAMS = {
  activePolygon?: any;
  isOneExpanded: boolean;
  activePlace?: any;
};

const Loader = () => {
  return (
    <div className="py-4">
      <DImage
        alt="loading"
        src={Spinner}
        height={20}
        width={20}
        className="mx-auto"
      />
    </div>
  );
};

const LoadMoreButton = ({
  onClick,
  isFetchingNextPage,
  hasNextPage,
}: {
  onClick: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}) => {
  if (!hasNextPage) return null;
  if (isFetchingNextPage) return <Loader />;
  return (
    <div className="flex items-center justify-center p-4">
      <Button onClick={onClick} variant="outline" disabled={isFetchingNextPage}>
        Load More
      </Button>
    </div>
  );
};

// Memoize individual card components
const MemoizedEventCard = memo(Eventcard);
const MemoizedCheckinSlider = memo(Checkinslider);
const MemoizedPostCard = memo(Postcard);

export default function FeedOverlay({
  activePolygon,
  isOneExpanded,
  activePlace,
}: PARAMS) {
  const { dictionary } = useLocale();

  // Optimize query configurations
  const queryConfig = {
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  };

  const activeGroupFeedResponse = useInfiniteQuery({
    queryKey: ["getGroupFeed", activePolygon?.dominantGroup?.slug],
    queryFn: async ({ pageParam }) => {
      return getData(
        `feed/group/slug/${activePolygon.dominantGroup.slug}?size=5${pageParam ? `&nextPage=${pageParam}` : ""}`,
      );
    },
    enabled: isOneExpanded && !!activePolygon?.dominantGroup?.slug,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: "",
    ...queryConfig,
  });

  const activeGroupEventsResponse = useInfiniteQuery({
    queryKey: ["getGroupEvents", activePolygon?.dominantGroup?.slug],
    queryFn: async ({ pageParam }) => {
      const res = await getData(
        `groups/slug/${activePolygon.dominantGroup.slug}/events?size=5&page=${pageParam}`,
      );
      const events = eventsMapper(res);
      return {
        data: res,
        nextPage: events.length < 5 ? null : pageParam + 1,
      };
    },
    enabled: isOneExpanded && !!activePolygon?.dominantGroup?.slug,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    ...queryConfig,
  });

  // Similar optimizations for place queries
  const activePlaceFeedResponse = useInfiniteQuery({
    queryKey: ["getPlaceFeed", activePlace?.slug],
    queryFn: async ({ pageParam }) => {
      return getData(
        `feed/place/slug/${activePlace.slug}?size=5${pageParam ? `&nextPage=${pageParam}` : ""}`,
      );
    },
    enabled: isOneExpanded && !!activePlace?.slug,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: "",
    ...queryConfig,
  });

  const activePlaceEventsResponse = useInfiniteQuery({
    queryKey: ["getPlaceEvents", activePlace?.slug],
    queryFn: async ({ pageParam }) => {
      const res = await getData(
        `places/slug/${activePlace.slug}/events?size=5&page=${pageParam}`,
      );
      const events = eventsMapper(res);
      return {
        data: res,
        nextPage: events.length < 5 ? null : pageParam + 1,
      };
    },
    enabled: !!activePlace?.slug,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    ...queryConfig,
  });

  return (
    <div className="w-80 bg-white rounded-lg overflow-clip absolute left-4 top-4 bottom-4 hidden z-[18] lg:flex flex-col h-[calc(100vh_-_124px)]">
      {!!activePlace ? (
        <>
          <div className="p-4 pt-6 border-b">
            <Link
              target="_blank"
              href={`/place/${activePlace.slug}`}
              className="flex items-center gap-2"
            >
              {activePlace.imageName ? (
                <Image
                  src={`placePictures/${activePlace.imageName}`}
                  alt={activePlace.name}
                  height={100}
                  width={100}
                  priority
                  className="rounded-full h-8 w-8 object-cover"
                />
              ) : (
                <DImage
                  src={getDefaultPlaceImagePath(activePlace.type)}
                  alt={activePlace.name}
                  height={100}
                  width={100}
                  className="rounded-full h-14 w-14 object-cover"
                />
              )}
              <p
                className={cn(
                  "font-semibold text-lg",
                  activePlace.name.length > 30 ? "text-sm" : "",
                )}
              >
                {activePlace.name}
              </p>
            </Link>
            <div className="p-4">
              <Link
                target="_blank"
                href={`/group/${activePolygon.dominantGroup.slug}`}
                className="flex items-center gap-2"
              >
                <Image
                  style={{
                    border: `2px solid ${activePolygon.dominantGroup.strokeColorHex}`,
                  }}
                  src={"groupPictures/" + activePolygon.dominantGroup.imageName}
                  alt={activePolygon.dominantGroup.name}
                  height={100}
                  width={100}
                  priority
                  className="rounded-full h-8 w-8 object-cover"
                />
                <p
                  className={cn(
                    "font-semibold text-sm",
                    activePolygon.dominantGroup.name.length > 30
                      ? "text-sm"
                      : "",
                  )}
                >
                  {activePolygon.dominantGroup.name}
                </p>
              </Link>
              <div
                style={{
                  backgroundColor: activePolygon.dominantGroup.strokeColorHex,
                }}
                className="rounded-full h-2 w-full mt-4"
              ></div>
            </div>
          </div>
          <Tabs defaultValue="feeds" className="flex-1 h-full flex flex-col">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger
                className="py-2 border-b-transparent text-base border-b-2 data-[state=active]:border-black rounded-none font-bold"
                value="feeds"
              >
                Feed
              </TabsTrigger>
              <TabsTrigger
                className="py-2 border-b-transparent text-base border-b-2 data-[state=active]:border-black rounded-none font-bold"
                value="events"
              >
                {dictionary.common.events}
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="feeds"
              className="flex-1 thin-scrollbar overflow-y-auto space-y-2 pb-[200px]"
            >
              {activePlaceFeedResponse.status === "pending" ? (
                <Loader />
              ) : activePlaceFeedResponse.data ? (
                activePlaceFeedResponse.data.pages.map((page, index) => {
                  const posts = postsMapper(page);
                  if (posts.length === 0 && index === 0)
                    return (
                      <p className="py-4 font-medium text-center">No Posts</p>
                    );
                  return posts.map((singlePost: any) => {
                    if (singlePost.type === "CHECKIN")
                      return (
                        <MemoizedCheckinSlider
                          className="md:shadow-none md:rounded-none md:border-b"
                          isSmall={true}
                          key={singlePost.checkins[0].postid}
                          checkins={singlePost.checkins}
                          sliderLocation="placepage"
                        />
                      );
                    if (singlePost.type === "EVENT")
                      return (
                        <MemoizedEventCard
                          className="md:shadow-none md:rounded-none md:border-b"
                          isSmall={true}
                          {...singlePost}
                        />
                      );
                    return (
                      <MemoizedPostCard
                        className="md:shadow-none md:rounded-none md:border-b"
                        isSmall={true}
                        key={singlePost.postid}
                        {...singlePost}
                      />
                    );
                  });
                })
              ) : (
                <p className="py-4 font-medium text-center">No Posts</p>
              )}
              <LoadMoreButton
                onClick={() => activePlaceFeedResponse.fetchNextPage()}
                isFetchingNextPage={activePlaceFeedResponse.isFetchingNextPage}
                hasNextPage={activePlaceFeedResponse.hasNextPage}
              />
            </TabsContent>
            <TabsContent value="events">
              {activePlaceEventsResponse.status === "pending" ? (
                <Loader />
              ) : activePlaceEventsResponse.data ? (
                activePlaceEventsResponse.data.pages.map((page, index) => {
                  const events = eventsMapper(page.data);
                  if (events.length === 0 && index === 0)
                    return (
                      <p className="py-4 font-medium text-center">No Events</p>
                    );
                  return events.map((event: TEVENT) => {
                    return (
                      <MemoizedEventCard
                        className="md:shadow-none md:rounded-none md:border-b"
                        key={event.id}
                        isSmall={true}
                        {...event}
                      />
                    );
                  });
                })
              ) : (
                <p className="py-4 font-medium text-center">No Events</p>
              )}
              <LoadMoreButton
                onClick={() => activePlaceEventsResponse.fetchNextPage()}
                isFetchingNextPage={
                  activePlaceEventsResponse.isFetchingNextPage
                }
                hasNextPage={activePlaceEventsResponse.hasNextPage}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <div className="p-4 pt-6 border-b">
            <Link
              target="_blank"
              href={`/group/${activePolygon.dominantGroup.slug}`}
              className="flex items-center gap-2"
            >
              <Image
                style={{
                  border: `2px solid ${activePolygon.dominantGroup.strokeColorHex}`,
                }}
                src={"groupPictures/" + activePolygon.dominantGroup.imageName}
                alt={activePolygon.dominantGroup.name}
                height={100}
                width={100}
                priority
                className="rounded-full h-10 w-10 object-cover"
              />
              <p
                className={cn(
                  "font-semibold text-lg",
                  activePolygon.dominantGroup.name.length > 30 ? "text-sm" : "",
                )}
              >
                {activePolygon.dominantGroup.name}
              </p>
            </Link>
            <Truncatedtext limit={100} className="text-sm mt-4 leading-tight">
              {activePolygon.dominantGroup.description}
            </Truncatedtext>
          </div>
          <Tabs defaultValue="feeds" className="flex-1 h-full flex flex-col">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger
                className="py-2 border-b-transparent text-base border-b-2 data-[state=active]:border-black rounded-none font-bold"
                value="feeds"
              >
                Feed
              </TabsTrigger>
              <TabsTrigger
                className="py-2 border-b-transparent text-base border-b-2 data-[state=active]:border-black rounded-none font-bold"
                value="events"
              >
                {dictionary.common.events}
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="feeds"
              className="flex-1 thin-scrollbar overflow-y-auto space-y-2 pb-[200px]"
            >
              {activeGroupFeedResponse.status === "pending" ? (
                <Loader />
              ) : activeGroupFeedResponse.data ? (
                activeGroupFeedResponse.data.pages.map((page, index) => {
                  const posts = postsMapper(page);
                  if (posts.length === 0 && index === 0)
                    return (
                      <p className="py-4 font-medium text-center">No Posts</p>
                    );
                  return posts.map((singlePost: any) => {
                    if (singlePost.type === "CHECKIN")
                      return (
                        <MemoizedCheckinSlider
                          className="md:shadow-none md:rounded-none md:border-b"
                          isSmall={true}
                          key={singlePost.checkins[0].postid}
                          checkins={singlePost.checkins}
                        />
                      );
                    if (singlePost.type === "EVENT")
                      return (
                        <MemoizedEventCard
                          className="md:shadow-none md:rounded-none md:border-b"
                          isSmall={true}
                          {...singlePost}
                        />
                      );
                    return (
                      <MemoizedPostCard
                        className="md:shadow-none md:rounded-none md:border-b"
                        isSmall={true}
                        key={singlePost.postid}
                        {...singlePost}
                      />
                    );
                  });
                })
              ) : (
                <p className="py-4 font-medium text-center">No Posts</p>
              )}
              <LoadMoreButton
                onClick={() => activeGroupFeedResponse.fetchNextPage()}
                isFetchingNextPage={activeGroupFeedResponse.isFetchingNextPage}
                hasNextPage={activeGroupFeedResponse.hasNextPage}
              />
            </TabsContent>
            <TabsContent value="events">
              {activeGroupEventsResponse.status === "pending" ? (
                <Loader />
              ) : activeGroupEventsResponse.data ? (
                activeGroupEventsResponse.data.pages.map((page, index) => {
                  const events = eventsMapper(page.data);
                  if (events.length === 0 && index === 0)
                    return (
                      <p className="py-4 font-medium text-center">No Events</p>
                    );

                  return events.map((event: TEVENT) => {
                    return (
                      <MemoizedEventCard
                        className="md:shadow-none md:rounded-none md:border-b"
                        key={event.id}
                        isSmall={true}
                        {...event}
                      />
                    );
                  });
                })
              ) : (
                <p className="py-4 font-medium text-center">No Events</p>
              )}
              <LoadMoreButton
                onClick={() => activeGroupEventsResponse.fetchNextPage()}
                isFetchingNextPage={
                  activeGroupEventsResponse.isFetchingNextPage
                }
                hasNextPage={activeGroupEventsResponse.hasNextPage}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
