import Button from '../ui/Button/Button';

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
  if (!open) return null;
  return (
    <ModalContainer>
      <ModalContent>
        <ModalTitle>Desconectar carteira?</ModalTitle>
        <ModalText>Tem certeza que deseja desvincular a carteira?</ModalText>
        <ModalButtonContainer>
          <Button
            onClick={onClose}
            isMobile={false}
            isConnect={false}
            hasBorder={true}
            padding="medium"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            isMobile={false}
            isConnect={false}
            hasBorder={true}
            padding="medium"
          >
            Desvincular
          </Button>
        </ModalButtonContainer>
      </ModalContent>
    </ModalContainer>
  );
}
