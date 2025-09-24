import { useEffect, useRef, useState } from "react";

const initUrl =
  "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge";

async function fetchBody(url?: string) {
  const response = await fetch(url || initUrl);
  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  return await response.text();
}

function traverseTree(elementList: HTMLCollection) {
  let result = "";

  for (const element of Array.from(elementList)) {
    const nodeName = element.nodeName.toLowerCase();
    if (element.hasChildNodes()) {
      const dataID = element.getAttribute("data-id");
      const dataClass = element.getAttribute("data-class");
      const dataTag = element.getAttribute("data-tag");
      if (
        (nodeName === "section" && dataID && /^92\S*$/.test(dataID)) ||
        (nodeName === "article" && dataClass && /^\S*45$/.test(dataClass)) ||
        (nodeName === "div" && dataTag && /^\S*78\S*$/.test(dataTag))
      )
        result += traverseTree(element.children);
    } else {
      if (nodeName === "b" && element.classList.contains("ref"))
        return element.getAttribute("value") || "";
    }
  }
  return result;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [displayElement, setDisplayElement] = useState<string[]>([]);
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
        setDisplayElement([]);
        setFlag(res);
        index.current = 0;
      });
    }
  }, [body, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayElement((old) => [...old, "."]);
      index.current += 1;
      if (index.current > 3) {
        index.current = 0;
        setDisplayElement([]);
      }
    }, 250);
    if (!isLoading) clearInterval(interval);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log([...displayElement, flag[index.current]]);
      setDisplayElement([...displayElement, flag[index.current]]);
      index.current += 1;
      if (index.current >= flag.length) {
        clearInterval(interval);
      }
    }, 500);
    if (!flag) clearInterval(interval);
    return () => clearInterval(interval);
  }, [displayElement, flag]);

  return (
    <div>
      {isLoading && <>Loading</>}
      {displayElement}
    </div>
  );
}

export default App;
