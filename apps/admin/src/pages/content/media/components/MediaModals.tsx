import type { FormInstance } from 'antd';
import type { Folder } from '@/api/media';
import CreateFolderModal from '@/pages/content/media/components/CreateFolderModal';
import RenameFolderModal from '@/pages/content/media/components/RenameFolderModal';
import UploadModal from '@/pages/content/media/components/UploadModal';

type FolderFormValues = {
  name: string;
};

interface Props {
  folderModalOpen: boolean;
  renameModalOpen: boolean;
  uploadModalOpen: boolean;
  editingFolder: Folder | null;
  selectedFolderId: number | undefined;
  folderForm: FormInstance<FolderFormValues>;
  renameForm: FormInstance<FolderFormValues>;
  onCreateFolder: (values: FolderFormValues) => void;
  onRenameFolder: (values: FolderFormValues) => void;
  onCloseFolderModal: () => void;
  onCloseRenameModal: () => void;
  onCloseUploadModal: () => void;
  onUpload: (file: File) => Promise<false>;
}

export default function MediaModals({
  folderModalOpen, renameModalOpen, uploadModalOpen,
  selectedFolderId, folderForm, renameForm,
  onCreateFolder, onRenameFolder,
  onCloseFolderModal, onCloseRenameModal, onCloseUploadModal,
  onUpload,
}: Props) {
  return (
    <>
      <CreateFolderModal
        open={folderModalOpen}
        form={folderForm}
        onFinish={onCreateFolder}
        onClose={onCloseFolderModal}
      />
      <RenameFolderModal
        open={renameModalOpen}
        form={renameForm}
        onFinish={onRenameFolder}
        onClose={onCloseRenameModal}
      />
      <UploadModal
        open={uploadModalOpen}
        selectedFolderId={selectedFolderId}
        onUpload={onUpload}
        onClose={onCloseUploadModal}
      />
    </>
  );
}
