// TaxMonitor.styled.js
import styled from 'styled-components';
import { COLORS } from '../../constants/colors';

export const TaxMonitorContainer = styled.div`
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
    max-width: 600px;
    padding: 2rem 2.5rem;
    margin-top: 5.5rem;
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
  font-size: 1.2rem;
 
`;

export const TaxMonitorTitle = styled.h1`
  color: ${COLORS.oceanBlue};
  font-weight: 500;
  font-size: 2rem;
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
  font-size: 1.2rem;
  font-weight: bold;
  color: ${COLORS.oceanBlue};
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
  font-size: 1.1rem;
  padding: 0 8px;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(26, 156, 156, 0.08);
    cursor: pointer;
    transform: scale(1.05);
  }
`;

export const TaxMonitorDetailTitle = styled.h2`
  font-weight: 600;
  margin: 1rem 0 0.6rem;
`;

export const TaxMonitorTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
`;

export const TaxMonitorTableHead = styled.thead``;

export const TaxMonitorTableHeader = styled.th`
  text-align: left;
  padding: 6px 8px;
  font-weight: 600;
  font-size: 1.2rem;
  color: ${COLORS.oceanBlue};
  background: rgba(26,156,156,0.08);
  &:first-child {
    border-radius: 6px 0 0 6px;
  }
  &:last-child {
    text-align: right;
    border-radius: 0 6px 6px 0;
  }
`;

export const TaxMonitorTableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  &:hover {
    background-color: rgba(26, 156, 156, 0.08);
    cursor: pointer;
    transform: scale(1.05);
  }
`;

export const TaxMonitorTableCell = styled.td`
  padding: 6px 8px;
  font-weight: 500;
  &:last-child {
    text-align: right;
  }
`;
