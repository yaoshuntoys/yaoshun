import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Button, Image, Modal, Space, Typography, message } from 'antd';
import {
  PictureOutlined, VideoCameraOutlined, FileTextOutlined, FileOutlined,
  DeleteOutlined, LinkOutlined, UploadOutlined,
} from '@ant-design/icons';
import { SearchTable, type SearchTableInstance, type SearchResult } from '@/components/SearchTable';
import { getMediaPage } from '@/api/media';
import type { Media } from '@/types';

const { Text } = Typography;

const baseURL = (import.meta.env.VITE_API_BASE_URL as string || '').replace(/\/$/, '');

function getFullUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${baseURL}${url}`;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(mimetype: string) {
  if (mimetype.startsWith('image/')) return <PictureOutlined style={{ color: '#52c41a' }} />;
  if (mimetype.startsWith('video/')) return <VideoCameraOutlined style={{ color: '#1890ff' }} />;
  if (mimetype.includes('pdf') || mimetype.includes('word')) return <FileTextOutlined style={{ color: '#fa8c16' }} />;
  return <FileOutlined style={{ color: '#8c8c8c' }} />;
}

interface SearchForm extends Record<string, unknown> {
  search?: string;
}

interface Props {
  selectedFolderId: number | undefined;
  onUpload: () => void;
  onDeleteFile: (id: number) => void;
}

const FileGrid = forwardRef<SearchTableInstance, Props>(({ selectedFolderId, onUpload, onDeleteFile }, ref) => {
  const tableRef = useRef<SearchTableInstance>(null);

  useImperativeHandle(ref, () => ({
    reload: () => tableRef.current?.reload(),
    refresh: () => tableRef.current?.refresh(),
    getFieldsValue: () => tableRef.current?.getFieldsValue() ?? {},
  }));

  useEffect(() => {
    tableRef.current?.reload();
  }, [selectedFolderId]);

  const searchFn = async (params: SearchForm & { page: number; pageSize: number }): Promise<SearchResult<Media>> => {
    const res = await getMediaPage({
      page: params.page,
      pageSize: params.pageSize,
      folderId: selectedFolderId,
      search: params.search || undefined,
    });
    return {
      data: res.list,
      pagination: { page: res.page, pageSize: res.pageSize, total: res.total },
    };
  };

  const columns = [
    {
      title: '预览',
      dataIndex: 'url',
      width: 80,
      render: (url: string, record: Media) =>
        record.mimetype?.startsWith('image/') ? (
          <Image src={getFullUrl(url)} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <span style={{ fontSize: 24 }}>{getFileIcon(record.mimetype || '')}</span>
        ),
    },
    {
      title: '文件名',
      dataIndex: 'originalName',
      render: (name: string) => <Text ellipsis style={{ maxWidth: 200 }}>{name}</Text>,
    },
    {
      title: '类型',
      dataIndex: 'mimetype',
      width: 160,
      render: (mime: string) => <Text type="secondary">{mime}</Text>,
    },
    {
      title: '大小',
      dataIndex: 'size',
      width: 100,
      render: (size: number) => formatSize(size),
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (val: string) => val ? new Date(val).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      width: 180,
      render: (_: unknown, record: Media) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<LinkOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(getFullUrl(record.url));
              message.success('链接已复制');
            }}
          >
            复制链接
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除文件 "${record.originalName}" 吗？`,
                okText: '删除',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => onDeleteFile(record.id),
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <SearchTable<Media, SearchForm>
      ref={tableRef}
      fields={[{ name: 'search', type: 'input', componentProps: { placeholder: '搜索文件名' } }]}
      columns={columns}
      searchFn={searchFn}
      searchBarExtra={
        <Button type="primary" icon={<UploadOutlined />} onClick={onUpload}>
          上传文件
        </Button>
      }
    />
  );
});

FileGrid.displayName = 'FileGrid';

export default FileGrid;
