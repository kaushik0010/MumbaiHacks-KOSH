import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import LogoComponent from "./LogoComponent";
import NavigationComponent from "./NavigationComponent";
import AuthButtons from "./AuthButtons";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl">
        <LogoComponent />

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex mx-8">
          <NavigationComponent />
        </div>

        {/* Right: Desktop Auth */}
        <div className="hidden md:flex items-center gap-2">
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <LogoComponent />
                </div>
                <div className="flex-1 flex flex-col gap-6">
                  <NavigationComponent className="flex-col gap-4" />
                  <div className="flex-1" />
                  <AuthButtons isMobile={true} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}