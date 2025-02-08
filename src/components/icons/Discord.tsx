
import { SVGProps } from "react";

const Discord = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8.5 12C8.5 12.5523 8.05228 13 7.5 13C6.94772 13 6.5 12.5523 6.5 12C6.5 11.4477 6.94772 11 7.5 11C8.05228 11 8.5 11.4477 8.5 12Z" />
    <path d="M16.5 12C16.5 12.5523 16.0523 13 15.5 13C14.9477 13 14.5 12.5523 14.5 12C14.5 11.4477 14.9477 11 15.5 11C16.0523 11 16.5 11.4477 16.5 12Z" />
    <path d="M20 7V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7Z" />
    <path d="M12 18V21" />
    <path d="M8 21H16" />
  </svg>
);

export default Discord;
