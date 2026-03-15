import {
  SidebarInset,
  SidebarManagerProvider,
  SidebarProvider,
} from '@packages/ui/components/sidebar';
import type * as React from 'react';
import { useEffect } from 'react';
import { GlobalContextPanel } from '@web/features/context-panel/context-panel';
import { toggleContextPanel } from '@web/features/context-panel/use-context-panel';
import { AppSidebar } from '@web/layout/dashboard/app-sidebar';

function useContextPanelHotkey() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleContextPanel();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  useContextPanelHotkey();

  return (
    <SidebarManagerProvider>
      <SidebarProvider className="flex-1">
        <AppSidebar />
        <SidebarInset className="flex flex-col overflow-hidden">
          <main className="relative flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </SidebarInset>
        <GlobalContextPanel />
      </SidebarProvider>
    </SidebarManagerProvider>
  );
}
