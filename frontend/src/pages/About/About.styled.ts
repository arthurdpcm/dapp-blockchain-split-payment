import styled from 'styled-components';
import { COLORS } from '../../constants/colors';

export const AboutContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  color: ${COLORS.lightGray};
  background-color: rgba(1, 1, 1, 0.3);
  border: 1px solid ${COLORS.oceanBlue};
  border-radius: 16px;
  box-shadow: 0px 0px 24px rgba(26, 156, 156, 0.5);
`;

export const AboutTitle = styled.h1`
  color: ${COLORS.lightOceanBlue};
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`;

export const AboutSection = styled.section`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  color: ${COLORS.lightGray};
  border-bottom: 2px solid ${COLORS.lightOceanBlue};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.75rem;
`;

export const AboutText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: justify;
`;

export const TechList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const TechListItem = styled.li`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  &::before {
    content: '🔹';
    color: ${COLORS.oceanBlue};
  }
`;

export const AuthorInfo = styled.div`
  text-align: center;
  margin-top: 3rem;
  font-style: italic;
`;
