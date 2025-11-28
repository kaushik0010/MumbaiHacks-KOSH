import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "Groups", href: "/groups" },
  { name: "About", href: "#" },
  { name: "FAQs", href: "#" },
];

interface NavigationComponentProps {
  className?: string;
}

export default function NavigationComponent({ className }: NavigationComponentProps) {
  return (
    <nav className={cn("flex gap-6", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}