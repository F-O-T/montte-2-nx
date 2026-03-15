import { Button } from '@packages/ui/components/button';
import {
  ContextPanel,
  ContextPanelContent,
  ContextPanelHeader,
  ContextPanelTitle,
} from '@packages/ui/components/context-panel';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarManager,
} from '@packages/ui/components/sidebar';
import { cn } from '@packages/ui/lib/utils';
import { useStore } from '@tanstack/react-store';
import { Info, X } from 'lucide-react';
import type React from 'react';
import {
  type ContextPanelTab,
  contextPanelStore,
} from '@web/features/context-panel/context-panel-store';
import {
  closeContextPanel,
  openContextPanel,
  setActiveTab,
} from '@web/features/context-panel/use-context-panel';

function InfoContent() {
  const { infoContent, pageActions } = useStore(contextPanelStore, (s) => s);

  if (!pageActions && !infoContent) {
    return (
      <ContextPanel>
        <ContextPanelContent className="flex items-center justify-center p-6">
          <p className="text-sm text-muted-foreground/50">No information</p>
        </ContextPanelContent>
      </ContextPanel>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto">
      {pageActions && (
        <ContextPanel className="h-auto shrink-0">
          <ContextPanelHeader>
            <ContextPanelTitle>Actions</ContextPanelTitle>
          </ContextPanelHeader>
          <ContextPanelContent className="gap-1">
            {pageActions.map((action) => (
              <Button
                className="w-full justify-start"
                key={action.label}
                onClick={action.onClick}
                type="button"
                variant="ghost"
              >
                <action.icon className="size-4" />
                <span>{action.label}</span>
              </Button>
            ))}
          </ContextPanelContent>
        </ContextPanel>
      )}
      {infoContent && <div className="flex-1 min-h-0">{infoContent}</div>}
    </div>
  );
}

const INFO_TAB: ContextPanelTab = {
  id: 'info',
  icon: Info,
  label: 'Information',
  content: <InfoContent />,
  order: 0,
};

function ContextPanelInner() {
  const { activeTabId, dynamicTabs } = useStore(contextPanelStore, (s) => s);

  const allTabs: ContextPanelTab[] = [
    INFO_TAB,
    ...dynamicTabs.slice().sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
  ];

  const activeTab = allTabs.find((t) => t.id === activeTabId) ?? allTabs[0];

  return (
    <Sidebar
      className="px-0"
      collapsible="offcanvas"
      side="right"
      variant="inset"
    >
      <SidebarHeader className="bg-background rounded-t-xl">
        <div className="flex-row flex items-center gap-2">
          {allTabs.map((tab) => (
            <Button
              className={cn(
                activeTabId === tab.id && 'bg-accent text-accent-foreground',
              )}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              variant="outline"
            >
              <tab.icon className="size-4" />
            </Button>
          ))}
          <div className="flex-1" />
          <Button onClick={closeContextPanel} type="button" variant="outline">
            <X className="size-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="h-full overflow-hidden rounded-b-xl bg-muted">
        {activeTab?.content}
      </SidebarContent>
    </Sidebar>
  );
}

export function GlobalContextPanel() {
  const { isOpen } = useStore(contextPanelStore, (s) => s);

  return (
    <SidebarManager
      name="context-panel"
      onOpenChange={(open) => (open ? openContextPanel() : closeContextPanel())}
      open={isOpen}
      style={{ '--sidebar-width': '28rem' } as React.CSSProperties}
    >
      <ContextPanelInner />
    </SidebarManager>
  );
}
