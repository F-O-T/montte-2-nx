import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@packages/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@packages/ui/components/dropdown-menu';
import { Separator } from '@packages/ui/components/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@packages/ui/components/sidebar';
import { Skeleton } from '@packages/ui/components/skeleton';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import {
  Check,
  ChevronsUpDown,
  Home,
  LogOut,
  Plus,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useTransition } from 'react';
import { authClient } from '@web/lib/auth-client';

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
};

const mainItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, route: '/dashboard' },
];

function NavItemButton({ item }: { item: NavItem }) {
  const { pathname } = useLocation();
  const isActive =
    pathname === item.route || pathname.startsWith(`${item.route}/`);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={item.label}
        render={<Link to={item.route} />}
      >
        <item.icon />
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

const ORG_AVATAR_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
  'bg-pink-600',
  'bg-indigo-600',
];

function getInitials(value: string) {
  if (!value) return '?';
  return value.trim().charAt(0).toUpperCase();
}

function getOrgColor(name: string): string {
  if (!name) return ORG_AVATAR_COLORS[0] ?? '';
  let hash = 0;
  for (const char of name) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  return ORG_AVATAR_COLORS[Math.abs(hash) % ORG_AVATAR_COLORS.length] ?? '';
}

function OrgAvatar({
  name,
  logo,
  size = 'sm',
}: {
  name: string;
  logo?: string | null;
  size?: 'sm' | 'md';
}) {
  const sizeClass = size === 'md' ? 'size-5 rounded-md' : 'size-4 rounded-sm';
  return (
    <Avatar className={`${sizeClass} shrink-0`}>
      <AvatarImage alt={name} src={logo ?? undefined} />
      <AvatarFallback
        className={`${sizeClass} text-[9px] font-bold text-white ${getOrgColor(name)}`}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

function SidebarScopeSwitcherSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="pointer-events-none" size="lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted" />
          <div className="grid flex-1 gap-1">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function SidebarScopeSwitcher() {
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const activeTeamId = (session?.session as Record<string, unknown>)
    ?.activeTeamId as string | undefined;

  type TeamItem = {
    id: string;
    name: string;
    organizationId: string;
    createdAt: Date;
  };
  const activeOrgData = activeOrg as
    | (typeof activeOrg & { teams?: TeamItem[] })
    | null;
  const teams = activeOrgData?.teams ?? [];
  const activeTeam = teams.find((t) => t.id === activeTeamId);

  const handleOrganizationSwitch = useCallback(
    (orgId: string) => {
      if (orgId === activeOrg?.id || isPending) return;
      startTransition(async () => {
        await authClient.organization.setActive({ organizationId: orgId });
      });
    },
    [activeOrg?.id, isPending],
  );

  const handleTeamSwitch = useCallback(
    async (teamId: string) => {
      if (teamId === activeTeamId) return;
      await authClient.organization.setActiveTeam({ teamId });
    },
    [activeTeamId],
  );

  const handleCreateOrganization = useCallback(async () => {
    const name = window.prompt('Organization name');
    if (!name) return;
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    await authClient.organization.create({ name, slug });
  }, []);

  const handleCreateTeam = useCallback(async () => {
    if (!activeOrg?.id) return;
    const name = window.prompt('Team name');
    if (!name) return;
    await authClient.organization.createTeam({
      name,
      organizationId: activeOrg.id,
    });
  }, [activeOrg?.id]);

  if (!session) return <SidebarScopeSwitcherSkeleton />;

  const orgList = organizations ?? [];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="aspect-square size-8 shrink-0 rounded-lg">
              <AvatarImage
                alt={activeOrg?.name ?? ''}
                src={activeOrg?.logo ?? undefined}
              />
              <AvatarFallback
                className={`rounded-lg text-xs font-bold text-white ${getOrgColor(activeOrg?.name ?? '')}`}
              >
                {getInitials(activeOrg?.name ?? session.user.name ?? '')}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {activeTeam?.name ??
                  activeOrg?.name ??
                  session.user.name ??
                  'User'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {activeOrg ? activeOrg.name : (session.user.email ?? '')}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 shrink-0" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-72 rounded-lg"
            side="bottom"
            sideOffset={4}
          >
            {activeOrg && teams.length > 0 && (
              <>
                <DropdownMenuLabel className="py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Teams
                </DropdownMenuLabel>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2">
                    <span className="truncate font-medium">
                      {activeTeam?.name ?? 'No team'}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-52">
                    {teams.map((team: { id: string; name: string }) => (
                      <DropdownMenuItem
                        key={team.id}
                        onSelect={() => handleTeamSwitch(team.id)}
                      >
                        {team.id === activeTeamId ? (
                          <Check className="size-4 shrink-0" />
                        ) : (
                          <span className="size-4 shrink-0" />
                        )}
                        <span className="truncate">{team.name}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleCreateTeam}>
                      <Plus className="size-4" />
                      <span>New team</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuLabel className="py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Organization
            </DropdownMenuLabel>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <OrgAvatar
                  logo={activeOrg?.logo}
                  name={activeOrg?.name ?? ''}
                />
                <span className="truncate font-medium">
                  {activeOrg?.name ?? 'No organization'}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-52">
                {orgList.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onSelect={() => handleOrganizationSwitch(org.id)}
                  >
                    {org.id === activeOrg?.id ? (
                      <Check className="size-4 shrink-0" />
                    ) : (
                      <span className="size-4 shrink-0" />
                    )}
                    <OrgAvatar logo={org.logo} name={org.name} size="md" />
                    <span className="truncate">{org.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleCreateOrganization}>
                  <Plus className="size-4" />
                  <span>New organization</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </DropdownMenuLabel>

            <DropdownMenuItem>
              <Avatar className="size-6 shrink-0 rounded-full">
                <AvatarImage
                  alt={session.user.name ?? ''}
                  src={session.user.image ?? undefined}
                />
                <AvatarFallback className="rounded-full text-[10px]">
                  {session.user.name?.charAt(0) ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 leading-tight">
                <span className="truncate text-sm font-medium">
                  {session.user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {session.user.email}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      navigate({ to: '/' });
                    },
                  },
                });
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function SidebarFooterContent() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Settings" render={<Link to="/dashboard" />}>
          <Settings />
          <span>Settings</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarScopeSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <NavItemButton item={item} key={item.id} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  );
}
