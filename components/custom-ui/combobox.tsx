import { cn } from "@/lib/utils";
import {
  ActionDispatch,
  createContext,
  ReactNode,
  use,
  useEffect,
  useReducer,
  useRef,
} from "react";

type ComboboxState = {
  defaultValue?: string | null;
  isMultiSelect: boolean;
  isOpen: boolean;
  comboboxValues: string[];
  comboboxActiveValues: string[];
};

type ComboboxContextProps = ComboboxState & {
  dispatch: ActionDispatch<
    [
      action:
        | actionTypeOpen
        | actionTypeClose
        | actionTypeToggle
        | actionTypeSetValue
        | actionTypeSetActiveValue
        | actionTypeSetActiveValueAndClose
        | actionTypeSetValueAndActiveValue,
    ]
  >;
};

const ComboboxContext = createContext<ComboboxContextProps>({
  isMultiSelect: false,
  isOpen: false,
  comboboxValues: [],
  comboboxActiveValues: [],
  dispatch: () => {},
});

type actionTypeOpen = {
  type: "open";
};

type actionTypeClose = {
  type: "close";
};

type actionTypeToggle = {
  type: "toggle";
};

type actionTypeSetValue = {
  type: "setValue";
  payload: string;
};
type actionTypeSetActiveValue = {
  type: "setActiveValue";
  payload: string;
};
type actionTypeSetActiveValueAndClose = {
  type: "setActiveValueAndClose";
  payload: string;
};

type actionTypeSetValueAndActiveValue = {
  type: "setValueAndActiveValue";
  payload: {
    value: string;
    activeValue: string;
  };
};

const comboboxReducer = (
  state: ComboboxState,
  action:
    | actionTypeOpen
    | actionTypeClose
    | actionTypeToggle
    | actionTypeSetValue
    | actionTypeSetActiveValue
    | actionTypeSetActiveValueAndClose
    | actionTypeSetValueAndActiveValue,
) => {
  switch (action.type) {
    case "open":
      return {
        ...state,
        isOpen: true,
      };
    case "close":
      return {
        ...state,
        isOpen: false,
      };
    case "toggle":
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case "setValue":
      return {
        ...state,
        comboboxValues: [action.payload],
      };
    case "setActiveValue":
      return {
        ...state,
        comboboxActiveValues: !state.isMultiSelect
          ? [action.payload]
          : state.comboboxActiveValues.includes(action.payload)
            ? state.comboboxActiveValues.filter(
                (item) => item !== action.payload,
              )
            : [...state.comboboxActiveValues, action.payload],
      };
    case "setActiveValueAndClose":
      return {
        ...state,
        isOpen: false,
        comboboxActiveValues: !state.isMultiSelect
          ? [action.payload]
          : state.comboboxActiveValues.includes(action.payload)
            ? state.comboboxActiveValues.filter(
                (item) => item !== action.payload,
              )
            : [...state.comboboxActiveValues, action.payload],
      };
    case "setValueAndActiveValue":
      return {
        ...state,
        comboboxValues: [action.payload.value],
        comboboxActiveValues: !state.isMultiSelect
          ? [action.payload.activeValue]
          : state.comboboxActiveValues.includes(action.payload.activeValue)
            ? state.comboboxActiveValues.filter(
                (item) => item !== action.payload.activeValue,
              )
            : [...state.comboboxActiveValues, action.payload.activeValue],
      };
    default:
      return state;
  }
};

interface ComboboxProps {
  className?: string;
  children: ReactNode;
  defaultValue?: string | null;
  isMultiSelect?: boolean;
}

export const Combobox = ({
  className,
  children,
  defaultValue,
  isMultiSelect = false,
}: ComboboxProps) => {
  const [state, dispatch] = useReducer(comboboxReducer, {
    defaultValue,
    isMultiSelect,
    isOpen: false,
    comboboxValues: [],
    comboboxActiveValues: [],
  });

  const comboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        state.isOpen &&
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        dispatch({ type: "close" });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [state]);

  return (
    <div
      ref={comboboxRef}
      className={cn("relative w-max", className)}
      data-comboxbox
    >
      <ComboboxContext.Provider
        value={{
          ...state,
          dispatch,
        }}
      >
        {children}
      </ComboboxContext.Provider>
    </div>
  );
};

interface ComboboxTriggerProps {
  className?: string;
  children?: ReactNode;
}

export const ComboboxTrigger = ({
  className,
  children,
}: ComboboxTriggerProps) => {
  const { isOpen, dispatch } = use(ComboboxContext);

  return (
    <div className={cn("min-w-full cursor-pointer", className)}>
      <label className="inline-block w-full">
        <input
          style={{ display: "none" }}
          type="checkbox"
          checked={isOpen}
          onChange={() => dispatch({ type: "toggle" })}
        />
        <div>{children}</div>
      </label>
    </div>
  );
};

interface ComboboxSelectedProps {
  className?: string;
  defaultDisplayValue?: string;
  render: (value: string) => ReactNode;
}

export const ComboboxSelected = ({
  className,
  defaultDisplayValue,
  render,
}: ComboboxSelectedProps) => {
  const { comboboxActiveValues } = use(ComboboxContext);
  if (!className) {
    return (
      <>
        {render(
          comboboxActiveValues[0] ?? defaultDisplayValue ?? "click to select",
        )}
      </>
    );
  }
  return (
    <div className={cn("w-full", className)}>
      {render(
        comboboxActiveValues[0] ?? defaultDisplayValue ?? "click to select",
      )}
    </div>
  );
};

interface ComboboxListProps {
  className?: string;
  children: ReactNode;
}

export const ComboboxList = ({ className, children }: ComboboxListProps) => {
  const { isOpen } = use(ComboboxContext);
  const selfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selfRef.current) {
      const combobox = selfRef.current.closest(
        "[data-comboxbox]",
      ) as HTMLDivElement | null;

      if (combobox) {
        const maxWidth =
          Math.max(selfRef.current.offsetWidth, combobox.offsetWidth) + 1;

        selfRef.current.style.width = `${maxWidth}px`;
        combobox.style.width = `${maxWidth}px`;
      }
    }
  }, []);

  return (
    <div
      className={cn(
        "absolute left-0 top-full z-10 shadow-md bg-background text-foreground border transition-all duration-300 ease-out transform-gpu opacity-0 scale-y-95 origin-top pointer-events-none",
        isOpen && "opacity-100 scale-y-100 pointer-events-auto",
        className,
      )}
      ref={selfRef}
      data-comboboxlist
    >
      {children}
    </div>
  );
};

interface ComboboxItemProps {
  className?: string;
  value: string;
  children: ReactNode;
}

export const ComboboxItem = ({
  className,
  value,
  children,
}: ComboboxItemProps) => {
  const { defaultValue, dispatch } = use(ComboboxContext);

  useEffect(() => {
    if (defaultValue === value) {
      dispatch({
        type: "setValueAndActiveValue",
        payload: { value, activeValue: value },
      });
      return;
    }
    dispatch({ type: "setValue", payload: value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = () => {
    dispatch({ type: "setActiveValueAndClose", payload: value });
  };
  return (
    <div
      className={cn("min-w-max cursor-pointer", className)}
      onClick={handleSelect}
    >
      {children}
    </div>
  );
};
