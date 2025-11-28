import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader
} from "@/components/ui/sheet";
import LogoComponent from "./LogoComponent";
import NavigationComponent from "./NavigationComponent";
import AuthButtons from "./AuthButtons";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <LogoComponent />

        {/* Center: Desktop Nav */}
        <div className="hidden md:block">
          <NavigationComponent />
        </div>

        {/* Right: Desktop Auth */}
        <div className="hidden md:block">
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
               <SheetHeader>
                <SheetTitle className="text-left"><LogoComponent /></SheetTitle>
                <SheetDescription className="sr-only">Mobile Navigation</SheetDescription>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                <NavigationComponent className="flex-col gap-4" />
                <AuthButtons isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}