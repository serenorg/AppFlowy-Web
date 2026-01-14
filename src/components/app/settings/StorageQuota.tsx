// ABOUTME: Storage quota display component
// ABOUTME: Shows user's storage usage, free limit, and overage costs

import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface StorageQuotaData {
  total_bytes: number;
  free_bytes: number;
  used_bytes: number;
  overage_bytes: number;
  overage_cost_usd: number;
  percentage_used: number;
}

function formatBytes(bytes: number): string {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(2)} GB`;
  } else if (bytes >= MB) {
    return `${(bytes / MB).toFixed(2)} MB`;
  } else if (bytes >= KB) {
    return `${(bytes / KB).toFixed(2)} KB`;
  }
  return `${bytes} bytes`;
}

function StorageQuota() {
  const [quota, setQuota] = useState<StorageQuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuota() {
      try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch('/api/storage/quota');
        // const data = await response.json();

        // Mock data for now
        const mockData: StorageQuotaData = {
          total_bytes: 5 * 1024 * 1024 * 1024, // 5 GB
          free_bytes: 5 * 1024 * 1024 * 1024,
          used_bytes: 1.2 * 1024 * 1024 * 1024, // 1.2 GB used
          overage_bytes: 0,
          overage_cost_usd: 0,
          percentage_used: 24,
        };

        setQuota(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load storage quota');
        setLoading(false);
      }
    }

    fetchQuota();
  }, []);

  if (loading) {
    return (
      <div className="p-4 rounded-lg border border-line-border">
        <div className="animate-pulse">
          <div className="h-4 bg-fill-list-hover rounded w-1/3 mb-2"></div>
          <div className="h-2 bg-fill-list-hover rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !quota) {
    return (
      <div className="p-4 rounded-lg border border-line-border text-function-error">
        {error || 'Unable to load storage information'}
      </div>
    );
  }

  const isOverLimit = quota.overage_bytes > 0;
  const progressColor = isOverLimit ? 'bg-function-error' : 'bg-fill-default';

  return (
    <div className="p-4 rounded-lg border border-line-border space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-text-title">Storage</h3>
        <span className="text-sm text-text-caption">
          {formatBytes(quota.used_bytes)} of {formatBytes(quota.free_bytes)} free
        </span>
      </div>

      <Progress
        value={Math.min(quota.percentage_used, 100)}
        className="h-2"
      />

      <div className="flex justify-between text-sm">
        <span className="text-text-caption">
          {quota.percentage_used.toFixed(1)}% used
        </span>
        {isOverLimit && (
          <span className="text-function-error">
            +{formatBytes(quota.overage_bytes)} overage (${quota.overage_cost_usd.toFixed(2)}/month)
          </span>
        )}
      </div>

      <div className="text-xs text-text-caption">
        Free tier: 5 GB | Overage: $0.35/GB/month
      </div>
    </div>
  );
}

export default StorageQuota;
