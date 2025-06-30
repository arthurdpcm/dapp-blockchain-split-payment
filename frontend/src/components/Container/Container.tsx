import React from 'react';
import {
  ContainerWrapper,
  ContainerTitle,
  ContainerBody,
} from './Container.styled';

interface ContainerProps {
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Container: React.FC<ContainerProps> = ({
  title,
  children,
  maxWidth = '800px',
}) => {
  return (
    <ContainerWrapper style={{ maxWidth }}>
      <ContainerTitle>{title}</ContainerTitle>
      <ContainerBody>{children}</ContainerBody>
    </ContainerWrapper>
  );
};

export default Container;