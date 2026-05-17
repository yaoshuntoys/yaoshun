import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminTabItem {
  key: string;
  title: string;
  path: string;
  closable: boolean;
}

interface TabsState {
  tabs: AdminTabItem[];
  activeKey: string;
  addTab: (tab: AdminTabItem) => void;
  closeTab: (key: string) => string | undefined;
  closeOtherTabs: (key: string) => void;
  closeLeftTabs: (key: string) => void;
  closeRightTabs: (key: string) => void;
  clearTabs: () => string;
  setActiveKey: (key: string) => void;
}

const dashboardTab: AdminTabItem = {
  key: '/dashboard',
  title: '仪表盘',
  path: '/dashboard',
  closable: false,
};

function normalizeTabs(tabs: AdminTabItem[]) {
  const seen = new Set<string>();
  return [dashboardTab, ...tabs]
    .filter((tab) => {
      if (seen.has(tab.key)) return false;
      seen.add(tab.key);
      return true;
    })
    .map((tab) => (tab.key === dashboardTab.key ? dashboardTab : tab));
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [dashboardTab],
      activeKey: dashboardTab.key,
      addTab: (tab) =>
        set((state) => {
          const exists = state.tabs.some((item) => item.key === tab.key);

          return {
            tabs: normalizeTabs(
              exists
                ? state.tabs.map((item) =>
                    item.key === tab.key ? { ...item, ...tab } : item,
                  )
                : [...state.tabs, tab],
            ),
            activeKey: tab.key,
          };
        }),
      closeTab: (key) => {
        const state = get();
        const tabs = state.tabs;
        const targetIndex = tabs.findIndex((tab) => tab.key === key);
        const target = tabs[targetIndex];
        if (!target?.closable) return undefined;

        const nextTabs = normalizeTabs(tabs.filter((tab) => tab.key !== key));
        const fallback =
          tabs[targetIndex + 1] ?? tabs[targetIndex - 1] ?? dashboardTab;
        const nextActiveKey =
          state.activeKey === key ? fallback.key : state.activeKey;

        set({
          tabs: nextTabs,
          activeKey: nextActiveKey,
        });

        return nextActiveKey;
      },
      closeOtherTabs: (key) =>
        set((state) => ({
          tabs: normalizeTabs(
            state.tabs.filter((tab) => !tab.closable || tab.key === key),
          ),
          activeKey: key,
        })),
      closeLeftTabs: (key) =>
        set((state) => {
          const targetIndex = state.tabs.findIndex((tab) => tab.key === key);
          return {
            tabs: normalizeTabs(
              state.tabs.filter(
                (tab, index) => !tab.closable || index >= targetIndex,
              ),
            ),
            activeKey: key,
          };
        }),
      closeRightTabs: (key) =>
        set((state) => {
          const targetIndex = state.tabs.findIndex((tab) => tab.key === key);
          return {
            tabs: normalizeTabs(
              state.tabs.filter(
                (tab, index) => !tab.closable || index <= targetIndex,
              ),
            ),
            activeKey: key,
          };
        }),
      clearTabs: () => {
        const state = get();
        const nextTabs = normalizeTabs(
          state.tabs.filter((tab) => !tab.closable),
        );
        const nextActiveKey = nextTabs.some((tab) => tab.key === state.activeKey)
          ? state.activeKey
          : dashboardTab.key;
        const nextActiveTab =
          nextTabs.find((tab) => tab.key === nextActiveKey) ?? dashboardTab;

        set({
          tabs: nextTabs,
          activeKey: nextActiveTab.key,
        });

        return nextActiveTab.path;
      },
      setActiveKey: (key) => set({ activeKey: key }),
    }),
    {
      name: 'admin-tabs-storage',
    },
  ),
);
