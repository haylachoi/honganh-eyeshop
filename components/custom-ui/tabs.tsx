"use client";
import { cn } from "@/lib/utils";
import React, {
  createContext,
  MouseEventHandler,
  startTransition,
  use,
  useEffect,
  useRef,
  useState,
} from "react";

type TabsContextProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: {
    current: string[];
    prev: string[];
  };
  setTabs: React.Dispatch<
    React.SetStateAction<{
      current: string[];
      prev: string[];
    }>
  >;
};

const TabContext = createContext<TabsContextProps>({
  activeTab: "",
  setActiveTab: () => {},
  tabs: {
    current: [],
    prev: [],
  },
  setTabs: () => {},
});

interface TabsProps {
  className?: string;
  children: React.ReactNode;
  defaultValue?: string;
}

export const Tabs = ({ className, children, defaultValue }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue ?? "");
  const [tabs, setTabs] = useState<{
    current: string[];
    prev: string[];
  }>({
    current: [],
    prev: [],
  });

  useEffect(() => {
    setTabs((tabs) => ({
      current: tabs.current,
      prev: tabs.prev.length === tabs.current.length ? tabs.prev : tabs.current,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs.current]);

  useEffect(() => {
    if (
      tabs.current.length < tabs.prev.length &&
      activeTab &&
      !tabs.current.includes(activeTab)
    ) {
      const prevTabIndex = tabs.prev.findIndex((tab) => tab === activeTab);
      const newActiveTab =
        tabs.current[prevTabIndex] ||
        tabs.current[prevTabIndex - 1] ||
        tabs.current[tabs.current.length - 1] ||
        tabs.current[0];

      if (newActiveTab) {
        startTransition(() => {
          setActiveTab(newActiveTab);
        });
      }
    }
  }, [tabs.current.length, tabs.prev.length, activeTab, tabs]);

  return (
    <div className={cn("", className)}>
      <TabContext.Provider
        value={{
          activeTab,
          setActiveTab,
          tabs,
          setTabs,
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

export const TabList = ({ className, children }: TabListProps) => {
  const tabs = React.Children.toArray(children);
  const originalChildrenRef = useRef<React.ReactNode[]>([]);

  useEffect(() => {
    if (originalChildrenRef.current.length === 0) {
      originalChildrenRef.current = React.Children.toArray(children);
    }
  }, [children]);

  return (
    <div className={cn("flex gap-2", className)}>
      {tabs.map((child, index) => {
        return <div key={index}>{child}</div>;
      })}
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
  const { activeTab, setActiveTab, setTabs } = use(TabContext);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = activeTab === value;

  useEffect(() => {
    if (
      ref.current &&
      ref.current.parentNode?.firstChild === ref.current &&
      activeTab === ""
    ) {
      setActiveTab(value);
    }

    setTabs((tabs) => {
      if (!tabs.current.includes(value)) {
        return {
          ...tabs,
          current: [...tabs.current, value],
        };
      }
      return tabs;
    });

    return () => {
      setTabs((tabs) => ({
        ...tabs,
        current: tabs.current.filter((tab) => tab !== value),
      }));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrigger: MouseEventHandler<HTMLDivElement> = () => {
    setActiveTab(value);
  };

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
