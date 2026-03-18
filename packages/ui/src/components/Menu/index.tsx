import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

// Default Tailwind classes - can be overridden by props
const DEFAULT_ITEM_CLASS = 'text-sm font-medium rounded-md transition-colors duration-150 ease-in-out';
const DEFAULT_LINK_CLASS = 'flex items-center w-full px-3 py-2';
const DEFAULT_HOVER_CLASS = 'hover:bg-gray-100 dark:hover:bg-gray-700';
const DEFAULT_ACTIVE_CLASS = 'bg-blue-500 text-white dark:bg-blue-600';
const DEFAULT_INACTIVE_CLASS = 'text-gray-700 dark:text-gray-200';

// MenuItem type definition
// Added 'children' for potential submenu items and 'isSubmenuOpen' for state
export type MenuItemType = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  action?: (id: string) => void;
  children?: MenuItemType[];
  isSubmenuOpen?: boolean; // Added for managing submenu state
  disabled?: boolean;
};

// Menu Props
export interface MenuProps {
  items: MenuItemType[];
  layout?: 'horizontal' | 'vertical';
  activeItemId?: string | null;
  onItemClick?: (item: MenuItemType) => void; // Changed to pass the whole item
  className?: string; // For the main ul container
  itemClassName?: string; // For each li item (general)
  activeItemClassName?: string; // For the active li item
  inactiveItemClassName?: string; // For inactive li items
  linkClassName?: string; // For the a or button inside li
  hoverClassName?: string; // For hover effect on li
  submenuIndent?: boolean; // Whether to indent submenu items
}

export const Menu: React.FC<MenuProps> = ({
  items,
  layout = 'horizontal',
  activeItemId,
  onItemClick,
  className = '',
  itemClassName = DEFAULT_ITEM_CLASS,
  activeItemClassName = DEFAULT_ACTIVE_CLASS,
  inactiveItemClassName = DEFAULT_INACTIVE_CLASS,
  linkClassName = DEFAULT_LINK_CLASS,
  hoverClassName = DEFAULT_HOVER_CLASS,
  submenuIndent = true,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(
    items.map((item) => ({ ...item, isSubmenuOpen: item.isSubmenuOpen || false })),
  );

  const handleItemClick = (item: MenuItemType) => {
    if (item.disabled) return;

    // Toggle submenu if item has children
    if (item.children && item.children.length > 0) {
      setMenuItems((prevItems) =>
        prevItems.map((i) => (i.id === item.id ? { ...i, isSubmenuOpen: !i.isSubmenuOpen } : i)),
      );
    }

    // Call external onItemClick for navigation or other actions
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const renderMenuItems = (itemsToRender: MenuItemType[], level = 0) => {
    return itemsToRender.map((item) => {
      const isActive = item.id === activeItemId;
      const itemStyle = `${itemClassName} ${isActive ? activeItemClassName : inactiveItemClassName} ${!item.disabled ? hoverClassName : 'opacity-50 cursor-not-allowed'}`;
      const linkStyle = `${linkClassName} ${submenuIndent && level > 0 ? `pl-${4 + level * 2}` : ''}`;

      const content = (
        <>
          {item.icon && <span className="mr-2 shrink-0">{item.icon}</span>}
          <span className="flex-grow">{item.label}</span>
          {item.children && item.children.length > 0 && (
            <span className="ml-auto shrink-0">
              {item.isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </>
      );

      return (
        <React.Fragment key={item.id}>
          <li className={`${itemStyle} ${layout === 'horizontal' ? 'whitespace-nowrap' : ''}`}>
            {item.href && !item.disabled ? (
              <a
                href={item.href}
                className={linkStyle}
                onClick={() => handleItemClick(item)}
                aria-current={isActive ? 'page' : undefined}
              >
                {content}
              </a>
            ) : (
              <button
                type="button"
                className={linkStyle}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                {content}
              </button>
            )}
          </li>
          {item.children && item.isSubmenuOpen && (
            <ul
              className={`
              ${layout === 'vertical' ? 'flex flex-col' : ''} 
              ${submenuIndent && layout === 'vertical' ? 'ml-0' : ''} // No extra indent for submenu UL itself if items are indented
            `}
            >
              {renderMenuItems(item.children, level + 1)}
            </ul>
          )}
        </React.Fragment>
      );
    });
  };

  const layoutClasses = layout === 'horizontal' ? 'flex flex-row space-x-1' : 'flex flex-col space-y-1';

  return (
    <nav aria-label="Main navigation">
      <ul className={`${layoutClasses} ${className}`}>{renderMenuItems(menuItems)}</ul>
    </nav>
  );
};
