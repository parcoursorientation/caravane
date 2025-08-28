"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, Info } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "destructive" | "default" | "warning";
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  variant = "destructive",
  icon,
}: ConfirmDialogProps) {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case "destructive":
        return <Trash2 className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "default":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case "destructive":
        return "destructive";
      case "warning":
        return "default";
      case "default":
        return "default";
      default:
        return "destructive";
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "default":
        return "";
      default:
        return "bg-red-600 hover:bg-red-700 text-white";
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <AlertDialogTitle className="text-lg font-semibold">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-gray-600 mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 sm:justify-end">
          <AlertDialogCancel className="mt-0">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={getConfirmButtonClass()}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook pour utiliser le dialogue de confirmation
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dialogProps, setDialogProps] = React.useState<Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>>({
    title: '',
    description: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    onConfirm: () => {},
    variant: 'destructive',
  });

  const confirm = (props: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>) => {
    return new Promise<boolean>((resolve) => {
      setDialogProps({
        ...props,
        onConfirm: () => {
          props.onConfirm();
          resolve(true);
          setIsOpen(false);
        },
      });
      setIsOpen(true);
    });
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      {...dialogProps}
    />
  );

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent,
    isOpen,
    setIsOpen,
  };
}