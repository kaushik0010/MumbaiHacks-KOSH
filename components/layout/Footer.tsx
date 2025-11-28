import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LogoComponent from "./LogoComponent";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <LogoComponent />
            <p className="text-sm text-muted-foreground">
              Empowering your financial future with smart, AI-driven savings tools.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Product</h4>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">Features</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">Security</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">Pricing</Link>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Company</h4>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">About Us</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">Careers</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">Contact</Link>
          </div>

          {/* Column 4: Resources */}
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Resources</h4>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">Blog</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">Help Center</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">Terms of Service</Link>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KOSH-Lite. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}