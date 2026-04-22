import {
  ShieldAlert,
  CalendarDays,
  Store,
  FolderOpen,
  ChartLine,
  ContactRound,
  DoorOpen,
  Settings,
  Handshake,
  Sparkles,
  FileQuestionMark,
  type LucideIcon,
} from 'lucide-react'

export interface SidebarChildItem {
  key: string
  label: string
}

export interface SidebarTopItem {
  key: string
  label: string
  icon: LucideIcon
  children?: readonly SidebarChildItem[]
}

export const SIDEBAR_MENU: readonly SidebarTopItem[] = [
  {
    key: 'admin',
    label: 'Admin',
    icon: ShieldAlert,
    children: [
      { key: 'tools', label: 'Tools' },
      { key: 'feature-configuration', label: 'Feature configuration' },
      { key: 'application-configuration', label: 'Application configuration' },
      { key: 'mall-store-configuration', label: 'Mall & store configuration' },
      { key: 'accounts-management', label: 'Accounts management' },
    ],
  },
  {
    key: 'annual-turnover-declaration',
    label: 'Annual Turnover declaration',
    icon: CalendarDays,
  },
  {
    key: 'my-shopping-center',
    label: 'My Shopping center',
    icon: Store,
    children: [
      { key: 'newsfeed', label: 'Newsfeed' },
      { key: 'deal', label: 'Deal' },
      { key: 'events', label: 'Events' },
    ],
  },
  {
    key: 'my-documents',
    label: 'My documents',
    icon: FolderOpen,
  },
  {
    key: 'turnover-declaration',
    label: 'Turnover declaration',
    icon: ChartLine,
  },
  {
    key: 'my-contacts',
    label: 'My contacts',
    icon: ContactRound,
  },
  {
    key: 'access-request',
    label: 'Access request',
    icon: DoorOpen,
  },
  {
    key: 'gestion-des-applications',
    label: 'Gestion des applications',
    icon: Settings,
    children: [
      { key: 'user-management', label: 'User management' },
      { key: 'shopping-center-management', label: 'Shopping center management' },
    ],
  },
  {
    key: 'tenant-coordination',
    label: 'Tenant coordination',
    icon: Handshake,
    children: [
      { key: 'handover', label: 'Handover' },
      { key: 'opening', label: 'Opening' },
      { key: 'hand-back', label: 'Hand back' },
    ],
  },
  {
    key: 'customer-excellence',
    label: 'Customer excellence',
    icon: Sparkles,
    children: [
      { key: 'daily-customer-tour', label: 'Daily customer tour' },
      { key: 'customer-visit', label: 'Customer visit' },
      { key: 'ace', label: 'ACE' },
      { key: 'opening-track', label: 'Opening track' },
    ],
  },
  {
    key: 'ressources',
    label: 'Ressources',
    icon: FileQuestionMark,
  },
] as const
