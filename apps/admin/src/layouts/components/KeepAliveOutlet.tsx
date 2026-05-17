import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

import { useTabsStore } from '@/stores';

type CachedOutletMap = Record<string, ReactElement>;

interface KeepAliveOutletProps {
  isDark: boolean;
}

export default function KeepAliveOutlet({ isDark }: KeepAliveOutletProps) {
  const outlet = useOutlet();
  const location = useLocation();
  const tabs = useTabsStore((state) => state.tabs);
  const currentKey = location.pathname;
  const shouldCache = Boolean(outlet) && currentKey !== '/';
  const [cachedOutlets, setCachedOutlets] = useState<CachedOutletMap>({});
  const paneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollTops = useRef<Record<string, number>>({});
  const previousKey = useRef(currentKey);

  useEffect(() => {
    if (!shouldCache || !outlet) return;

    setCachedOutlets((cache) => {
      if (cache[currentKey]) {
        return cache;
      }

      return {
        ...cache,
        [currentKey]: outlet,
      };
    });
    // Keep the current route element captured for this pathname/search pair.
    // `outlet` itself is intentionally omitted to avoid cache churn on parent rerenders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey, location.search, shouldCache]);

  useEffect(() => {
    const previousPane = paneRefs.current[previousKey.current];
    if (previousPane) {
      scrollTops.current[previousKey.current] = previousPane.scrollTop;
    }

    const nextPane = paneRefs.current[currentKey];
    if (nextPane) {
      nextPane.scrollTop = scrollTops.current[currentKey] ?? 0;
    }

    previousKey.current = currentKey;
  }, [currentKey]);

  useEffect(() => {
    const openKeys = new Set(tabs.map((tab) => tab.key));

    setCachedOutlets((cache) => {
      const nextCache = Object.fromEntries(
        Object.entries(cache).filter(
          ([key]) => openKeys.has(key) || key === currentKey,
        ),
      ) as CachedOutletMap;

      return Object.keys(nextCache).length === Object.keys(cache).length
        ? cache
        : nextCache;
    });
  }, [currentKey, tabs]);

  const outlets = useMemo(() => {
    const visibleOutlets = { ...cachedOutlets };
    if (shouldCache && outlet && !visibleOutlets[currentKey]) {
      visibleOutlets[currentKey] = outlet;
    }
    const tabOrder = new Map(tabs.map((tab, index) => [tab.key, index]));

    return Object.entries(visibleOutlets)
      .filter(([key]) => tabOrder.has(key) || key === currentKey)
      .sort(([leftKey], [rightKey]) => {
        const leftIndex = tabOrder.get(leftKey) ?? Number.MAX_SAFE_INTEGER;
        const rightIndex = tabOrder.get(rightKey) ?? Number.MAX_SAFE_INTEGER;
        return leftIndex - rightIndex;
      });
  }, [cachedOutlets, currentKey, outlet, shouldCache, tabs]);

  if (!shouldCache) {
    return outlet;
  }

  return (
    <div className="admin-keep-alive">
      {outlets.map(([key, element]) => {
        const active = key === currentKey;

        return (
          <div
            key={key}
            ref={(node) => {
              paneRefs.current[key] = node;
            }}
            className={`admin-keep-alive-pane ${
              active ? 'admin-keep-alive-pane-active' : ''
            } ${isDark ? 'admin-layout-content-dark' : 'admin-layout-content-light'}`}
            aria-hidden={!active}
            onScroll={(event) => {
              if (active) {
                scrollTops.current[key] = event.currentTarget.scrollTop;
              }
            }}
          >
            {element}
          </div>
        );
      })}
    </div>
  );
}
