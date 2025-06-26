import Button from '../ui/Button/Button';
import { useTranslation } from 'react-i18next';
import {
  ModalButtonContainer,
  ModalContainer,
  ModalContent,
  ModalText,
  ModalTitle,
} from './Modal.styled';

export default function Modal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();

  if (!open) return null;
  return (
    <ModalContainer>
      <ModalContent>
        <ModalTitle>{t("disconnect_wallet_modal_title")}</ModalTitle>
        <ModalText>{t("disconnect_wallet_modal_question")}</ModalText>
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
