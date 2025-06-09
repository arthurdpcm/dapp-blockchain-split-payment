import { COLORS } from '../../../constants/colors';

import styled from 'styled-components';

export const Button = styled.button<{
  isMobile: boolean;
  isConnect: boolean;
  hasBorder: boolean;
  padding: 'large' | 'medium' | 'small';
}>`
  background: ${({ hasBorder }) => (hasBorder ? COLORS.oceanBlue : 'none')};
  color: ${({ hasBorder }) => (hasBorder ? COLORS.white : COLORS.oceanBlue)};
  border: ${({ hasBorder }) => (hasBorder ? '1.5px solid ' + COLORS.oceanBlue : 'none')};
  border-radius: 6px;
  padding: ${({ padding }) =>
    padding === 'large'
      ? '0.3rem 0.7rem'
      : padding === 'medium'
        ? '0.4rem 1.2rem'
        : '0.2rem 0.5rem'};
  font-weight: bold;
  cursor: pointer;
  font-size: ${({ isMobile }) => (isMobile ? '1.2rem' : '1.5rem')};
  //   min-width: ${({ isMobile }) => (isMobile ? 80 : 120)}px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ hasBorder }) => (hasBorder ? COLORS.oceanBlue : 'none')};
    color: ${({ hasBorder }) => (hasBorder ? COLORS.white : COLORS.oceanBlue)};
    border: ${({ hasBorder }) => (hasBorder ? '1.5px solid ' + COLORS.oceanBlue : 'none')};
    transform: scale(1.1);
    transition: all 0.2s;
  }
`;
