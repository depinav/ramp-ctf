export function traverseTree(elementList: HTMLCollection) {
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
