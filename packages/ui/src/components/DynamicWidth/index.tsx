import React from 'react';
import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';

export type DynamicWidthContextType = {
  maxWidth: number;
  labelsRef: React.MutableRefObject<HTMLElement[]>;
};

// Create a context for sharing the maxWidth value
const DynamicWidthContext = createContext<DynamicWidthContextType>({
  maxWidth: 0,
  labelsRef: { current: [] },
});

const DynamicWidthProvider = ({ children }: { children: React.ReactNode }) => {
  const labelsRef = useRef<HTMLElement[]>([]);
  const [maxWidth, setMaxWidth] = useState(0);

  useLayoutEffect(() => {
    // Calculate the maximum width of all labels
    if (labelsRef.current.length > 0) {
      const widths = labelsRef.current.map((label) => {
        return label?.offsetWidth || 0;
      });
      setMaxWidth(Math.max(...widths));
    }
  }, []);

  useLayoutEffect(() => {
    if (maxWidth > 0 && labelsRef.current.length > 0) {
      labelsRef.current.forEach((label) => {
        if (label) {
          if (label && label.style) {
            // label.style.backgroundColor = 'blue';
            label.style.width = `${maxWidth}px`;
            // console.log('label', label);
          }
        }
      });
    }
  }, [maxWidth]);

  return (
    <DynamicWidthContext.Provider value={{ maxWidth, labelsRef }}>
      {children}
    </DynamicWidthContext.Provider>
  );
};

const DynamicWidthItem = ({ children }: { children: React.ReactNode }) => {
  const { labelsRef } = useContext(DynamicWidthContext);
  return (
    <div
      ref={(el) => {
        if (el) labelsRef.current.push(el);
      }}
    >
      {children}
    </div>
  );
};

export const DynamicWidth = ({ children }: { children: React.ReactNode }) => {
  return <DynamicWidthProvider>{children}</DynamicWidthProvider>;
};

DynamicWidth.Item = DynamicWidthItem;

export const withDynamicWidth = (Component: React.ComponentType<any>) => {
  const WrappedComponent = (props: any) => (
    <DynamicWidth>
      <Component {...props} />
    </DynamicWidth>
  );

  WrappedComponent.displayName = `withDynamicWidth(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
};
