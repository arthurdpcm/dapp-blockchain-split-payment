// Header.tsx
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { HeaderContainer, Title, Nav, StyledLink } from './Header.styled';
import Modal from '../Modal/Modal';
import Button from '../ui/Button/Button';
import useIsMobile from '../../hooks/useIsMobile';

function abbreviateAddress(address: string) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { account, connect, disconnect } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddressClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalConfirm = () => {
    disconnect();
    setModalOpen(false);
  };

  return (
    <HeaderContainer isMobile={isMobile}>
      <Title isMobile={isMobile}>{isMobile ? 'SP' : 'Split Payment'}</Title>
      <Nav isMobile={isMobile}>
        <StyledLink to="/" isActive={location.pathname === '/'} isMobile={isMobile}>
          Tax Monitor
        </StyledLink>
        <StyledLink to="/brl-swap" isActive={location.pathname === '/brl-swap'} isMobile={isMobile}>
          BRL Swap
        </StyledLink>
        {account ? (
          <Button
            onClick={handleAddressClick}
            isMobile={isMobile}
            isConnect={!!account}
            hasBorder={true}
            padding="large"
          >
            {abbreviateAddress(account)}
          </Button>
        ) : (
          <Button
            onClick={connect}
            isMobile={isMobile}
            isConnect={!!account}
            hasBorder={true}
            padding="large"
          >
            Connect Wallet
          </Button>
        )}
      </Nav>
      <Modal open={modalOpen} onClose={handleModalClose} onConfirm={handleModalConfirm} />
    </HeaderContainer>
  );
};

export default Header;
