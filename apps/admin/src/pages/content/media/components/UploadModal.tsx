import { useState } from 'react';
import { Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

interface Props {
  open: boolean;
  selectedFolderId: number | undefined;
  onUpload: (file: File) => Promise<false>;
  onClose: () => void;
}

export default function UploadModal({ open, selectedFolderId, onUpload, onClose }: Props) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleOk = async () => {
    if (fileList.length === 0) return;
    setUploading(true);
    try {
      await Promise.all(fileList.map((f) => onUpload(f.originFileObj as File)));
      setFileList([]);
      onClose();
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title={`上传文件${selectedFolderId ? '（到当前文件夹）' : ''}`}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="上传"
      cancelText="取消"
      okButtonProps={{ loading: uploading, disabled: fileList.length === 0 }}
    >
      <Upload.Dragger
        multiple
        fileList={fileList}
        beforeUpload={(file) => {
          setFileList((prev) => [...prev, { uid: file.uid, name: file.name, originFileObj: file } as UploadFile]);
          return false;
        }}
        onRemove={(file) => setFileList((prev) => prev.filter((f) => f.uid !== file.uid))}
        style={{ padding: 24 }}
      >
        <p className="ant-upload-drag-icon"><PlusOutlined /></p>
        <p className="ant-upload-text">点击或拖拽文件到此区域</p>
        <p className="ant-upload-hint">支持任意格式，单文件最大 10MB</p>
      </Upload.Dragger>
    </Modal>
  );
}
