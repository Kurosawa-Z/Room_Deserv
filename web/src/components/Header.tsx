import * as React from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="relative w-full border-b bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="text-xl font-bold app-text-foreground">
            Room-Deserv
          </Link>

          <div className="hidden md:block">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/home"
                      className="px-3 py-2 rounded-md app-text-foreground"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/about"
                      className="px-3 py-2 rounded-md app-text-foreground"
                    >
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
      </header>

      {open &&
        createPortal(
          <>
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm overlay-fade-in md:hidden"
            />
            <nav className="fixed right-0 top-0 z-101 h-screen w-64 app-bg-background backdrop-blur border-l shadow-xl panel-slide-in md:hidden">
              <div className="flex items-center justify-between p-3 border-b">
                <span className="text-sm font-semibold app-text-foreground">
                  Menu
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>
              <ul className="flex flex-col gap-2 p-4 app-text-foreground">
                <li>
                  <Link
                    to="/home"
                    className="block w-full rounded-md px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="block w-full rounded-md px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setOpen(false)}
                  >
                    About
                  </Link>
                </li>
              </ul>
            </nav>
          </>,
          document.body
        )}
    </>
  );
}
