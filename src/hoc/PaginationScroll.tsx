import clsx from "clsx";
import React, {
  useState,
  useEffect,
  useRef,
  PropsWithChildren,
  FC,
} from "react";

interface PaginationScrollProps extends PropsWithChildren {
  elements: any;
  fetchPagination: any;
  chatUUID: any;
  elementScroll: any;
  isLastPage?: boolean;
  isFetch?: boolean;
  isLoading?: boolean;
  className?: string;
  classes?: {
    wrapper?: string;
    triggerElement?: string;
  };
}

export const PRODUCTS_PER_LOAD = 10;

const PaginationScroll: FC<PaginationScrollProps> = ({
  children,
  elements,
  fetchPagination,
  chatUUID,
  elementScroll,
  isLastPage,
  isFetch,
  isLoading,
  classes,
}) => {
  const [isClient, setIsClient] = useState(false);
  const loadMoreRef = useRef(null);
  const ref = useRef<any>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const endOfMessagesRef = useRef<any>(null);

  const loadMoreProducts = async () => {
    setScrollPosition(ref?.current?.clientHeight);
    await fetchPagination({
      chatId: chatUUID,
      limit: PRODUCTS_PER_LOAD,
      offset: elements.length,
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isFetch && isClient && !isLastPage) {
          await loadMoreProducts();
        }
      },
      { threshold: 0.1, root: null, rootMargin: "0px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [elements, fetchPagination, isFetch, isClient]);

  useEffect(() => {
    if (elementScroll && scrollPosition) {
      elementScroll.scrollTop = ref.current.clientHeight - scrollPosition;
    }
  }, [elements]);

  useEffect(() => {
    if (isLoading && endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoading]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      ref={ref}
      className={clsx(
        "flex flex-col items-center gap-2.5 md:gap-5 w-full",
        classes?.wrapper
      )}
    >
      {Boolean(elements?.length) && (
        <div className={classes?.triggerElement} ref={loadMoreRef}></div>
      )}
      {children}
      {isLoading && (
        <div
          ref={endOfMessagesRef}
          className="min-h-[46px] md:min-h-[60px] w-full"
        >
          <div className="w-full flex">Loading...</div>
        </div>
      )}
    </div>
  );
};

export { PaginationScroll };
