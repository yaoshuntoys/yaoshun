import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Form, message } from 'antd';
import type { Folder } from '@/api/media';
import {
  getFolderTree, createFolder, renameFolder, deleteFolder,
  uploadMedia, deleteMedia,
} from '@/api/media';
import PageContainer from '@/components/PageContainer';
import type { SearchTableInstance } from '@/components/SearchTable';
import FolderTree from '@/pages/content/media/components/FolderTree';
import FileGrid from '@/pages/content/media/components/FileGrid';
import MediaModals from '@/pages/content/media/components/MediaModals';

const { Sider, Content } = Layout;

export default function MediaLibrary() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>();
  const [folderLoading, setFolderLoading] = useState(false);
  const fileGridRef = useRef<SearchTableInstance>(null);

  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderModalParentId, setFolderModalParentId] = useState<number | undefined>();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderForm] = Form.useForm<{ name: string }>();
  const [renameForm] = Form.useForm<{ name: string }>();

  const loadFolders = useCallback(async () => {
    setFolderLoading(true);
    try {
      const res = await getFolderTree();
      setFolders(res);
    } catch {
      // handled by middleware
    } finally {
      setFolderLoading(false);
    }
  }, []);

  useEffect(() => { loadFolders(); }, [loadFolders]);

  const handleCreateFolder = async (values: { name: string }) => {
    try {
      await createFolder({ name: values.name, parentId: folderModalParentId });
      message.success('文件夹创建成功');
      setFolderModalOpen(false);
      folderForm.resetFields();
      loadFolders();
    } catch {
      // handled by middleware
    }
  };

  const handleRenameFolder = async (values: { name: string }) => {
    if (!editingFolder) return;
    try {
      await renameFolder({ id: editingFolder.id, name: values.name });
      message.success('重命名成功');
      setRenameModalOpen(false);
      renameForm.resetFields();
      loadFolders();
    } catch {
      // handled by middleware
    }
  };

  const handleDeleteFolder = async (folder: Folder) => {
    try {
      await deleteFolder({ id: folder.id });
      message.success('文件夹已删除');
      if (selectedFolderId === folder.id) setSelectedFolderId(undefined);
      loadFolders();
    } catch {
      // handled by middleware
    }
  };

  const handleDeleteFile = async (id: number) => {
    try {
      await deleteMedia({ id });
      message.success('文件已删除');
      fileGridRef.current?.reload();
    } catch {
      // handled by middleware
    }
  };

  const handleUpload = async (file: File): Promise<false> => {
    try {
      await uploadMedia(file, selectedFolderId);
      message.success('上传成功');
      fileGridRef.current?.reload();
    } catch {
      // handled by middleware
    }
    return false;
  };

  return (
    <PageContainer
      title="多媒体库"
      description="统一管理图片与文件素材，支持文件夹整理、上传、重命名和删除。"
    >
      <Layout style={{ background: 'transparent', gap: 16 }}>
        <Sider
          width={220}
          style={{ background: '#fff', borderRadius: 8, padding: 12, marginRight: 16 }}
        >
          <FolderTree
            folders={folders}
            loading={folderLoading}
            selectedFolderId={selectedFolderId}
            onSelect={setSelectedFolderId}
            onCreateFolder={(parentId) => {
              setFolderModalParentId(parentId);
              setFolderModalOpen(true);
            }}
            onRenameFolder={(folder) => {
              setEditingFolder(folder);
              renameForm.setFieldsValue({ name: folder.name });
              setRenameModalOpen(true);
            }}
            onDeleteFolder={handleDeleteFolder}
          />
        </Sider>

        <Content>
          <FileGrid
            ref={fileGridRef}
            selectedFolderId={selectedFolderId}
            onUpload={() => setUploadModalOpen(true)}
            onDeleteFile={handleDeleteFile}
          />
        </Content>
      </Layout>

      <MediaModals
        folderModalOpen={folderModalOpen}
        renameModalOpen={renameModalOpen}
        uploadModalOpen={uploadModalOpen}
        editingFolder={editingFolder}
        selectedFolderId={selectedFolderId}
        folderForm={folderForm}
        renameForm={renameForm}
        onCreateFolder={handleCreateFolder}
        onRenameFolder={handleRenameFolder}
        onCloseFolderModal={() => { setFolderModalOpen(false); folderForm.resetFields(); }}
        onCloseRenameModal={() => { setRenameModalOpen(false); renameForm.resetFields(); }}
        onCloseUploadModal={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </PageContainer>
  );
}
