"use client";

import { AvatarIcon } from "@radix-ui/react-icons";
import { Camera } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import React from "react";
import { ThemeToggle } from "./homepage/theme-toggle";
import { useRouter } from "next/navigation";
import ClientSideCredits from "./realtime/ClientSideCredits";

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
const packsIsEnabled = process.env.NEXT_PUBLIC_TUNE_TYPE === "packs";

interface NavbarProps {
  user: any;
  credits: any;
}

export default function Navbar({ user, credits }: NavbarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Camera className="h-5 w-5 text-primary" />
          <span>Humble</span>
        </Link>
        
        {user && (
          <nav className="hidden md:flex gap-6">
            <Link href="/overview" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            {packsIsEnabled && (
              <Link href="/overview/packs" className="text-sm font-medium hover:text-primary transition-colors">
                Packs
              </Link>
            )}
            {stripeIsConfigured && (
              <Link href="/get-credits" className="text-sm font-medium hover:text-primary transition-colors">
                Get Credits
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {!user && (
            <>
              <Link href="/auth/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/auth/login">
                <Button>Create headshots</Button>
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-4">
              {stripeIsConfigured && (
                <ClientSideCredits creditsRow={credits ? credits : null} />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <AvatarIcon className="h-6 w-6 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-[101]">
                  <DropdownMenuLabel className="text-primary text-center overflow-hidden text-ellipsis">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <form action="/auth/sign-out" method="post">
                    <Button
                      type="submit"
                      className="w-full text-left"
                      variant="ghost"
                    >
                      Log out
                    </Button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
