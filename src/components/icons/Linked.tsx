
import { SVGProps } from "react";

const Linked = (props: SVGProps<SVGSVGElement>) => (
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
    <rect x="2" y="2" width="20" height="20" rx="3" />
    <path d="M8 10v8" />
    <path d="M8 6.5v.5" />
    <path d="M16 16v-4" />
    <path d="M16 10c0-1-1-2-2-2s-2 1-2 2v2h4" />
  </svg>
);

export default Linked;
