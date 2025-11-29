"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "Groups", href: "/groups" },
  { name: "About", href: "/about" },
  { name: "FAQs", href: "/faqs" },
];

interface NavigationComponentProps {
  className?: string;
}

export default function NavigationComponent({ className }: NavigationComponentProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex gap-1", className)}>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
              isActive
                ? "text-blue-600 bg-blue-50 font-semibold"
                : "text-muted-foreground hover:text-primary hover:bg-accent"
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}