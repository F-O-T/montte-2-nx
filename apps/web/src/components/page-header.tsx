import { SidebarTrigger } from "@packages/ui/components/sidebar";
import { cn } from "@packages/ui/lib/utils";
import { useStore } from "@tanstack/react-store";
import type { ReactNode } from "react";
import { contextPanelStore } from "@/features/context-panel/context-panel-store";
import { ContextPanelHeaderActions } from "@/features/context-panel/context-panel-header-actions";

export interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  const isOpen = useStore(contextPanelStore, (s) => s.isOpen);

  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="flex sm:hidden items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold font-serif leading-tight flex-1 truncate text-lg">
          {title}
        </h1>
        {actions}
        {!isOpen && <ContextPanelHeaderActions />}
      </div>

      <div className="hidden sm:flex items-center min-w-0 flex-1 max-w-2xl gap-3">
        <SidebarTrigger />
        <div className={cn("flex flex-col min-w-0", description && "gap-1.5")}>
          <h1 className="text-2xl font-semibold font-serif leading-tight">
            {title}
          </h1>
          {description != null && (
            <p className="text-base text-muted-foreground font-sans leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        {actions}
        {!isOpen && <ContextPanelHeaderActions />}
      </div>
    </header>
  );
}
