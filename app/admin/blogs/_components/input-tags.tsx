import { slugifyVn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export const TagInput = ({ value, onChange, placeholder }: TagInputProps) => {
  const [input, setInput] = useState("");

  const handleAddTag = () => {
    const trimmed = slugifyVn(input.trim());
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Backspace" && input === "") {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <div className="flex flex-wrap gap-2 border p-2 rounded-md">
      {value.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-full text-sm"
        >
          {tag}
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => removeTag(index)}
          >
            <X size={14} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[100px] focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};
