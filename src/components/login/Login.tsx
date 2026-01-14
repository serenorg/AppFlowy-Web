// ABOUTME: Login page component for Seren Notes
// ABOUTME: Uses SerenDB API key authentication only (no email/OAuth)

import { useTranslation } from 'react-i18next';

import { ReactComponent as ArrowRight } from '@/assets/icons/arrow_right.svg';
import { ReactComponent as Logo } from '@/assets/icons/logo.svg';
import ApiKeyLogin from '@/components/login/ApiKeyLogin';
import { Separator } from '@/components/ui/separator';
import { getPlatform } from '@/utils/platform';

export function Login({ redirectTo: _redirectTo }: { redirectTo: string }) {
  const { t } = useTranslation();
  const isMobile = getPlatform().isMobile;

  return (
    <div
      style={{
        justifyContent: isMobile ? 'flex-start' : 'between',
      }}
      className={'flex  h-full flex-col items-center justify-between gap-5 px-4 py-10 text-text-primary'}
    >
      <div className={'flex w-full flex-1 flex-col items-center justify-center gap-5'}>
        <div
          onClick={() => {
            window.location.href = '/';
          }}
          className={'flex w-full cursor-pointer flex-col items-center justify-center gap-5'}
        >
          <Logo className={'h-9 w-9'} />
          <div className={'text-xl font-semibold'}>{t('welcomeTo')} Seren Notes</div>
        </div>
        <ApiKeyLogin />
        <div
          className={
            'w-[300px] overflow-hidden whitespace-pre-wrap break-words text-center text-[12px] tracking-[0.36px] text-text-secondary'
          }
        >
          <span>{t('web.signInAgreement')} </span>
          <a
            href={'https://serendb.com/terms'}
            target={'_blank'}
            className={'text-text-secondary underline'}
            rel='noreferrer'
          >
            {t('web.termOfUse')}
          </a>{' '}
          {t('web.and')}{' '}
          <a
            href={'https://serendb.com/privacy'}
            target={'_blank'}
            className={'text-text-secondary underline'}
            rel='noreferrer'
          >
            {t('web.privacyPolicy')}
          </a>
          .
        </div>
      </div>

      <div
        style={{
          marginBottom: isMobile ? 64 : '0',
        }}
        className={'flex w-full flex-col gap-5'}
      >
        <Separator className={'w-[320px] max-w-full'} />
        <div
          onClick={() => {
            window.location.href = 'https://serendb.com';
          }}
          className={
            'flex w-full cursor-pointer items-center justify-center gap-2 text-xs font-medium text-text-secondary'
          }
        >
          <span>{t('web.visitOurWebsite')}</span>
          <ArrowRight className={'h-5 w-5'} />
        </div>
      </div>
    </div>
  );
}

export default Login;
