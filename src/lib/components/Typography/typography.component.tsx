import React from "react";

type PROPS = {
  children: React.ReactNode;
  className?: string;
};

const Typography: React.FC<PROPS> = ({ children, className }) => {
  return (
    <p className={`font-sans text-[#707070] ${className ? className : ""}`}>{children}</p>
  );
};

export default Typography;
