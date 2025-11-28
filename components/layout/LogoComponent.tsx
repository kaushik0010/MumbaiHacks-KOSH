import Link from "next/link";

export default function LogoComponent() {
  return (
    <Link href="/" className="text-2xl font-bold bg-linear-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent">
      KOSH
    </Link>
  );
}