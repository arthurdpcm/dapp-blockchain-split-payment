// TaxMonitor.styled.js
import styled from 'styled-components';
import { COLORS } from '../../constants/colors';

export const TaxMonitorContainer = styled.div`
  background: #f4f4f7;
  color: #333;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.08);
  width: 95%;
  max-width: 480px;
  margin: 2rem auto;
  position: relative;
  transition: all 0.3s ease-in-out;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    width: fit-content;
    max-width: none;
    margin: 3rem auto;
    padding: 2.5rem 3rem;
    border-radius: 16px;
  }
`;

export const TaxMonitorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const TaxMonitorDescription = styled.p`
  font-size: 0.9rem;
  margin: 0;
`;

export const TaxMonitorTitle = styled.h2`
  color: ${COLORS.purple};
  margin: 0;
  font-size: 1.1rem;
`;

export const TaxMonitorRefreshBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
`;

export const TaxMonitorTotal = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${COLORS.purple};
  margin: 0.2rem 0;
`;

export const TaxMonitorDivider = styled.div`
  border-top: 1px solid #e0e0e0;
  padding-top: 0.5rem;
`;

export const TaxMonitorRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 0.9rem;
`;

export const TaxMonitorDetailTitle = styled.h3`
  font-weight: 600;
  margin: 1.2rem 0 0.6rem;
`;

// Responsivo: se quiser deixar 2 colunas lado a lado
export const TaxMonitorResponsiveContainer = styled(TaxMonitorContainer)`
  @media (min-width: 1280px) {
    flex-direction: row;
    gap: 3rem;
    justify-content: center;
    align-items: flex-start;

    .tax-monitor-left,
    .tax-monitor-right {
      flex: 1;
      max-width: 400px;
    }
  }
`;
