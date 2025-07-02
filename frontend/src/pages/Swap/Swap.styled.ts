import styled from 'styled-components';
import { COLORS } from '../../constants/colors';

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
  transition: transform 0.2s;
  &:disabled {
    background: #23272F;
    color: #aaa;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: ${COLORS.darkOceanBlue};
    transform: scale(1.02);
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

// export const InfoBar = styled.div`
//   background: #23272F;
//   color: #FF4D4F;
//   border-radius: 8px;
//   padding: 0.7rem 1rem;
//   font-size: 1rem;
//   margin-top: 0.7rem;
//   display: flex;
//   align-items: center;
//   gap: 0.7rem;
// `;

export const InfoBar = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(255, 165, 0, 0.1);
  border: 1px solid orange;
  border-radius: 8px;
  color: #fff;
  text-align: center;
`;

export const FeeDetails = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #1e293b;
  border-radius: 8px;
  border: 1px solid #334155;
`;

export const FeeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #cbd5e1;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  span:last-child {
    font-weight: 600;
    color: #fff;
  }
`;

export const EstimateGasButton = styled.button`
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
  transition: transform 0.2s;
  &:disabled {
    background: #23272F;
    color: #aaa;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: ${COLORS.darkOceanBlue};
    transform: scale(1.02);
  }
`