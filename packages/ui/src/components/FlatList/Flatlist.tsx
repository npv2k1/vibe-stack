import React, { useCallback, useMemo } from 'react';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
import { chunk } from 'lodash';

import { cn } from '../utils';

export type FlatListProps<T = any> = {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactNode;
  rowHeight: number;
  keyExtractor?: ((item: T, index: number) => string) | undefined;
  columnCount?: number;
  className?: string;
};

export const FlatList: React.FC<FlatListProps> = ({
  data,
  renderItem,
  rowHeight,
  keyExtractor,
  columnCount = 1,
  className,
}) => {
  const splitData = useMemo(() => {
    return chunk(data, columnCount);
  }, [data, columnCount]);

  const rowRenderer = useCallback(
    ({ index, key, style }: ListRowProps) => {
      return (
        <div key={keyExtractor?.(data[index], index)} style={style} className={`flex w-full flex-row items-center`}>
          {Array(columnCount)
            .fill(columnCount)
            .map((_, i) => (
              <div className="flex-1" key={i}>
                {splitData[index][i] && renderItem({ item: splitData[index][i], index })}
              </div>
            ))}
        </div>
      );
    },
    [data, renderItem, keyExtractor, splitData, columnCount],
  );

  return (
    <AutoSizer>
      {({ width, height }) => (
        <List
          width={width}
          height={height}
          rowHeight={rowHeight}
          rowRenderer={rowRenderer}
          rowCount={columnCount ? splitData.length : data.length}
          overscanRowCount={3}
          className={cn('bg-white', className)}
        />
      )}
    </AutoSizer>
  );
};
