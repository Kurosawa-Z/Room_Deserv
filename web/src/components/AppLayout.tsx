import React from "react";
import Header from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
  fullBleed?: boolean;
  hideFooter?: boolean;
}

export const AppLayout = ({
  children,
  fullBleed = false,
  hideFooter = false,
}: AppLayoutProps) => {
  // Layout wrapper for all routes

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden app-bg-background app-text-foreground">
      {/* Global header */}
      <Header />

      {/* Body + Footer grouped */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Main content */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0">
          <div className={fullBleed ? "flex-1 min-w-0" : "flex-1 min-w-0"}>
            {children}
          </div>
        </main>

        {/* Footer */}
        {!hideFooter && (
          <footer className="border-t app-bg-background">
            <div className="mx-auto max-w-6xl px-6 py-4 text-sm opacity-80">
              © {new Date().getFullYear()} Room-Deserv
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default AppLayout;
