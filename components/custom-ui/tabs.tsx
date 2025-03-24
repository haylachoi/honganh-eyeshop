"use client";
import { cn } from "@/lib/utils";
import React, {
  createContext,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  use,
  useEffect,
  useRef,
  useState,
} from "react";

type TabsContextProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  setTabs: Dispatch<SetStateAction<string[]>>;
  indexActiveTab: number;
  setIndexActiveTab: Dispatch<SetStateAction<number>>;
};

const TabContext = createContext<TabsContextProps>({
  activeTab: "",
  setActiveTab: () => {},
  tabs: [],
  setTabs: () => {},
  indexActiveTab: 0,
  setIndexActiveTab: () => {},
});

interface TabsProps {
  className?: string;
  children: React.ReactNode;
  defaultValue?: string;
}

export const Tabs = ({ className, children, defaultValue }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue ?? "");
  const [tabs, setTabs] = useState<string[]>([]);
  const [indexActiveTab, setIndexActiveTab] = useState(0);

  return (
    <div className={cn("", className)}>
      <TabContext.Provider
        value={{
          activeTab,
          setActiveTab,
          tabs,
          setTabs,
          indexActiveTab,
          setIndexActiveTab,
        }}
      >
        {children}
      </TabContext.Provider>
    </div>
  );
};

interface TabListProps {
  className?: string;
  ref?: React.RefObject<HTMLDivElement | null> | undefined;
  children: React.ReactNode;
}

export const TabList = ({ className, ref, children }: TabListProps) => {
  return (
    <div className={cn("flex gap-2", className)} ref={ref}>
      {children}
    </div>
  );
};

export const TabTrigger = ({
  className,
  activeClassName = "bg-primary",
  value,
  children,
}: {
  className?: string;
  activeClassName?: string;
  value: string;
  children: React.ReactNode;
}) => {
  const {
    activeTab,
    setActiveTab,
    tabs,
    setTabs,
    indexActiveTab,
    setIndexActiveTab,
  } = use(TabContext);
  // const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const isActive = activeTab === value;
  useEffect(() => {
    // if (!tabs.includes(value)) {
    //   setTabs((prev) => [...prev, value]);
    // }
    if (
      ref.current &&
      ref.current.parentNode?.firstChild === ref.current &&
      activeTab === ""
    ) {
      setActiveTab(value);
    }

    // return () => {
    //   setTabs((prev) => prev.filter((tab) => tab !== value));
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrigger: MouseEventHandler<HTMLDivElement> | undefined = () => {
    // if (isActive) return;
    setActiveTab(value);
    // setIndexActiveTab(tabs.indexOf(value));
  };

  // if (isPending) return <></>;

  return (
    <div
      className={cn("cursor-pointer", className, {
        [activeClassName]: isActive,
      })}
      ref={ref}
      onClick={handleTrigger}
    >
      <input
        className="peer hidden"
        type="checkbox"
        checked={isActive}
        readOnly
      />
      {children}
    </div>
  );
};

export const TabPanel = ({
  className,
  value,
  children,
  isHidden = false,
}: {
  className?: string;
  value: string;
  children: React.ReactNode;
  isHidden?: boolean;
}) => {
  const { activeTab } = use(TabContext);

  const active = activeTab === value;
  if (isHidden) {
    return (
      <div className={cn("", className, isHidden && !active && "hidden")}>
        {children}
      </div>
    );
  }
  return <div className={cn("", className)}>{active && children}</div>;
};
