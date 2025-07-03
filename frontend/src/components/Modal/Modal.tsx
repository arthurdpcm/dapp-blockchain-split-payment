import Button from '../ui/Button/Button';
import { useTranslation } from 'react-i18next';
import {
  ModalButtonContainer,
  ModalContainer,
  ModalContent,
  ModalText,
  ModalTitle,
} from './Modal.styled';
import React from 'react';

export default function Modal({
  open,
  onConfirm,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <ModalContainer onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <ModalText>{children}</ModalText>
        <ModalButtonContainer>
          <Button
            onClick={onClose}
            isMobile={false}
            isConnect={false}
            hasBorder={true}
            padding="medium"
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={onConfirm}
            isMobile={false}
            isConnect={false}
            hasBorder={true}
            padding="medium"
          >
            {t('confirm') || 'Confirm'}
          </Button>
        </ModalButtonContainer>
      </ModalContent>
    </ModalContainer>
  );
}
