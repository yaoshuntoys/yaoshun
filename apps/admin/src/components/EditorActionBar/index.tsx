import {
  HistoryOutlined,
  ReloadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import { Button, Space } from 'antd';
import type { ReactNode } from 'react';

interface EditorActionBarProps {
  extra?: ReactNode;
  historyDisabled?: boolean;
  onHistory?: () => void;
  onRefresh?: () => void;
  onSave: () => void;
  refreshLoading?: boolean;
  saveLoading?: boolean;
  saveText?: string;
  saveType?: ButtonProps['type'];
  showHistory?: boolean;
}

export default function EditorActionBar({
  extra,
  historyDisabled,
  onHistory,
  onRefresh,
  onSave,
  refreshLoading,
  saveLoading,
  saveText = '保存',
  saveType = 'primary',
  showHistory = true,
}: EditorActionBarProps) {
  return (
    <Space wrap>
      {onRefresh ? (
        <Button icon={<ReloadOutlined />} loading={refreshLoading} onClick={onRefresh}>
          刷新
        </Button>
      ) : null}
      {showHistory ? (
        <Button
          icon={<HistoryOutlined />}
          disabled={historyDisabled}
          onClick={onHistory}
        >
          历史版本
        </Button>
      ) : null}
      <Button
        type={saveType}
        icon={<SaveOutlined />}
        loading={saveLoading}
        onClick={onSave}
      >
        {saveText}
      </Button>
      {extra}
    </Space>
  );
}
