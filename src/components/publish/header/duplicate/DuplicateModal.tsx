// ABOUTME: Modal for duplicating published content to workspace
// ABOUTME: Allows selecting workspace and space for duplication

import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { PublishContext } from '@/application/publish';
import { Types, ViewLayout } from '@/application/types';
import { NormalModal } from '@/components/_shared/modal';
import { notify } from '@/components/_shared/notify';
import { AFConfigContext } from '@/components/main/app.hooks';
import SelectWorkspace from '@/components/publish/header/duplicate/SelectWorkspace';
import SpaceList from '@/components/publish/header/duplicate/SpaceList';
import { useLoadWorkspaces } from '@/components/publish/header/duplicate/useDuplicate';

function getCollabTypeFromViewLayout(layout: ViewLayout) {
  switch (layout) {
    case ViewLayout.Document:
      return Types.Document;
    case ViewLayout.Grid:
    case ViewLayout.Board:
    case ViewLayout.Calendar:
      return Types.Database;
    default:
      return null;
  }
}

function DuplicateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const service = useContext(AFConfigContext)?.service;
  const viewMeta = useContext(PublishContext)?.viewMeta;
  const viewId = viewMeta?.view_id;
  const layout = viewMeta?.layout as ViewLayout;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [successModalOpen, setSuccessModalOpen] = React.useState<boolean>(false);
  const [newViewId, setNewViewId] = React.useState<string | undefined>(undefined);
  const [databaseMappings, setDatabaseMappings] = React.useState<Record<string, string[]> | undefined>(undefined);
  const {
    workspaceList,
    spaceList,
    setSelectedSpaceId,
    setSelectedWorkspaceId,
    selectedWorkspaceId,
    selectedSpaceId,
    workspaceLoading,
    spaceLoading,
    loadWorkspaces,
    loadSpaces,
  } = useLoadWorkspaces();

  useEffect(() => {
    if (open) {
      void loadWorkspaces();
    }
  }, [loadWorkspaces, open]);

  useEffect(() => {
    if (selectedWorkspaceId && open) {
      void loadSpaces(selectedWorkspaceId);
    }
  }, [loadSpaces, selectedWorkspaceId, open]);

  const handleDuplicate = useCallback(async () => {
    if (!viewId) return;
    const collabType = getCollabTypeFromViewLayout(layout);

    if (collabType === null) return;

    setLoading(true);
    try {
      const response = await service?.duplicatePublishView({
        workspaceId: selectedWorkspaceId,
        spaceViewId: selectedSpaceId,
        viewId,
        collabType,
      });

      onClose();
      setSuccessModalOpen(true);
      setNewViewId(response?.viewId);
      setDatabaseMappings(response?.databaseMappings);
    } catch (e) {
      setNewViewId(undefined);
      setDatabaseMappings(undefined);
      notify.error(t('publish.duplicateFailed'));
    } finally {
      setLoading(false);
    }
  }, [viewId, layout, service, selectedWorkspaceId, selectedSpaceId, onClose, t]);

  return (
    <>
      <NormalModal
        okButtonProps={{
          disabled: !selectedWorkspaceId || !selectedSpaceId,
        }}
        onCancel={onClose}
        okText={t('button.add')}
        title={t('publish.duplicateTitle')}
        open={open}
        onClose={onClose}
        classes={{ container: 'items-start max-md:mt-auto max-md:items-center mt-[10%] ' }}
        onOk={handleDuplicate}
        okLoading={loading}
      >
        <div className={'flex flex-col gap-4'}>
          <SelectWorkspace
            loading={workspaceLoading}
            workspaceList={workspaceList}
            value={selectedWorkspaceId}
            onChange={setSelectedWorkspaceId}
          />
          <SpaceList
            loading={spaceLoading}
            spaceList={spaceList}
            value={selectedSpaceId}
            onChange={setSelectedSpaceId}
          />
        </div>
      </NormalModal>
      <NormalModal
        PaperProps={{
          sx: {
            maxWidth: 420,
          },
        }}
        okText={t('openInBrowser')}
        onOk={() => {
          if (!newViewId || !selectedWorkspaceId) return;
          let url = `/app/${selectedWorkspaceId}/${newViewId}`;

          // Pass database mappings as URL parameter so the app can use them immediately
          // without waiting for workspace database sync
          if (databaseMappings && Object.keys(databaseMappings).length > 0) {
            const encodedMappings = encodeURIComponent(JSON.stringify(databaseMappings));

            url += `?db_mappings=${encodedMappings}`;
          }

          window.open(url, '_self');
        }}
        onClose={() => setSuccessModalOpen(false)}
        open={successModalOpen}
        title={<div className={'text-left'}>{t('addToWorkspace')}</div>}
      >
        <div className={'w-full whitespace-pre-wrap break-words pb-1 text-text-secondary'}>
          {'Your copy has been added to your workspace. Click below to open it.'}
        </div>
      </NormalModal>
    </>
  );
}

export default DuplicateModal;
