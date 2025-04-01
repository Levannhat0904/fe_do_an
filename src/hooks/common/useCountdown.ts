import { useState, useEffect } from "react";

const useCountdown = (initialCount = 5) => {
  const [countdown, setCountdown] = useState(initialCount);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const resetCountdown = () => setCountdown(initialCount);

  return { countdown, resetCountdown };
};

export default useCountdown;
