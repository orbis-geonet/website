"use client";
import { Rating as StarRating } from "@mui/material";
import React from "react";

type PROPS = {
  value: number;
};

const Rating: React.FC<PROPS> = ({ value }) => {
  return (
    <StarRating
      name="Star Rating"
      defaultValue={value}
      precision={0.5}
      readOnly
    />
  );
};

export default Rating;
