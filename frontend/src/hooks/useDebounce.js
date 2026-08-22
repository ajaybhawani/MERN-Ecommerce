import { useEffect, useState } from "react";

/**
 * Returns `value` delayed by `delay` ms so rapidly changing input (a search
 * box) settles before it drives a fetch. The latest value always wins.
 */
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
