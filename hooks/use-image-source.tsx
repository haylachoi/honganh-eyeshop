import { imageSourceSchema } from "@/features/blogs/blog.validators";
import { z } from "zod";
import { create } from "zustand";

type ItemType = z.infer<typeof imageSourceSchema>;

interface UseImageSourcesProps {
  imageSources: ItemType[];
  setItems: (items: ItemType[]) => void;
  addItem: (item: ItemType) => void;
}
// todo: clean up when unmount editor
export const useImageSourceStore = create<UseImageSourcesProps>((set) => ({
  imageSources: [],
  setItems: (items) => set((state) => ({ ...state, imageSources: items })),
  addItem: (item) =>
    set((state) => ({ ...state, imageSources: [...state.imageSources, item] })),
}));
