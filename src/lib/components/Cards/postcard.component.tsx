"use client";
import React, { useState } from "react";
import {
  AudioPlayer,
  TruncatedText,
  Typography,
  Video,
  Image,
  AttendeeButton,
  CommentButton,
  Popup,
  LinkPreviewer,
  TextWithClickableLink,
  Imageslider,
} from "..";
import { TPOST } from "@/lib/ts";
import Link from "next/link";
import { cn, formatTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { default as DefaultUserImage } from "@public/default/user.svg";
import { default as DImage } from "next/image";
import { IoMdPin } from "react-icons/io";
import { extractLinks } from "@/lib/utils";

interface PROPS extends TPOST {
  children?: React.ReactNode;
  singlePostPage?: boolean;
  className?: string;
  isSmall?: boolean;
}

const Postcard: React.FC<PROPS> = ({
  postid,
  userid,
  userslug,
  placeslug,
  groupslug,
  username,
  userProviderImageUrl,
  userprofile,
  type,
  caption,
  mediaSrc,
  time,
  commentsCount,
  attendeesCount,
  postedAsUser = true,
  groupid,
  groupname = "",
  groupprofile = "",
  groupcolor,
  placeid,
  placename,
  children,
  singlePostPage = false,
  className,
  isSmall,
}) => {
  const [ModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const router = useRouter();
  const links = extractLinks(caption ? caption : "");
  const linkTarget = isSmall ? "_blank" : "-self";

  const goToSinglePostPage = () => {
    router.push(`/post/${postid}`);
  };

  if (!["TEXT", "AUDIO", "VIDEO", "IMAGE"].includes(type)) return;
  return (
    <article
      className={cn(
        singlePostPage
          ? "md:rounded-t-xl "
          : "md:shadow-moreblurred md:rounded-xl ",
        "bg-white w-full mx-auto border-b md:border-b-0",
        className ? className : "",
        isSmall ? "" : "md:w-[611px]",
      )}
    >
      <div className={cn("p-4", isSmall ? "space-y-2" : "md:p-7 space-y-4")}>
        <div className={cn("flex", isSmall ? "gap-2" : "gap-4")}>
          <Link
            target={linkTarget}
            className="hover:underline"
            href={postedAsUser ? `/user/${userslug}` : `/group/${groupslug}`}
          >
            {postedAsUser ? (
              userprofile ? (
                <Image
                  priority
                  height={60}
                  width={60}
                  className={cn(
                    isSmall
                      ? "h-[40px] w-[40px]"
                      : "h-[50px] w-[50px] md:h-[60px] md:w-[60px]",
                    " object-cover rounded-full",
                  )}
                  src={`profilePictures/${userprofile}`}
                  alt={`profile-picture of ${username}`}
                />
              ) : (
                <DImage
                  height={60}
                  width={60}
                  priority
                  className={cn(
                    isSmall
                      ? "h-[40px] w-[40px] min-h-[40px] min-w-[40px]"
                      : "h-[50px] w-[50px] md:h-[60px] md:w-[60px]",
                    " object-cover rounded-full",
                  )}
                  src={
                    userProviderImageUrl
                      ? userProviderImageUrl
                      : DefaultUserImage
                  }
                  alt={`profile-picture of ${username}`}
                />
              )
            ) : (
              <Image
                style={{
                  border: `3px solid ${groupcolor}`,
                }}
                priority
                height={60}
                width={60}
                className={cn(
                  isSmall
                    ? "h-[40px] w-[40px] min-h-[40px] min-w-[40px]"
                    : "h-[50px] w-[50px] md:h-[60px] md:w-[60px]",
                  " object-cover rounded-full",
                )}
                src={`groupPictures/${groupprofile}`}
                alt={`profile-picture of ${groupname}`}
              />
            )}
          </Link>
          <div>
            <Link
              target={linkTarget}
              className="hover:underline"
              href={postedAsUser ? `/user/${userslug}` : `/group/${groupslug}`}
            >
              <h2
                className={cn(
                  "text-base font-bold",
                  isSmall
                    ? (postedAsUser ? username : groupname).length > 30
                      ? "text-xs"
                      : ""
                    : "md:text-2xl",
                )}
              >
                {postedAsUser ? username : groupname}
              </h2>
            </Link>
            <div
              className={cn(
                "flex items-center flex-wrap",
                isSmall ? "gap-1 flex-nowrap" : "gap-4",
              )}
            >
              <Typography
                className={cn(
                  "text-xs",
                  isSmall ? "whitespace-nowrap" : "md:text-base",
                )}
              >
                {formatTime(time)}
              </Typography>
              {placeslug && placename && (
                <Link
                  target={linkTarget}
                  href={`/place/${placeslug}`}
                  className={cn(
                    "flex items-center gap-1 text-[#707070]",
                    isSmall ? "" : "",
                  )}
                >
                  <IoMdPin />
                  <Typography
                    className={cn(
                      "text-xs hover:underline",
                      isSmall ? "w-24 truncate" : "md:text-base",
                    )}
                  >
                    {placename}
                  </Typography>
                </Link>
              )}
            </div>
          </div>
        </div>
        {caption && (
          <div
            className={cn(
              "text-[#707070] text-[14px]",
              isSmall ? "" : "md:text-[18px]",
            )}
          >
            {caption.length > 130 ? (
              <TruncatedText
                limit={130}
                className={cn("text-[14px]", isSmall ? "" : "md:text-[18px]")}
              >
                {caption}
              </TruncatedText>
            ) : (
              <TextWithClickableLink text={caption} />
            )}
            {links && links.length !== 0 && links[0] && type === "TEXT" && (
              <LinkPreviewer link={links[0]} />
            )}
          </div>
        )}
      </div>
      {type === "IMAGE" &&
        (mediaSrc && mediaSrc.length > 1 ? (
          <Imageslider images={mediaSrc} onClick={handleOpen} />
        ) : (
          <div
            className={cn(
              "w-full bg-black hover:cursor-pointer",
              isSmall ? "aspect-[611/440]" : "h-[440px]",
            )}
            onClick={handleOpen}
          >
            <Image
              className="w-full h-full object-contain"
              src={mediaSrc ? mediaSrc[0] : ""}
              alt="post-image"
              width={611}
              height={440}
              priority
            />
          </div>
        ))}
      {type === "VIDEO" && (
        <div
          className={cn(
            "w-full bg-black hover:cursor-pointer",
            isSmall ? "aspect-[611/440]" : "h-[440px]",
          )}
          onClick={handleOpen}
        >
          <Video
            controls
            className="h-full w-full object-contain"
            width={611}
            height={440}
            src={mediaSrc ? mediaSrc[0] : ""}
            onClick={(e) => e.preventDefault()}
          />
        </div>
      )}
      <Popup
        ModalOpen={ModalOpen}
        setModalOpen={setModalOpen}
        showCloseIcon={true}
      >
        <article className="border-0 focus:border-0 focus:outline-none">
          {type === "IMAGE" &&
            (mediaSrc && mediaSrc.length > 1 ? (
              <Imageslider images={mediaSrc} popup={true} />
            ) : (
              <div className="h-[90vh] w-[90vw] bg-black">
                <Image
                  priority
                  className="w-full h-full object-contain"
                  src={mediaSrc ? mediaSrc[0] : ""}
                  alt="post-image"
                  width={611}
                  height={440}
                />
              </div>
            ))}
          {type === "VIDEO" && (
            <div className="h-[90vh] w-[90vw] bg-black">
              <Video
                controls
                className="h-full w-full object-contain"
                width={611}
                height={440}
                src={mediaSrc ? mediaSrc[0] : ""}
                autoPlay
              />
            </div>
          )}
        </article>
      </Popup>

      {type === "AUDIO" && (
        <AudioPlayer id={postid} src={mediaSrc ? mediaSrc[0] : ""} />
      )}

      <div
        className={cn(
          "p-4 flex items-center justify-between",
          isSmall ? "" : "md:p-7",
        )}
      >
        <div className={cn("flex", isSmall ? "gap-4" : "gap-8 md:gap-14")}>
          {singlePostPage ? (
            <>
              <AttendeeButton count={attendeesCount} />
              <CommentButton count={commentsCount} />
            </>
          ) : (
            <>
              <AttendeeButton
                iconClassName={isSmall ? "md:h-[15px] md:w-auto" : ""}
                textClassName={isSmall ? "md:text-xs" : ""}
                count={attendeesCount}
                singlePostLink={`/post/${postid}`}
              />
              <CommentButton
                iconClassName={isSmall ? "md:h-[20px] md:w-auto" : ""}
                textClassName={isSmall ? "md:text-xs" : ""}
                count={commentsCount}
                singlePostLink={`/post/${postid}`}
              />
            </>
          )}
        </div>
        {!postedAsUser && (
          <Link
            target={linkTarget}
            href={`/user/${userslug}`}
            className="hover:underline flex items-center gap-2"
          >
            {userprofile ? (
              <Image
                priority
                height={40}
                width={40}
                className={cn(
                  "object-cover rounded-full",
                  isSmall
                    ? "h-[20px] w-[20px]"
                    : "h-[30px] w-[30px] md:h-[40px] md:w-[40px] ",
                )}
                src={`profilePictures/${userprofile}`}
                alt={`profile picture of ${username}`}
              />
            ) : (
              <DImage
                priority
                height={40}
                width={40}
                className={cn(
                  " object-cover rounded-full",
                  isSmall
                    ? "h-[20px] w-[20px]"
                    : "h-[30px] w-[30px] md:h-[40px] md:w-[40px]",
                )}
                src={
                  userProviderImageUrl ? userProviderImageUrl : DefaultUserImage
                }
                alt={`profile picture of ${username}`}
              />
            )}

            <span
              className={cn(
                "font-bold text-[#919191] text-xs",
                isSmall ? "" : "md:text-base",
              )}
            >
              {username}
            </span>
          </Link>
        )}
      </div>
      {children}
    </article>
  );
};

export default Postcard;
