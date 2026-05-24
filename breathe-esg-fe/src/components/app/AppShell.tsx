import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar, AppSidebarContent } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="h-full w-[min(280px,88vw)] max-w-[280px] border-sidebar-border bg-sidebar p-0 sm:max-w-[280px]"
        >
          <AppSidebarContent onNavClick={() => setMobileNavOpen(false)} showToggle={false} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar onMenuOpen={() => setMobileNavOpen(true)} />
        <main className="min-w-0 flex-1">
          <div className="fade-up mx-auto w-full min-w-0 max-w-[1400px] px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
