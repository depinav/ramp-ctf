import { useEffect, useRef, useState } from "react";
import { fetchBody } from "./api";
import { traverseTree } from "./helpers";
import { Loader } from "./Loader";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [displayFlag, setDisplayFlag] = useState<string[]>([]);
  const [body, setBody] = useState<HTMLDivElement | null>();
  const [flag, setFlag] = useState("");
  const index = useRef(0);

  useEffect(() => {
    fetchBody().then((res) => {
      const div = document.createElement("div");
      div.innerHTML = res.trim();
      setBody(div);
    });
  }, []);

  useEffect(() => {
    if (isLoading && body) {
      const result = traverseTree(body.getElementsByTagName("section"));

      fetchBody(result).then((res) => {
        setIsLoading(false);
        setDisplayFlag([]);
        setFlag(res);
        index.current = 0;
      });
    }
  }, [body, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayFlag([...displayFlag, flag[index.current]]);
      index.current += 1;
      if (index.current >= flag.length) {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [displayFlag, flag]);

  return (
    <div>
      <Loader isLoading={isLoading} />
      {displayFlag}
    </div>
  );
}

export default App;
