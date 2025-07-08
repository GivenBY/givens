import { cn } from "@/lib/utils";
import Link from "next/link";

const NavLink = ({
  href,
  label,
  isSignedIn,
}: {
  href: string;
  label: string;
  isSignedIn: boolean | undefined;
}) => {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "transition-colors",
        isSignedIn
          ? "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          : "text-gray-400 hover:text-gray-500 cursor-pointer"
      )}
    >
      {label}
    </Link>
  );
};

export default NavLink;
