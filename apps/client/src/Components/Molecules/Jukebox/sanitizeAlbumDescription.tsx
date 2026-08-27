import { Link } from "@mui/material";
import DOMPurify from "dompurify";
import parse, { DOMNode, domToReact, Element } from "html-react-parser";
import { ReactNode } from "react";

/**
 * Subsonic album descriptions may contain simple markup (e.g. links to
 * artist/album pages). Only allow <a href> and strip everything else to
 * avoid rendering unsafe HTML, then parse the sanitized string into real
 * React elements so <a> can be rendered as MUI's Link.
 */
export const sanitizeAlbumDescription = (description: string): ReactNode => {
    const sanitizedDescription = description
        ? DOMPurify.sanitize(description, {
              ALLOWED_TAGS: ["a"],
              ALLOWED_ATTR: ["href"],
          })
        : "";

    if (!sanitizedDescription) {
        return null;
    }

    return parse(sanitizedDescription, {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === "a") {
                return (
                    <Link
                        href={domNode.attribs.href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {domToReact(domNode.children as DOMNode[])}
                    </Link>
                );
            }
            return undefined;
        },
    });
};
