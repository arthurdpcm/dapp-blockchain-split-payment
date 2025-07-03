import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import { AppContainer, ContentWrapper } from './MainLayout.styled';

const MainLayout: React.FC = () => {
  return (
    <AppContainer>
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </AppContainer>
  );
};

export default MainLayout;
