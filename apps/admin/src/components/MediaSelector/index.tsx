import {
  FileImageOutlined,
  FileOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useState, useCallback, useEffect } from 'react';
import { Layout, message, Modal } from 'antd';
import type { Folder, MediaFile } from '@/api/media';
import { getFolderTree, getMediaPage } from '@/api/media';
import FolderTree from '@/pages/content/media/components/FolderTree';

const { Sider, Content } = Layout;

interface MediaSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  type?: 'image' | 'video' | 'all';
}

export default function MediaSelector({ open, onClose, onSelect, type = 'all' }: MediaSelectorProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>();
  const [folderLoading, setFolderLoading] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const loadFolders = useCallback(async () => {
    setFolderLoading(true);
    try {
      const res = await getFolderTree();
      setFolders(res);
    } finally {
      setFolderLoading(false);
    }
  }, []);

  const loadFiles = useCallback(async (folderId?: number) => {
    setFilesLoading(true);
    try {
      const res = await getMediaPage({
        page: 1,
        pageSize: 100,
        folderId,
      });
      setFiles(
        res.list.map((file) => ({
          ...file,
          fileName: file.originalName || file.filename,
          fileType: file.mimetype,
        })),
      );
    } finally {
      setFilesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadFolders();
      loadFiles(selectedFolderId);
    }
  }, [open, selectedFolderId, loadFolders, loadFiles]);

  const handleSelect = () => {
    if (selectedFile) {
      onSelect(selectedFile.url);
      setSelectedFile(null);
      onClose();
    } else {
      message.warning('请选择文件');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImageOutlined />;
    if (fileType.startsWith('video/')) return <VideoCameraOutlined />;
    return <FileOutlined />;
  };

  const filteredFiles = files.filter((file) => {
    if (type === 'image') return file.fileType.startsWith('image/');
    if (type === 'video') return file.fileType.startsWith('video/');
    return true;
  });

  return (
    <Modal
      title="从多媒体库选择"
      open={open}
      onOk={handleSelect}
      onCancel={onClose}
      okText="选择"
      cancelText="取消"
      width={800}
      height={500}
    >
      <Layout style={{ background: 'transparent', minHeight: 400 }}>
        <Sider
          width={200}
          style={{ background: '#f5f5f5', borderRadius: 4, marginRight: 16 }}
        >
          <FolderTree
            folders={folders}
            loading={folderLoading}
            selectedFolderId={selectedFolderId}
            onSelect={setSelectedFolderId}
            onCreateFolder={() => {}}
            onRenameFolder={() => {}}
            onDeleteFolder={() => {}}
          />
        </Sider>

        <Content style={{ background: '#fff', padding: 16, borderRadius: 4 }}>
          {filesLoading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>
          ) : filteredFiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              暂无文件
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  style={{
                    border: selectedFile?.id === file.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                    borderRadius: 6,
                    padding: 8,
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: selectedFile?.id === file.id ? '#eff6ff' : '#fff',
                  }}
                >
                  {file.fileType.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.fileName}
                      style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 4 }}
                    />
                  ) : (
                    <div style={{ fontSize: 36, padding: 20, color: '#64748b' }}>{getFileIcon(file.fileType)}</div>
                  )}
                  <div style={{ fontSize: 12, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.fileName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Content>
      </Layout>
    </Modal>
  );
}
