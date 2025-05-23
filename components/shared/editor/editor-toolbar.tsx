"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { cn, compressImage } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import { type Level } from "@tiptap/extension-heading";
import { type ColorResult, SketchPicker } from "react-color";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  // ImageIcon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  ListCollapseIcon,
  LucideIcon,
  MinusIcon,
  PlusIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  Undo2Icon,
  ImageUp,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useImageSourceStore } from "@/hooks/use-image-source";

// type section = {
//   label: string;
//   icon: LucideIcon;
//   onClick: () => void;
//   isActive?: boolean;
// };

const getSections = (editor: Editor) => {
  return [
    [
      {
        label: "Undo",
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        icon: Redo2Icon,
        onClick: () => editor?.chain().focus().redo().run(),
      },
    ],
    [
      {
        label: "Bold",
        icon: BoldIcon,
        isActive: editor?.isActive("bold"),
        onClick: () => editor?.chain().focus().toggleBold().run(),
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        isActive: editor?.isActive("italic"),
        onClick: () => editor?.chain().focus().toggleItalic().run(),
      },
      // {
      //   label: "Underline",
      //   icon: UnderlineIcon,
      //   isActive: editor?.isActive("underline"),
      //   onClick: () => editor?.chain().focus().toggleUnderline().run(),
      // },
    ],
    [
      {
        label: "Remove Formatting",
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      },
    ],
  ];
};

const HeadingLevelButton = ({ editor }: { editor: Editor }) => {
  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
    { label: "Heading 4", value: 4, fontSize: "16px" },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level < 5; level++) {
      if (editor?.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }

    return "Normal text";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
        >
          <span className="truncate">{getCurrentHeading()}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize }) => (
          <li key={value}>
            <DropdownMenuItem asChild>
              <button
                type="button"
                className={cn(
                  "w-full cursor-pointer flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                  value === 0 &&
                    editor?.isActive("heading") &&
                    editor?.isActive("heading", { level: value }) &&
                    "bg-neutral-200/80",
                )}
                style={{ fontSize }}
                onClick={() => {
                  if (value === 0) {
                    editor?.chain().focus().setParagraph().run();
                  } else {
                    editor
                      ?.chain()
                      .focus()
                      .toggleHeading({ level: value as Level })
                      .run();
                    editor?.chain().focus().setFontSize(`${fontSize}`).run();
                  }
                }}
              >
                <span className="">{label}</span>
              </button>
            </DropdownMenuItem>
          </li>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontSizeButton = ({ editor }: { editor: Editor }) => {
  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";

  const [fontSize, setFontSize] = React.useState(currentFontSize);
  const [inputValue, setInputValue] = React.useState(fontSize);
  const [isEditing, setIsEditing] = React.useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    updateFontSize(newSize.toString());
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button
        type="button"
        onClick={decrement}
        className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
      >
        <MinusIcon className="size-4" />
      </button>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsEditing(true);
            setFontSize(currentFontSize);
          }}
          className="h-7 w-10 text-sm text-center border border-neutral-400 hover:bg-neutral-200/80 rounded-sm bg-transparent cursor-text"
        >
          {currentFontSize}
        </button>
      )}
      <button
        type="button"
        onClick={increment}
        className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}
export const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-sm h-7 min-w-7 cursor-pointer flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
        isActive && "bg-neutral-200/80",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

const AlignButton = ({ editor }: { editor: Editor }) => {
  const alignments = [
    {
      label: "Align Left",
      value: "left",
      icon: AlignLeftIcon,
    },
    {
      label: "Align Center",
      value: "center",
      icon: AlignCenterIcon,
    },
    {
      label: "Align Right",
      value: "right",
      icon: AlignRightIcon,
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: AlignJustifyIcon,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <AlignLeftIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              editor?.isActive({ textAlign: value }) && "bg-neutral-200/80",
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextColorButton = ({ editor }: { editor: Editor }) => {
  const value = editor?.getAttributes("textStyle").color || "#000000";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <span className="text-xs">A</span>
          <div className="h-0.5 w-full" style={{ backgroundColor: value }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        <SketchPicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ListButton = ({ editor }: { editor: Editor }) => {
  const lists = [
    {
      label: "Bullet List",
      icon: ListIcon,
      isActive: () => editor?.isActive("bulletList"),
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: ListOrderedIcon,
      isActive: () => editor?.isActive("orderedList"),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <ListIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lists.map(({ label, icon: Icon, isActive, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              isActive() && "bg-neutral-200/80",
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LinkButton = ({ editor }: { editor: Editor }) => {
  const [value, setValue] = React.useState("");

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").toggleLink({ href }).run();
    setValue("");
  };

  const onRemove = () => {
    // editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    editor?.commands.unsetLink();
    setValue("");
  };

  return (
    <div className="">
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) {
            setValue(editor?.getAttributes("link").href || "");
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
            <Link2Icon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
          <Input
            placeholder="https://example.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={() => onChange(value)}>Apply</Button>
          <Button onClick={() => onRemove()}>Remove</Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ImageFromDiskButton = ({ editor }: { editor: Editor }) => {
  const addImage = useImageSourceStore((state) => state.addItem);
  const images = useImageSourceStore((state) => state.imageSources);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = await compressImage(e.target.files[0]);
    const url = URL.createObjectURL(file);

    addImage({
      fakeUrl: url,
      file,
    });

    editor.chain().focus().setImage({ src: url, alt: file.name }).run();
  };

  React.useEffect(() => {
    return () => {
      images.forEach(({ fakeUrl }) => URL.revokeObjectURL(fakeUrl));
    };
  }, [images]);

  return (
    <div className="">
      <label>
        <input
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <ImageUp className="size-4" />
      </label>
    </div>
  );
};

// const ImageButton = ({ editor }: { editor: Editor }) => {
//   const [value, setValue] = React.useState("");
//   const onChange = (src: string) => {
//     editor?.chain().focus().setImage({ src }).run();
//     setValue("");
//   };
//
//   return (
//     <div className="">
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
//             <ImageIcon className="size-4" />
//           </button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
//           <Input
//             placeholder="Image URL"
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//           />
//           <Button onClick={() => onChange(value)}>Apply</Button>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// };

const LineHeightButton = ({ editor }: { editor: Editor }) => {
  const lineHeights = [
    {
      label: "Default",
      value: "normal",
    },
    {
      label: "Single",
      value: "1",
    },
    {
      label: "1.15",
      value: "1.15",
    },
    {
      label: "1.5",
      value: "1.5",
    },
    {
      label: "Double",
      value: "2",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <ListCollapseIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lineHeights.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => editor?.chain().focus().setLineHeight(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              editor?.getAttributes("paragraph").lineHeight === value &&
                "bg-neutral-200/80",
            )}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const EditorToolbar = ({ editor }: { editor: Editor }) => {
  const sections = getSections(editor);
  return (
    <div className="sticky top-1 z-10 bg-secondary px-2.5 py-0.5 min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <HeadingLevelButton editor={editor} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FontSizeButton editor={editor} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <AlignButton editor={editor} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <LineHeightButton editor={editor} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <TextColorButton editor={editor} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <ListButton editor={editor} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <LinkButton editor={editor} />
      {/* <ImageButton editor={editor} /> */}
      <ImageFromDiskButton editor={editor} />
      {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
    </div>
  );
};

export default EditorToolbar;
