import Link from "next/link";

export default function LogoComponent() {
  return (
    <Link 
      href="/" 
      className="flex items-center gap-2 group"
    >
      <div className="flex items-center justify-center w-8 h-8 bg-linear-to-br from-blue-600 to-blue-400 rounded-lg shadow-sm">
        <span className="text-white font-bold text-sm">K</span>
      </div>
      <span className="text-xl font-bold bg-linear-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-blue-400 transition-all">
        KOSH
      </span>
    </Link>
  );
}