import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const FirstLastSpan = styled.span`
  font-weight: 700;
`;

export const PoolHeader = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* Espaçamento entre o texto e o ícone */
  margin: 1.2rem 0 0.6rem;
  font-size: 1.8rem;
`;

export const ExternalLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  img {
    transition: transform 0.2s ease-in-out;
  }

  &:hover img {
    transform: scale(1.15);
  }
`;