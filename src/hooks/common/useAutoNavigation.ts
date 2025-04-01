"use client";
import { useRouter } from "next/navigation";
import useCountdown from "./useCountdown";
import { useCallback, useEffect } from "react";
import {
  AUTO_REDIRECT_TIME_COUNTDOWN,
  DEFAULT_NUMBER,
  Routers,
} from "@/constants";

const useAutoNavigation = (
  navigation: Routers,
  seconds = AUTO_REDIRECT_TIME_COUNTDOWN
) => {
  const router = useRouter();

  const { countdown } = useCountdown(seconds);

  const onRedirect = useCallback(() => {
    router.push(navigation);
  }, [navigation]);

  useEffect(() => {
    if (countdown === DEFAULT_NUMBER) {
      onRedirect();
    }
  }, [countdown]);

  return { countdown, onRedirect };
};

export default useAutoNavigation;
