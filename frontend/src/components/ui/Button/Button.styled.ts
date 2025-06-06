import { COLORS } from '../../../constants/colors';

import styled from 'styled-components';

export const Button = styled.button<{
  isMobile: boolean;
  isConnect: boolean;
  hasBorder: boolean;
  padding: 'large' | 'medium' | 'small';
}>`
  background: ${({ hasBorder }) => (hasBorder ? COLORS.purple : 'none')};
  color: ${({ hasBorder }) => (hasBorder ? COLORS.white : COLORS.purple)};
  border: ${({ hasBorder }) => (hasBorder ? '1.5px solid ' + COLORS.purple : 'none')};
  border-radius: 6px;
  padding: ${({ padding }) =>
    padding === 'large'
      ? '0.3rem 0.7rem'
      : padding === 'medium'
        ? '0.4rem 1.2rem'
        : '0.2rem 0.5rem'};
  font-weight: bold;
  cursor: pointer;
  font-size: ${({ isMobile }) => (isMobile ? '0.95rem' : '1rem')};
  //   min-width: ${({ isMobile }) => (isMobile ? 80 : 120)}px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ hasBorder }) => (hasBorder ? COLORS.lightPurple : 'none')};
    color: ${({ hasBorder }) => (hasBorder ? COLORS.white : COLORS.purple)};
    border: ${({ hasBorder }) => (hasBorder ? '1.5px solid ' + COLORS.lightPurple : 'none')};
    transform: scale(1.05);
    transition: all 0.2s;
  }
`;
