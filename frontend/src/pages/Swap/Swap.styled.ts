import styled from 'styled-components';
import { COLORS } from '../../constants/colors';

export const Container = styled.div`
  background: 'transparent';
  color: #333;
  border-radius: 12px;
  padding: 1.5rem 1.2rem;
  margin: 4.5rem auto 0 auto;
  max-width: 380px;
  width: 100%;
  box-shadow: 0px 0px 24px rgb(26, 156, 156);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: box-shadow 0.3s;
  color: ${COLORS.lightGray};
  border: ${COLORS.oceanBlue} 1px solid;

  @media (min-width: 1024px) {
    max-width: 480px;
    padding: 2rem 2.5rem;
    border-radius: 16px;
  }
`;

export const SwapBox = styled.div`
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;

`;

export const BoxLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const BoxLabel = styled.div`
  color: ${COLORS.lightGray};
  font-size: 1rem;
  margin-bottom: 0.2rem;
`;

export const BoxInput = styled.input`
  background: transparent;
  border: 1px solid ${COLORS.oceanBlue};
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  color: ${COLORS.white};
  font-size: 2.2rem;
  font-weight: 600;
  outline: none;
  width: 180px;
  margin-bottom: 0.2rem;

  &::placeholder {
    color: ${COLORS.white};
    font-weight: 400;
  }
  &:focus {
    border-color: ${COLORS.lightOceanBlue};
    box-shadow: inset 0 0 5px ${COLORS.lightOceanBlue};
  }
`;

export const BoxValue = styled.div`
  color: ${COLORS.lightGray};
  font-size: 0.95rem;
`;

export const BoxRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
`;

export const TokenSelector = styled.select`
  background: #23272F;
  color: ${COLORS.lightGray};
  border: 1px solid ${COLORS.oceanBlue};
  border-radius: 8px;
  padding: 0.3rem 0.8rem;
  font-size: 1rem;
  font-weight: 500;

`;

export const TokenImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

export const TokenBalance = styled.div`
  color: #FF4D4F;
  font-size: 0.9rem;
  margin-top: 0.2rem;
`;

export const ArrowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -0.5rem 0;
`;

export const SwapButton = styled.button`
  width: 100%;
  background: ${COLORS.oceanBlue};
  color: ${COLORS.white};
  border: none;
  border-radius: 12px;
  padding: 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  &:disabled {
    background: #23272F;
    color: #aaa;
    cursor: not-allowed;
  }
`;

export const RateInfo = styled.div`
  color: ${COLORS.lightGray};
  font-size: 0.95rem;
  margin: 0.5rem 0 0.2rem 0;
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

export const InfoBar = styled.div`
  background: #23272F;
  color: #FF4D4F;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  margin-top: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

export const Title = styled.h1`
  color: ${COLORS.white};
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }
  @media (max-width: 400px) {
    font-size: 1.3rem;
    margin-bottom: 0.6rem;
  }
  @media (max-width: 300px) {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;