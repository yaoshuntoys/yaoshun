import { useState } from 'react';
import { Button, Dropdown, Space, Spin, Typography } from 'antd';
import {
  FolderOutlined, FolderOpenOutlined, MoreOutlined,
  PlusOutlined, EditOutlined, DeleteOutlined, RightOutlined, DownOutlined,
} from '@ant-design/icons';
import type { Folder } from '@/api/media';

const { Text } = Typography;

interface Props {
  folders: Folder[];
  loading: boolean;
  selectedFolderId: number | undefined;
  onSelect: (id: number | undefined) => void;
  onCreateFolder: (parentId: number | undefined) => void;
  onRenameFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
}

function FolderNode({
  folder,
  selectedFolderId,
  depth,
  onSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
}: {
  folder: Folder;
  selectedFolderId: number | undefined;
  depth: number;
  onSelect: (id: number) => void;
  onCreateFolder: (parentId: number) => void;
  onRenameFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
}) {
  const hasChildren = folder.children && folder.children.length > 0;
  const [expanded, setExpanded] = useState(true);

  const menuItems = [
    {
      key: 'add',
      icon: <PlusOutlined />,
      label: '新建子文件夹',
      onClick: () => onCreateFolder(folder.id),
    },
    {
      key: 'rename',
      icon: <EditOutlined />,
      label: '重命名',
      disabled: folder.isSystem,
      onClick: () => onRenameFolder(folder),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
      disabled: folder.isSystem,
      onClick: () => !folder.isSystem && onDeleteFolder(folder),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
          paddingLeft: 8 + depth * 16,
          borderRadius: 4,
          cursor: 'pointer',
          background: selectedFolderId === folder.id ? '#e6f4ff' : undefined,
        }}
        onClick={() => onSelect(folder.id)}
      >
        <Space size={4}>
          <span
            style={{ width: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => { e.stopPropagation(); if (hasChildren) setExpanded(!expanded); }}
          >
            {hasChildren
              ? (expanded ? <DownOutlined style={{ fontSize: 10 }} /> : <RightOutlined style={{ fontSize: 10 }} />)
              : null}
          </span>
          {expanded && hasChildren
            ? <FolderOpenOutlined style={{ color: '#faad14' }} />
            : <FolderOutlined style={{ color: '#faad14' }} />}
          <Text>{folder.name}</Text>
        </Space>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Button type="text" size="small" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      </div>
      {hasChildren && expanded && (
        <div>
          {folder.children!.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              selectedFolderId={selectedFolderId}
              depth={depth + 1}
              onSelect={onSelect}
              onCreateFolder={onCreateFolder}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FolderTree({
  folders, loading, selectedFolderId, onSelect, onCreateFolder, onRenameFolder, onDeleteFolder,
}: Props) {
  return (
    <Spin spinning={loading}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
          borderRadius: 4,
          cursor: 'pointer',
          marginBottom: 4,
          background: selectedFolderId === undefined ? '#e6f4ff' : undefined,
        }}
        onClick={() => onSelect(undefined)}
      >
        <Space size={4}>
          <span style={{ width: 16 }} />
          <FolderOutlined style={{ color: '#faad14' }} />
          <Text>全部文件</Text>
        </Space>
        <Dropdown
          menu={{
            items: [{
              key: 'add',
              icon: <PlusOutlined />,
              label: '新建文件夹',
              onClick: () => onCreateFolder(undefined),
            }],
          }}
          trigger={['click']}
        >
          <Button type="text" size="small" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      </div>
      {folders.map((f) => (
        <FolderNode
          key={f.id}
          folder={f}
          selectedFolderId={selectedFolderId}
          depth={0}
          onSelect={onSelect}
          onCreateFolder={onCreateFolder}
          onRenameFolder={onRenameFolder}
          onDeleteFolder={onDeleteFolder}
        />
      ))}
    </Spin>
  );
}
