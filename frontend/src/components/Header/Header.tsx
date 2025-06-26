// Header.tsx
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { HeaderContainer, Title, Nav, StyledLink, LogoContainer, RightNav } from './Header.styled';
import Modal from '../Modal/Modal';
import Button from '../ui/Button/Button';
import useIsMobile from '../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../ui/LanguagePicker/LanguagePicker';

function abbreviateAddress(address: string) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { account, connect, disconnect } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

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
      <LogoContainer>
        <img src="/split-payment-removebg-preview.png" width={96} />
        <Title isMobile={isMobile}>{isMobile ? 'SP' : 'Split Payment'}</Title>
        <Nav isMobile={isMobile}>
          <StyledLink to="/" isActive={location.pathname === '/'} isMobile={isMobile}>
            {t('tax_monitor')}
          </StyledLink>
          <StyledLink
            to="/swap"
            isActive={location.pathname === '/swap'}
            isMobile={isMobile}
          >
            Swap
          </StyledLink>
        </Nav>
      </LogoContainer>

      <RightNav>
        <LanguagePicker />
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
            {t('connect_wallet')}
          </Button>
        )}
      </RightNav>
      <Modal open={modalOpen} onClose={handleModalClose} onConfirm={handleModalConfirm} />
    </HeaderContainer>
  );
};

export default Header;
