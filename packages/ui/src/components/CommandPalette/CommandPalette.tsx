import React, { useEffect } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../../shadcn/command';

export interface CommandPaletteAction {
  /** Unique identifier for the action */
  id: string;
  /** Label to display */
  label: string;
  /** Optional icon to display before the label */
  icon?: React.ReactNode;
  /** Optional keyboard shortcut to display */
  shortcut?: string;
  /** Optional keywords for search */
  keywords?: string[];
  /** Callback when the action is selected */
  onSelect: () => void;
  /** Optional disabled state */
  disabled?: boolean;
}

export interface CommandPaletteGroup {
  /** Group heading */
  heading?: string;
  /** Actions in this group */
  actions: CommandPaletteAction[];
}

export interface CommandPaletteProps {
  /** Controls the open state of the command palette */
  open: boolean;
  /** Callback when the open state changes */
  onOpenChange: (open: boolean) => void;
  /** Groups of actions to display */
  groups: CommandPaletteGroup[];
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Message to display when no results are found */
  emptyMessage?: string;
  /** Optional keyboard shortcut to toggle the command palette (e.g., "⌘K") */
  shortcut?: string;
}

/**
 * CommandPalette component provides a searchable command palette interface
 * for quick access to actions and navigation.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 * 
 * const groups = [
 *   {
 *     heading: 'Navigation',
 *     actions: [
 *       {
 *         id: 'home',
 *         label: 'Home',
 *         onSelect: () => navigate('/'),
 *         shortcut: '⌘H',
 *       },
 *     ],
 *   },
 * ];
 * 
 * return <CommandPalette open={open} onOpenChange={setOpen} groups={groups} />;
 * ```
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  groups,
  placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.',
  shortcut,
}) => {
  useEffect(() => {
    if (!shortcut) return;

    const down = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange, shortcut]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        {groups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <CommandSeparator />}
            <CommandGroup heading={group.heading}>
              {group.actions.map((action) => (
                <CommandItem
                  key={action.id}
                  value={action.label}
                  keywords={action.keywords}
                  disabled={action.disabled}
                  onSelect={() => {
                    action.onSelect();
                    onOpenChange(false);
                  }}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  <span>{action.label}</span>
                  {action.shortcut && <CommandShortcut>{action.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

CommandPalette.displayName = 'CommandPalette';

/**
 * Hook to manage command palette state and keyboard shortcuts
 * 
 * @example
 * ```tsx
 * const { open, setOpen, toggle } = useCommandPalette();
 * 
 * return (
 *   <>
 *     <button onClick={toggle}>Open Command Palette</button>
 *     <CommandPalette open={open} onOpenChange={setOpen} groups={groups} />
 *   </>
 * );
 * ```
 */
export const useCommandPalette = () => {
  const [open, setOpen] = React.useState(false);

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return { open, setOpen, toggle };
};
