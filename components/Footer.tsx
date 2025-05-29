"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Only show footer on get-credits page and root homepage (logged out state)
  const shouldShowFooter = pathname === '/get-credits' || pathname === '/';
  
  if (!shouldShowFooter) {
    return null;
  }

  return (
    <footer className="border-t border-border py-12 md:py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
              <Camera className="h-5 w-5 text-primary" />
              <span>Humble</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional AI-generated headshots for your online presence.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#examples" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Examples
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Humble. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
