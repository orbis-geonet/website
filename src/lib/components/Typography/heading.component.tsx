import React from "react";

type PROPS = {
  //Type of heading either it is h1, h2,h3 or so on
  type?: string;
  children: React.ReactNode;
  className?: string;
};

const Heading: React.FC<PROPS> = ({ type, children, className = "" }) => {
  switch (type) {
    case "h1":
      return (
        <h1
          className={`italic font-[900] text-2xl md:text-5xl md:leading-[60px] tracking-wide ${className}`}
        >
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2
          className={`italic font-[900] text-4xl leading-[50px] tracking-wide ${className}`}
        >
          {children}
        </h2>
      );
    case "h3":
      return (
        <h2
          className={`italic font-[900] text-3xl leading-[40px] tracking-wide ${className}`}
        >
          {children}
        </h2>
      );
    case "h4":
      return (
        <h4
          className={`italic font-[900] text-base md:text-xl md:leading-[40px] tracking-wide ${className}`}
        >
          {children}
        </h4>
      );
    default:
      return (
        <h1
          className={`italic font-[900] text-2xl md:text-5xl md:leading-[60px] tracking-wide ${className}`}
        >
          {children}
        </h1>
      );
  }
};

export default Heading;
