import React from "react";
import { useEffect, useState } from "react";

export type TActivity = {
  activity: string;
  timestamp: Date;
};

const handleSetActivity = (type: string, setActivity: React.Dispatch<React.SetStateAction<TActivity[]>>, isStart: boolean) => {
  if (!isStart) return;
  const newActivity: TActivity = {
    activity: type,
    timestamp: new Date(),
  }
  setActivity(prev => {
    for (let item of prev) {
      if (newActivity.timestamp.getTime() === item.timestamp.getTime() && newActivity.activity === item.activity) {
        return prev;
      }
    }
    prev.push(newActivity);
    for (let i = 0; i < prev.length; i++) {
      if (prev[i].activity === "aplOut" && i !== prev.length - 1) {
        if (prev[i + 1].activity === "pageOut") {
          prev[i] = { activity: "pageOut", timestamp: prev[i].timestamp };
          prev.splice(i + 1, 1);
        }
      }
      if (prev[i].activity === "pageIn" && i !== prev.length - 1) {
        if (prev[i + 1].activity === "aplIn") {
          prev[i] = { activity: "pageIn", timestamp: prev[i].timestamp };
          prev.splice(i + 1, 1);
        }
      }
    }
    return prev;
  });
};

export const totalCopy = (activity: TActivity[]) => {
  let totalCopas = 0
  let pressedCTRL = false;
  for (let i = 0; i < activity.length; i++) {
    if (activity[i].activity === "Control pressed") {
      pressedCTRL = true;
    }
    if (activity[i].activity === "c pressed" && pressedCTRL) {
      totalCopas += 1;
    }
    if (activity[i].activity === "Control released") {
      pressedCTRL = false;
    }
  }
  return totalCopas;
};

export const keyboardTracker = (isStart: boolean) => {
  const [activity, setActivity] = useState<TActivity[]>([]);

  useEffect(() => {
    function handleKeyDown(event: { key: string; }) {
      isStart && handleSetActivity(event.key + " pressed", setActivity, isStart);
    }
    function handleKeyUp(event: { key: string; }) {
      isStart && handleSetActivity(event.key + " released", setActivity, isStart);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isStart]);

  return activity
};

export const mouseTracker = (isStart: boolean) => {
  const [activity, setActivity] = useState<TActivity[]>([]);

  const handleMouseEnter = () => {
    isStart && handleSetActivity("mouseIn", setActivity, isStart);
  };

  const handleMouseLeave = () => {
    isStart && handleSetActivity("mouseOut", setActivity, isStart);
  };

  useEffect(() => {
    function handleMouseClick() {
      isStart && handleSetActivity("mouseClick", setActivity, isStart);
    }
    window.addEventListener("click", handleMouseClick);
    return () => {
      window.removeEventListener("click", handleMouseClick);
    };
  }, [isStart]);

  const MouseComponent = ({ children, className }: { children: React.ReactNode, className: string }) => (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );

  return [activity, MouseComponent]
};

export const pageTracker = (isStart: boolean) => {
  const [activity, setActivity] = useState<TActivity[]>([]);

  useEffect(() => {
    const handleBlur = () => {
      isStart && handleSetActivity("aplOut", setActivity, isStart);
    };
    const handleFocus = () => {
      isStart && handleSetActivity("aplIn", setActivity, isStart);
    };
    const handleVisibility = () => {
      if (isStart) {
        if (document.visibilityState === "visible") {
          handleSetActivity("pageIn", setActivity, isStart);
        } else if (document.visibilityState === "hidden") {
          handleSetActivity("pageOut", setActivity, isStart);
        }
      }
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isStart]);

  return activity
};

