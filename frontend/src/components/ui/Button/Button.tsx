import React from 'react';
import { Button as ButtonStyled } from './Button.styled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  isMobile: boolean;
  isConnect: boolean;
  hasBorder: boolean;
  padding: 'large' | 'medium' | 'small';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  isMobile,
  isConnect,
  hasBorder,
  padding,
  children,
  ...props
}) => {
  return (
    <ButtonStyled
      onClick={onClick}
      isMobile={isMobile}
      isConnect={isConnect}
      hasBorder={hasBorder}
      padding={padding}
      {...props}
    >
      {children}
    </ButtonStyled>
  );
};

export default Button;
