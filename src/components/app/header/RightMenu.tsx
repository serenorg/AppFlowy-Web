// ABOUTME: Right menu component for app header
// ABOUTME: Contains user presence, share button, and more actions

import { useAppViewId } from '@/components/app/app.hooks';

import ShareButton from 'src/components/app/share/ShareButton';

import MoreActions from './MoreActions';
import { Users } from './Users';

function RightMenu() {
  const viewId = useAppViewId();

  return (
    <div className={'flex items-center gap-2'}>
      <Users viewId={viewId} />
      {viewId && <ShareButton viewId={viewId} />}
      {viewId && <MoreActions viewId={viewId} />}
    </div>
  );
}

export default RightMenu;
