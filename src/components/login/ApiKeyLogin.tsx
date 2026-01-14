// ABOUTME: SerenDB API key login form component
// ABOUTME: Authenticates users via SerenDB API key through Publisher login bridge

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { signInWithApiKey } from '@/application/services/js-services/http/gotrue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { createHotkey, HOT_KEY_NAME } from '@/utils/hotkeys';

function ApiKeyLogin() {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmitApiKey = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return;
    e?.preventDefault();

    // Validate API key format
    if (!apiKey.startsWith('seren_')) {
      setError('API key must start with "seren_"');
      return;
    }

    if (apiKey.length < 20) {
      setError('API key is too short');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signInWithApiKey(apiKey);
      // Success - signInWithApiKey handles redirect via afterAuth()
    } catch (e: unknown) {
      const err = e as { message?: string; code?: number };
      if (err.code === 429) {
        toast.error(t('tooManyRequests'));
      } else {
        setError(err.message || 'Invalid API key');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={'flex w-full flex-col items-center justify-center gap-3'}>
      <div className={'flex flex-col gap-1'}>
        <Input
          data-testid="login-api-key-input"
          autoFocus
          size={'md'}
          variant={error ? 'destructive' : 'default'}
          type={'password'}
          className={'w-[320px]'}
          onChange={(e) => {
            setError('');
            setApiKey(e.target.value);
          }}
          value={apiKey}
          placeholder={'Enter your SerenDB API key'}
          onKeyDown={(e) => {
            if (createHotkey(HOT_KEY_NAME.ENTER)(e.nativeEvent)) {
              void handleSubmitApiKey();
            }
          }}
        />
        {error && <div className={cn('help-text text-xs text-text-error')}>{error}</div>}
      </div>

      <Button
        data-testid="login-api-key-button"
        onMouseDown={handleSubmitApiKey}
        size={'lg'}
        className={'w-[320px]'}
        loading={loading}
      >
        {loading ? (
          <>
            <Progress />
            {t('loading')}
          </>
        ) : (
          'Sign in with API Key'
        )}
      </Button>

      <div className={'mt-2 w-[320px] text-center text-xs text-text-secondary'}>
        <span>Don't have an API key? </span>
        <a
          href={'https://console.serendb.com/api-keys'}
          target={'_blank'}
          className={'text-text-primary underline'}
          rel='noreferrer'
        >
          Get one at console.serendb.com
        </a>
      </div>
    </div>
  );
}

export default ApiKeyLogin;
