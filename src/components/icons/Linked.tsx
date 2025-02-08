
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
    <path d="M16 16L22 22" />
    <path d="M2 2L8 8" />
    <path d="M22 2L16 8" />
    <path d="M8 16L2 22" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9V3" />
    <path d="M12 21V15" />
    <path d="M9 12H3" />
    <path d="M21 12H15" />
  </svg>
);

export default Linked;

