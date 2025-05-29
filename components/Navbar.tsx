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
import { useRouter, usePathname } from "next/navigation";
import ClientSideCredits from "./realtime/ClientSideCredits";

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
const packsIsEnabled = process.env.NEXT_PUBLIC_TUNE_TYPE === "packs";

interface NavbarProps {
  user: any;
  credits: any;
}

export default function Navbar({ user, credits }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're on a design page to use compact layout
  const isDesignPage = pathname?.includes('/design/');
  
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/80 dark:backdrop-blur-xl dark:border-border">
      <div className={`container flex ${isDesignPage ? 'h-10' : 'h-16'} items-center justify-between`}>
        <Link 
          href="/designer-instances" 
          className={`flex items-center gap-2 font-bold ${isDesignPage ? 'text-base' : 'text-xl'} text-foreground`}
          prefetch={true}
        >
          <Camera className={`${isDesignPage ? 'h-4 w-4' : 'h-5 w-5'} text-primary`} />
          <span>Humble</span>
        </Link>
        
        {user && !isDesignPage && (
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/designer-instances" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              prefetch={true}
            >
              Designers
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {!isDesignPage && <ThemeToggle />}
          
          {!user && (
            <>
              <Link 
                href="/auth/login" 
                className="hidden sm:block text-sm font-medium text-foreground hover:text-primary transition-colors"
                prefetch={true}
              >
                Login
              </Link>
              <Link href="/auth/login" prefetch={true}>
                <Button>Create headshots</Button>
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-4">
              {stripeIsConfigured && !isDesignPage && (
                <ClientSideCredits creditsRow={credits ? credits : null} />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={`${isDesignPage ? 'h-6 w-6' : 'h-8 w-8'} p-0`}>
                    <AvatarIcon className={`${isDesignPage ? 'h-4 w-4' : 'h-6 w-6'} text-primary`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-[101] bg-popover border-border">
                  <DropdownMenuLabel className="text-primary text-center overflow-hidden text-ellipsis">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  {isDesignPage && (
                    <>
                      <Link href="/designer-instances">
                        <Button
                          className="w-full text-left text-foreground justify-start"
                          variant="ghost"
                        >
                          ← Back to Designers
                        </Button>
                      </Link>
                      <DropdownMenuSeparator className="bg-border" />
                    </>
                  )}
                  <form action="/auth/sign-out" method="post">
                    <Button
                      type="submit"
                      className="w-full text-left text-foreground"
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
