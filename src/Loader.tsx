import { useEffect, useRef, useState } from "react";

export function Loader({ isLoading }: { isLoading: boolean }) {
  const [displayElement, setDisplayElement] = useState<string[]>([]);
  const index = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayElement([...displayElement, "."]);
      index.current += 1;
      if (index.current > 3) {
        index.current = 0;
        setDisplayElement([]);
      }
    }, 250);
    if (!isLoading) clearInterval(interval);
    return () => clearInterval(interval);
  }, [displayElement, isLoading]);

  return isLoading && <>Loading{displayElement}</>;
}
