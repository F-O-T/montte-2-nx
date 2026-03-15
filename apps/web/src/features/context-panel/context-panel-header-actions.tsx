import { Button } from '@packages/ui/components/button';
import { Kbd, KbdGroup } from '@packages/ui/components/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@packages/ui/components/tooltip';
import { PanelRight } from 'lucide-react';
import {
  openContextPanel,
  setActiveTab,
} from '@web/features/context-panel/use-context-panel';

export function ContextPanelHeaderActions() {
  const handleOpenPanel = () => {
    setActiveTab('info');
    openContextPanel();
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button onClick={handleOpenPanel} type="button" variant="outline">
              <PanelRight className="size-4" />
            </Button>
          }
        />
        <TooltipContent>
          <span className="flex items-center gap-2">
            Open panel
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>I</Kbd>
            </KbdGroup>
          </span>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
