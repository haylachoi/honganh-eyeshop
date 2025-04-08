"use client";

import { cn } from "@/lib/utils";
import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface AccordionContextType {
  activeValue: string;
  handleToggle: (value: string) => void;
}

interface AccordionItemContextType {
  value: string;
}

const AccordionContext = createContext<AccordionContextType>({
  activeValue: "",
  handleToggle: () => {},
});
const AccordionItemContext = createContext<
  AccordionItemContextType | undefined
>(undefined);

interface AccordionProps {
  className?: string;
  children: ReactNode;
  activeValue?: string;
  defaultActiveValue?: string;
  onChange?: (value: string | null) => void;
}

export const Accordion = ({
  className,
  children,
  activeValue,
  defaultActiveValue,
  onChange,
}: AccordionProps) => {
  const [internalActive, setInternalActive] = useState<string>(
    defaultActiveValue || "",
  );

  useEffect(() => {
    if (defaultActiveValue) {
      setInternalActive(defaultActiveValue);
    }
  }, [defaultActiveValue]);

  const active = activeValue !== undefined ? activeValue : internalActive;
  const handleToggle = (value: string) => {
    if (onChange) {
      onChange(value === active ? null : value);
    } else {
      setInternalActive(value === active ? "" : value);
    }
  };

  return (
    <AccordionContext.Provider value={{ activeValue: active, handleToggle }}>
      <div className={cn("", className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  className?: string;
  children: ReactNode;
  value: string;
}

export const AccordionItem = ({
  className,
  value,
  children,
}: AccordionItemProps) => {
  const accordionContext = useContext(AccordionContext);
  const { activeValue } = accordionContext;
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        className={cn(
          "grid grid-rows-[auto_0fr] transition-all",
          activeValue === value && "grid-rows-[auto_1fr]",
          className,
        )}
        data-accordion-active={activeValue === value}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

interface AccordionTriggerProps {
  className?: string;
  children: ReactNode;
}

export const AccordionTrigger = ({
  className,
  children,
}: AccordionTriggerProps) => {
  const accordionContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);

  if (!accordionContext || !itemContext) {
    throw new Error("AccordionTrigger must be used within an AccordionItem");
  }

  const { handleToggle } = accordionContext;
  const { value } = itemContext;

  return (
    <button className={cn("", className)} onClick={() => handleToggle(value)}>
      {children}
    </button>
  );
};

interface AccordionContentProps {
  className?: string;
  children: ReactNode;
}

export const AccordionContent = ({
  className,
  children,
}: AccordionContentProps) => {
  const accordionContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);

  if (!accordionContext || !itemContext) {
    throw new Error("AccordionContent must be used within an AccordionItem");
  }

  // const { activeValue } = accordionContext;
  // const { value } = itemContext;

  return <div className={cn("overflow-hidden", className)}>{children}</div>;
};
