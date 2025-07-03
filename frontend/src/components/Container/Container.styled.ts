import styled from 'styled-components';
import { COLORS } from '../../constants/colors';

export const ContainerWrapper = styled.div`
  background: transparent;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  box-shadow: 0px 0px 24px rgba(26, 156, 156, 0.7);
  position: relative;
  display: flex;
  flex-direction: column;
  color: ${COLORS.lightGray};
  border: 1px solid ${COLORS.oceanBlue};

  @media (max-width: 768px) {
    padding: 1.5rem 1.2rem;
  }
`;

export const ContainerTitle = styled.h1`
  font-size: 1.75rem;
  color: ${COLORS.white};
  margin-bottom: 1.5rem;
  text-align: left;
  border-bottom: 2px solid ${COLORS.oceanBlue};
  padding-bottom: 0.75rem;
`;

export const ContainerBody = styled.div`
  width: 100%;
`;
