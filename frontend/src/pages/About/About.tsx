import { useTranslation } from 'react-i18next';
import {
  AboutSection,
  SectionTitle,
  AboutText,
  TechList,
  TechListItem,
  AuthorInfo,
} from './About.styled';
import Container from '@/components/Container/Container';

const About = () => {
  const { t } = useTranslation();

  return (
    <Container title={t('about_title')} maxWidth="800px">
      <AboutSection>
        <SectionTitle>{t('about_section_what_is_it')}</SectionTitle>
        <AboutText>{t('about_desc_1')}</AboutText>
        <AboutText>{t('about_desc_2')}</AboutText>
      </AboutSection>

      <AboutSection>
        <SectionTitle>{t('about_section_tech_stack')}</SectionTitle>
        <TechList>
          <TechListItem>
            <strong>{t('tech_frontend')}:</strong> {t('tech_frontend_desc')}
          </TechListItem>
          <TechListItem>
            <strong>{t('tech_backend')}:</strong> {t('tech_backend_desc')}
          </TechListItem>
          <TechListItem>
            <strong>{t('tech_blockchain')}:</strong> {t('tech_blockchain_desc')}
          </TechListItem>
          <TechListItem>
            <strong>{t('tech_testing')}:</strong> {t('tech_testing_desc')}
          </TechListItem>
        </TechList>
      </AboutSection>

      <AboutSection>
        <SectionTitle>{t('about_section_features')}</SectionTitle>
        <TechList>
          <TechListItem>{t('feature_swap')}</TechListItem>
          <TechListItem>{t('feature_tax')}</TechListItem>
          <TechListItem>{t('feature_monitoring')}</TechListItem>
          <TechListItem>{t('feature_security')}</TechListItem>
        </TechList>
      </AboutSection>

      <AuthorInfo>
        <AboutText>{t('author_info')}</AboutText>
        <AboutText>E-mail: duartearthur42@gmail.com</AboutText>
        <AboutText>
          <a
            href="LINK_AINDA_NAO_EXISTE"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#23d9d9', textDecoration: 'underline' }}
          >
            https://link-ainda-nao-existe.com
          </a>
        </AboutText>
      </AuthorInfo>
    </Container>
  );
};

export default About;
