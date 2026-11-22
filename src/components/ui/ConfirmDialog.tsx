import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  preview?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  iconType?: 'warning' | 'info' | 'success';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  preview,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  iconType = 'warning',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
            isDestructive
              ? 'bg-brand-red-light text-brand-red'
              : iconType === 'warning'
              ? 'bg-marigold-light text-marigold-dark'
              : 'bg-mint text-primary'
          }`}
        >
          {isDestructive || iconType === 'warning' ? (
            <AlertTriangle className="w-6 h-6" />
          ) : iconType === 'info' ? (
            <Info className="w-6 h-6" />
          ) : (
            <CheckCircle2 className="w-6 h-6" />
          )}
        </div>

        <h3 className="font-heading text-lg font-bold text-app-text">{title}</h3>
        <p className="text-xs text-muted mt-1 leading-relaxed">{description}</p>

        {preview && (
          <div className="w-full mt-4 p-3 bg-cream rounded-xl border border-border text-left text-xs">
            {preview}
          </div>
        )}

        <div className="flex items-center gap-3 w-full mt-6">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? 'primary-red' : 'primary'}
            size="md"
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

