import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LogoComponent from "./LogoComponent";

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-slate-50 to-white border-t">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <LogoComponent />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering your financial future with smart, AI-driven savings tools and intelligent insights.
            </p>
            <div className="flex gap-3">
              {[Github, Linkedin, Twitter, Mail].map((Icon, index) => (
                <Link 
                  key={index}
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent rounded-md"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {[
            {
              title: "Product",
              links: ["Features", "Security", "Pricing", "API"]
            },
            {
              title: "Company", 
              links: ["About Us", "Careers", "Contact", "Press"]
            },
            {
              title: "Resources",
              links: ["Blog", "Help Center", "Terms", "Privacy"]
            }
          ].map((section, index) => (
            <div key={index} className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
              <div className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <Link 
                    key={link}
                    href="#" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} KOSH-Lite. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}