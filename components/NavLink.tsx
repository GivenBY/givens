import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NavLink = ({
  href,
  label,
  isSignedIn,
}: {
  href: string;
  label: string;
  isSignedIn: boolean | undefined;
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!isSignedIn) {
      e.preventDefault();
      toast.warning(`Please sign in to access ${label}`);
    } else {
      router.push(href);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
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
