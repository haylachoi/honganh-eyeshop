"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

type DialogContextType = {
  showDialog: (options: {
    onConfirm: () => void;
    title?: string;
    description?: string;
  }) => void;
  closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType>({
  showDialog: () => {},
  closeDialog: () => {},
});

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const showDialog = ({
    title = "Thận trọng",
    description = "Bạn có chắc muốn xóa thông tin này không?",
    onConfirm,
  }: {
    onConfirm: () => void;
    title?: string;
    description?: string;
  }) => {
    setDialogContent({ title, description, onConfirm });
    setOpen(true);
  };

  const closeDialog = () => setOpen(false);

  return (
    <DialogContext.Provider value={{ showDialog, closeDialog }}>
      {children}

      {/* Global Alert Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              asChild
              onClick={() => {
                dialogContent.onConfirm?.();
                closeDialog();
              }}
            >
              <Button variant="destructive">Đồng ý</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContext.Provider>
  );
};

// ✅ Hook để sử dụng Dialog
export const useGlobalAlertDialog = () => useContext(DialogContext);
