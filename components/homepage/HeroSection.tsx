import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="container mx-auto flex flex-col items-center justify-center px-4 py-10 text-center md:py-28">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">
        Save Smarter <br />
        <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Together with KOSH
        </span>
      </h1>
      
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
        Your hub for smart savings — build goals, track progress, and grow.
      </p>
      
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link href="/register">
          <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Learn More
          </Button>
        </Link>
      </div>
    </section>
  );
}