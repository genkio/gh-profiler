import React from "react";
import manifestJson from "../manifest.json";
import { IRatelimit } from "./typings";

interface IProps {
  ratelimit: IRatelimit;
}

export const Footer: React.FC<IProps> = ({ ratelimit: { remaining } }) => (
  <footer className="p-1 text-xs text-gray-400 italic flex justify-between">
    {remaining <= 10 ? (
      <span>Remaining requests: {remaining}</span>
    ) : (
      <span></span>
    )}
    <span className="pr-1">v{manifestJson.version}</span>
  </footer>
);
