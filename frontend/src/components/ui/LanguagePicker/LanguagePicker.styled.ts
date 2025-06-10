import { COLORS } from '@/constants/colors';
import styled from 'styled-components';

export const PickerWrapper = styled.div`
  position: relative;
  margin-left: 12px;
`;

export const PickerButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  background: ${COLORS.darkGray};
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
  min-width: 90px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DropdownButton = styled.button<{ selected: boolean; isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  width: 100%;
  padding: 6px;
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  font-size: ${({ isMobile }) => (isMobile ? '1.2rem' : '1.5rem')};
  color: ${({ selected }) => (selected ? COLORS.lightGray : COLORS.white)};
  background-color: ${({ selected }) => (selected ? COLORS.oceanBlue : COLORS.borderGray)};
  &:hover {
    background-color: ${COLORS.darkOceanBlue};
  }
`;
