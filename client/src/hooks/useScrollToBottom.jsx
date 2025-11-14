import { useEffect, useRef } from "react";

export const useScrollToBottom = (messages) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return ref;
};
