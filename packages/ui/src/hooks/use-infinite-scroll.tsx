import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * Props for the useInfiniteScroll hook.
 */
export interface useInfinitiveScrollProps {
  /** Function that fetches the next page of data. Should return a Promise. */
  fetchPage: () => Promise<unknown>;
  /** Boolean indicating whether more data can be fetched */
  canFetchMore: boolean;
}

/**
 * A utility component that provides a screen offset element for infinite scrolling.
 * This creates an invisible element at the bottom of the screen that can be used
 * as a trigger point for loading more content.
 *
 * @returns A small invisible div element positioned at the bottom of the screen
 *
 * @example
 * ```tsx
 * const MyList = () => (
 *   <div>
 *     {items.map(item => <div key={item.id}>{item.content}</div>)}
 *     <InfiniteScrollScreenOffset />
 *   </div>
 * );
 * ```
 */
export const InfiniteScrollScreenOffset = () => {
  return <div className="absolute bottom-0 left-0 h-[1px] opacity-0 pointer-events-none"></div>;
};

/**
 * A custom React hook for implementing infinite scrolling using intersection observer.
 * Automatically triggers data fetching when the observed element comes into view.
 *
 * @param props - Configuration object containing fetchPage function and canFetchMore flag
 * @returns A ref function to attach to the element that should trigger infinite scrolling
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [items, setItems] = useState([]);
 *   const [canFetchMore, setCanFetchMore] = useState(true);
 *
 *   const fetchMoreItems = async () => {
 *     const newItems = await api.fetchItems(page);
 *     setItems(prev => [...prev, ...newItems]);
 *     setCanFetchMore(newItems.length > 0);
 *   };
 *
 *   const infiniteScrollRef = useInfinitiveScroll({
 *     fetchPage: fetchMoreItems,
 *     canFetchMore
 *   });
 *
 *   return (
 *     <div>
 *       {items.map(item => <div key={item.id}>{item.content}</div>)}
 *       <div ref={infiniteScrollRef}>Loading more...</div>
 *     </div>
 *   );
 * };
 * ```
 */
export function useInfinitiveScroll({
  fetchPage,
  canFetchMore,
}: useInfinitiveScrollProps): (node?: Element | null) => void {
  const { ref: infiniteScrollRef, inView } = useInView({
    rootMargin: '20px',
    threshold: 1,
  });
  useEffect(() => {
    if (inView && canFetchMore) {
      fetchPage();
    }
  }, [inView, canFetchMore]);

  return infiniteScrollRef;
}
