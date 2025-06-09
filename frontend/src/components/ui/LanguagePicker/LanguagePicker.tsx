import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PickerWrapper, PickerButton, Dropdown, DropdownButton } from './LanguagePicker.styled';
import useIsMobile from '@/hooks/useIsMobile';

const langOptions = [
  { code: 'pt', label: 'Português', img: '/brazil.svg' },
  { code: 'en', label: 'English', img: '/usa.svg' },
];

const LanguagePicker: React.FC = () => {
  const { i18n } = useTranslation();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const currentLang = langOptions.find(l => l.code === i18n.language) || langOptions[0];
  const isMobile = useIsMobile();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    }
    if (showLangDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangDropdown]);

  return (
    <PickerWrapper ref={langRef}>
      <PickerButton
        onClick={() => setShowLangDropdown(v => !v)}
        aria-label={currentLang.label}
      >
        <img src={currentLang.img} alt={currentLang.label} width={28} />
      </PickerButton>
      {showLangDropdown && (
        <Dropdown>
          {langOptions.map(opt => (
            <DropdownButton
              key={opt.code}
              onClick={() => { i18n.changeLanguage(opt.code); setShowLangDropdown(false); }}
              selected={i18n.language === opt.code}
              aria-label={opt.label}
              isMobile={isMobile}
            >
              <img src={opt.img} alt={opt.label} width={22} />
              <span>{opt.label}</span>
            </DropdownButton>
          ))}
        </Dropdown>
      )}
    </PickerWrapper>
  );
};

export default LanguagePicker;
