import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

// Opens in a new tab. mailto: links stay in the same tab.
export function ExternalLink({ href, children, className = "" }: ExternalLinkProps) {
  const isMail = href.startsWith("mailto:");
  return (
    <a
      href={href}
      className={className}
      {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}
