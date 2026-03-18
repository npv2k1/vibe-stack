import React, { useEffect, useId, useMemo, useRef } from 'react';
import { keyBy } from 'lodash';
import { motion } from 'motion/react';

import { cn } from '../utils';

/**
 * Represents a single tab in the Tabs component.
 */
export type Tab = {
  /** Unique identifier for the tab */
  name: string;
  /** Display title for the tab */
  title: string;
  /** Optional badge or extra element to display next to title */
  badge?: React.ReactNode;
  /** Disable tab interaction */
  disabled?: boolean;
  /** Function that renders the content of the tab */
  render: () => React.ReactNode;
};

/**
 * Available visual variants for the Tabs component.
 */
export type TabVariant = 'underline' | 'pills' | 'enclosed';

/**
 * Props for the Tabs component.
 */
export type TabsProps = {
  /** Array of tabs to display */
  tabs?: Tab[];
  /** Additional CSS classes for the container */
  className?: string;
  /** Name of the currently active tab */
  activeTab?: string;
  /** Callback fired when the active tab changes */
  onChange?: (key: string) => void;
  /**
   * Visual variant of the tabs
   * @default 'underline'
   */
  variant?: TabVariant;
};

/**
 * A flexible Tabs component with multiple visual variants and smooth animations.
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { name: 'tab1', title: 'Tab 1', render: () => <div>Content 1</div> },
 *   { name: 'tab2', title: 'Tab 2', render: () => <div>Content 2</div> },
 * ];
 *
 * <Tabs tabs={tabs} variant="pills" onChange={(key) => console.log(key)} />
 * ```
 */
export const Tabs = ({
  tabs = [],
  className,
  activeTab: activeTabProp,
  onChange,
  variant = 'underline',
}: TabsProps) => {
  const isControlled = activeTabProp !== undefined;
  const [uncontrolledTab, setUncontrolledTab] = React.useState(tabs[0]?.name || '');
  const activeTab = (isControlled ? activeTabProp : uncontrolledTab) || '';
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const instanceId = useId();

  const tabMap = useMemo(() => {
    return keyBy(tabs, 'name');
  }, [tabs]);

  useEffect(() => {
    if (isControlled) return;
    if (!tabs.length) {
      setUncontrolledTab('');
      return;
    }
    const exists = tabs.some((tab) => tab.name === uncontrolledTab);
    if (!exists) {
      const firstEnabled = tabs.find((tab) => !tab.disabled) || tabs[0];
      setUncontrolledTab(firstEnabled?.name || '');
    }
  }, [isControlled, tabs, uncontrolledTab]);

  // Variant-specific styles
  const getContainerStyles = () => {
    switch (variant) {
      case 'pills':
        return 'flex w-fit flex-row gap-1 rounded-lg bg-slate-100/70 p-1 shadow-inner';
      case 'enclosed':
        return 'flex flex-row border-b border-slate-200';
      case 'underline':
      default:
        return 'flex flex-row gap-2 border-b border-slate-200';
    }
  };

  const getTabStyles = (isActive: boolean, isDisabled: boolean) => {
    switch (variant) {
      case 'pills':
        return cn(
          'relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/70',
          isActive
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900',
          isDisabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-slate-600',
        );
      case 'enclosed':
        return cn(
          'relative inline-flex items-center gap-2 rounded-t-md border border-b-0 border-slate-200 px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/70',
          isActive
            ? 'bg-white text-slate-900 shadow-sm'
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100',
          isDisabled && 'cursor-not-allowed opacity-50 hover:bg-slate-50 hover:text-slate-600',
        );
      case 'underline':
      default:
        return cn(
          'relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/70',
          isActive ? 'text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          isDisabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-slate-600',
        );
    }
  };

  const showUnderline = variant === 'underline';
  const handleSelect = (tabName: string, isDisabled?: boolean) => {
    if (isDisabled) return;
    if (!isControlled) {
      setUncontrolledTab(tabName);
    }
    onChange?.(tabName);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!tabs.length) return;
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    if (!enabledTabs.length) return;
    const currentIndex = enabledTabs.findIndex((tab) => tab.name === activeTab);
    const lastIndex = enabledTabs.length - 1;
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % enabledTabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex === -1 ? lastIndex : (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = lastIndex;
        break;
      case 'Enter':
      case ' ':
        return;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = enabledTabs[nextIndex];
    handleSelect(nextTab.name);
    const nextTabIndex = tabs.findIndex((tab) => tab.name === nextTab.name);
    tabRefs.current[nextTabIndex]?.focus();
  };

  return (
    <div className={className}>
      <div
        className={cn('overflow-x-auto', getContainerStyles())}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.name;
          const tabId = `${instanceId}-tab-${tab.name}`;
          const panelId = `${instanceId}-panel-${tab.name}`;
          return (
            <button
              key={tab.name}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              className={getTabStyles(isActive, !!tab.disabled)}
              onClick={() => handleSelect(tab.name, tab.disabled)}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              id={tabId}
              type="button"
              disabled={tab.disabled}
            >
              <span className="inline-flex items-center gap-2">
                {tab.title}
                {tab.badge}
              </span>
              {isActive && showUnderline && (
                <motion.div
                  layoutId="underline"
                  className={cn('absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-slate-900')}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div
        className="pt-4"
        key={activeTab}
        role="tabpanel"
        id={`${instanceId}-panel-${activeTab}`}
        aria-labelledby={`${instanceId}-tab-${activeTab}`}
      >
        {tabMap[activeTab]?.render()}
      </div>
    </div>
  );
};
