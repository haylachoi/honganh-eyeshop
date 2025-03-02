import { cn } from "@/lib/utils";

export const DropdownTrigger = ({
  className,
  level = "",
  children,
  checked,
}: {
  className?: string;
  level?: string;
  children: React.ReactNode;
  checked?: boolean;
}) => {
  return (
    <label className={cn("cursor-pointer", className)}>
      <input
        className="hidden peer"
        type="checkbox"
        data-dropdown-trigger-level={level}
        defaultChecked={checked}
      />
      {children}
    </label>
  );
};

export const DropdownTriggerGroup = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "peer w-full flex justify-between items-center gap-x-12",
        className,
      )}
    >
      {children}
    </div>
  );
};

const classlevel1 =
  "has-[[data-dropdown-trigger-level='1']:checked]:grid-rows-[auto_1fr]";
const classlevel2 =
  "has-[[data-dropdown-trigger-level='2']:checked]:grid-rows-[auto_1fr]";
const classlevel3 =
  "has-[[data-dropdown-trigger-level='3']:checked]:grid-rows-[auto_1fr]";
const classlevel4 =
  "has-[[data-dropdown-trigger-level='4']:checked]:grid-rows-[auto_1fr]";

// order: DropdownTrigger must be child of Dropdown. Default Order: Dropdown > DropdownTriggerGroup > DropdownTrigger. if other order, add level to trigger
export const Dropdown = ({
  className,
  level,
  children,
}: {
  className?: string;
  level?: string;
  children: React.ReactNode;
}) => {
  let classlevel = "";
  switch (level) {
    case "1":
      classlevel = classlevel1;
      break;
    case "2":
      classlevel = classlevel2;
      break;
    case "3":
      classlevel = classlevel3;
      break;
    case "4":
      classlevel = classlevel4;
      break;
    default:
      classlevel = "";
      break;
  }
  return (
    <div
      className={cn(
        `group grid grid-rows-[auto_0fr] has-[>*>*>input[data-dropdown-trigger-level]:checked]:grid-rows-[auto_1fr] transition-all duration-300`,
        className,
        classlevel,
      )}
    >
      {children}
    </div>
  );
};

export const DropdownContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <ul className={cn("overflow-hidden", className)}>{children}</ul>;
};
