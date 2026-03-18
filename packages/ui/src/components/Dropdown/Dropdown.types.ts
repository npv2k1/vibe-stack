import React from 'react';

// Define interface for each dropdown item
export interface DropdownItem {
  key: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  onClick?: () => void;
}

// Define interface for dropdown props
export interface DropdownProps {
  renderLabel: () => React.ReactNode;
  renderContent: () => React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}
