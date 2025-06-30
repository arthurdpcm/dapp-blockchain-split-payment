import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { COLORS } from '../../constants/colors';

export const HeaderContainer = styled.header<{ isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ isMobile }) => (isMobile ? '0.75rem 1rem' : '1rem 2rem')};
  /* background: ${COLORS.darkGray}; */
  /* border-bottom: 2px solid ${COLORS.oceanBlue}; */
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Title = styled.div<{ isMobile: boolean }>`
  font-weight: semibold;
  font-size: ${({ isMobile }) => (isMobile ? '1.2rem' : '2rem')};
  color: ${COLORS.lightOceanBlue};
  transition: all 0.2s;
`;

export const Nav = styled.nav<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '1rem' : '1.5rem')};
  align-items: center;
`;

export const StyledLink = styled(Link)<{ isActive: boolean; isMobile: boolean }>`
  color: ${({ isActive }) => (isActive ? COLORS.oceanBlue : '#fff')};
  text-decoration: none;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: ${({ isActive }) => (isActive ? 'rgba(26, 156, 156,0.08)' : 'transparent')};
  transition: background 0.2s;
  font-size: ${({ isMobile }) => (isMobile ? '1.2rem' : '1.5rem')};
  &:hover {
    color: ${COLORS.lightOceanBlue};
  }
`;

export const RightNav = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
`;
