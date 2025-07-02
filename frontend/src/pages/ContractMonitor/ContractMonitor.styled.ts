import styled from 'styled-components';
import { COLORS } from '../../constants/colors';

export const ContractMonitorContainer = styled.div`
  background: 'transparent';
  max-width: 480px; /* A largura máxima continua específica da página */
  width: 100%;
  box-shadow: 0px 0px 24px rgb(26, 156, 156);
  position: relative;
  display: flex;
  flex-direction: column;
  color: ${COLORS.lightGray};
  border: ${COLORS.oceanBlue} 1px solid;
  @media (min-width: 1024px) {
    padding: 2rem 2.5rem;
    border-radius: 16px;
  }
  padding: 2rem;
  margin-top: 2rem; /* Apenas margem superior para espaçamento do header */
  margin-bottom: 2rem; /* Apenas margem inferior para espaçamento do fim da página */
`;

export const ContractMonitorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ContractMonitorTitle = styled.h1`
  font-size: 2rem;
  color: ${COLORS.lightOceanBlue};
  margin: 0;
`;

export const ContractMonitorSection = styled.section`
  margin-bottom: 2rem;
`;

export const ContractMonitorSectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${COLORS.lightOceanBlue};
  border-bottom: 2px solid ${COLORS.lightGray};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

export const BalanceList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const BalanceListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  font-size: 1.1rem;
  border-bottom: 1px solid ${COLORS.lightGray};

  &:last-child {
    border-bottom: none;
  }

  span:first-child {
    font-weight: bold;
  }
`;

export const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EventCard = styled.div`
  background-color: ${COLORS.darkGray};
  border: 1px solid ${COLORS.borderGray};
  border-left: 5px solid ${COLORS.lightOceanBlue};
  border-radius: 4px;
  padding: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
`;

export const EventHeader = styled.div`
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${COLORS.lightOceanBlue};
`;

export const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const EventArg = styled.div`
  word-break: break-all;
  color: ${COLORS.white};
  span {
    font-weight: bold;
    margin-right: 0.5rem;
    color: ${COLORS.oceanBlue};
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1rem;
`;

export const PageButton = styled.button`
  background-color: ${COLORS.oceanBlue};
  color: ${COLORS.white};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #157d7d;
  }

  &:disabled {
    background-color: ${COLORS.darkGray};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const PageInfo = styled.span`
  color: ${COLORS.lightGray};
  font-size: 1rem;
  font-weight: 500;
`;
