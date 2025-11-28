"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AuthButtonsProps {
  isMobile?: boolean;
}

export default function AuthButtons({ isMobile = false }: AuthButtonsProps) {
  const { data: session } = useSession();

  if (session) {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2 mt-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="w-full justify-start">Profile</Button>
          </Link>
          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer h-9 w-9">
            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
            <AvatarFallback>{session.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", isMobile && "flex-col mt-4 w-full")}>
      <Link href="/login" className={cn(isMobile && "w-full")}>
        <Button variant="ghost" className={cn(isMobile && "w-full")}>Log in</Button>
      </Link>
      <Link href="/register" className={cn(isMobile && "w-full")}>
        <Button className={cn(isMobile && "w-full")}>Sign up</Button>
      </Link>
    </div>
  );
}