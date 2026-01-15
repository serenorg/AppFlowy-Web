// ABOUTME: Component that displays "Powered by Seren" branding
// ABOUTME: Used in sidebar footer and landing pages

import { Divider } from '@mui/material';

import { ReactComponent as SerenLogo } from '@/assets/icons/logo.svg';

function AppFlowyPower({ divider, width }: { divider?: boolean; width?: number }) {
  return (
    <div
      style={{
        width,
      }}
      className={
        'sticky bottom-[-0.5px] flex w-full transform-gpu flex-col items-center justify-center rounded-[16px] bg-background-primary'
      }
    >
      {divider && <Divider className={'my-0 w-full'} />}

      <div
        onClick={() => {
          window.open('https://serendb.com', '_blank');
        }}
        style={{
          width,
        }}
        className={
          'flex w-full cursor-pointer items-center justify-center gap-2 py-4 text-sm text-text-primary opacity-50'
        }
      >
        Powered by
        <SerenLogo className={'h-5 w-5'} />
        <span className="font-semibold">Seren</span>
      </div>
    </div>
  );
}

export default AppFlowyPower;
