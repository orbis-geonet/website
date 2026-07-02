import { cn } from "@/lib/utils";
import Link from "next/link";

type BUTTONPROPS = {
  icon: React.ReactElement<SVGElement>;
  count: number;
  selected?: boolean;
  singlePostLink?: string;
  onClick?: () => void;
  textClassName?: string;
};

const CommentIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn(
        "h-[25px] md:h-[32px] md:w-[32.784px]",
        className ? className : "",
      )}
      data-name="Grupo 9419"
      xmlns="http://www.w3.org/2000/svg"
      width="32.784"
      height="32"
      viewBox="0 0 32.784 32"
    >
      <g data-name="Grupo 15">
        <path
          data-name="Caminho 3"
          d="M16.392 0C7.308 0 0 6.441 0 14.369A13.883 13.883 0 0 0 6.079 25.6l.255 5.371c.048 1 .737 1.328 1.538.731l4.422-3.295a16.581 16.581 0 0 0 4.1.413c9.084 0 16.392-6.441 16.392-14.369S25.476 0 16.392 0z"
          style={{ fill: "inherit" }}
        />
      </g>
    </svg>
  );
};

const ConfirmedIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn(
        "h-[20px] md:h-[32.858px] md:w-[25.514px]",
        className ? className : "",
      )}
      xmlns="http://www.w3.org/2000/svg"
      width="32.858"
      height="25.514"
      viewBox="0 0 32.858 25.514"
    >
      <path
        d="M12.582 25.428a1.677 1.677 0 0 1-2.372 0L.737 15.954a2.515 2.515 0 0 1 0-3.558l1.186-1.186a2.516 2.516 0 0 1 3.559 0l5.918 5.914 15.98-15.98a2.516 2.516 0 0 1 3.559 0l1.182 1.186a2.515 2.515 0 0 1 0 3.558zm0 0"
        transform="translate(0 -.406)"
        style={{ fill: "inherit" }}
      />
    </svg>
  );
};

const ActionButton: React.FC<BUTTONPROPS> = ({
  icon,
  count,
  singlePostLink,
  selected = false,
  onClick,
  textClassName,
}) => {
  return (
    <>
      {singlePostLink ? (
        <Link
          href={singlePostLink}
          className={`flex items-center gap-2 md:gap-3 cursor-pointer ${
            selected
              ? "fill-[#232323] text-[#232323]"
              : "fill-[#d2d2d2] text-[#d2d2d2]"
          }`}
        >
          {icon}
          <span
            className={cn(
              "font-bold text-xs md:text-xl",
              textClassName ? textClassName : "",
            )}
          >
            {count}
          </span>
        </Link>
      ) : onClick ? (
        <button
          onClick={onClick}
          className={`flex items-center gap-2 md:gap-3 relative z-[12] ${
            selected
              ? "fill-[#232323] text-[#232323]"
              : "fill-[#d2d2d2] text-[#d2d2d2]"
          }`}
        >
          {icon}
          <span
            className={cn(
              "font-bold text-xs md:text-xl",
              textClassName ? textClassName : "",
            )}
          >
            {count}
          </span>
        </button>
      ) : (
        <div
          className={`flex items-center gap-2 md:gap-3 ${
            selected
              ? "fill-[#232323] text-[#232323]"
              : "fill-[#d2d2d2] text-[#d2d2d2]"
          }`}
        >
          {icon}
          <span
            className={cn(
              "font-bold text-xs md:text-xl",
              textClassName ? textClassName : "",
            )}
          >
            {count}
          </span>
        </div>
      )}
    </>
  );
};

type CUSTOMBUTTONPROPS = {
  count: number;
  singlePostLink?: string;
  onClick?: () => void;
  iconClassName?: string;
  textClassName?: string;
};

export const AttendeeButton = ({
  count,
  singlePostLink,
  onClick,
  iconClassName,
  textClassName,
}: CUSTOMBUTTONPROPS) => {
  return (
    <ActionButton
      icon={<ConfirmedIcon className={iconClassName} />}
      count={count}
      singlePostLink={singlePostLink}
      onClick={onClick}
      textClassName={textClassName}
    />
  );
};

export const CommentButton = ({
  count,
  singlePostLink,
  onClick,
  iconClassName,
  textClassName,
}: CUSTOMBUTTONPROPS) => {
  return (
    <ActionButton
      icon={<CommentIcon className={iconClassName} />}
      count={count}
      singlePostLink={singlePostLink}
      onClick={onClick}
      textClassName={textClassName}
    />
  );
};
