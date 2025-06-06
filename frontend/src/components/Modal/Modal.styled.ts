import styled from 'styled-components';
import { COLORS } from '../../constants/colors';

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  min-width: 280px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
`;

export const ModalTitle = styled.h3`
  color: ${COLORS.purple};
  margin-bottom: 16px;
`;

export const ModalText = styled.p`
  color: ${COLORS.darkGray};
  margin-bottom: 24px;
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;
