import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  MessageOutlined,
  PictureOutlined,
  PlusOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import type { DashboardStat, DashboardStatus } from '@/types';

export const dashboardStatPlaceholders: DashboardStat[] = [
  {
    key: 'content',
    title: '内容总量',
    value: 0,
    trend: '正在加载内容统计...',
  },
  {
    key: 'published',
    title: '线上展示',
    value: 0,
    trend: '正在加载发布数据...',
  },
  {
    key: 'media',
    title: '媒体文件',
    value: 0,
    trend: '正在加载素材资源...',
  },
  {
    key: 'message',
    title: '待处理留言',
    value: 0,
    trend: '正在加载客户留言...',
  },
];

export const dashboardStatusPlaceholders: DashboardStatus[] = [
  { key: 'database', label: '数据库连接', value: '加载中...', color: 'default' },
  { key: 'mail', label: '邮件发送记录', value: '加载中...', color: 'default' },
  { key: 'logs', label: '今日操作日志', value: '加载中...', color: 'default' },
  { key: 'storage', label: '存储空间', value: '加载中...', color: 'default' },
];

export const quickActions = [
  {
    key: 'news',
    title: '发布文章',
    description: '进入新闻中心发布与维护新闻内容',
    path: '/content/news',
  },
  {
    key: 'product',
    title: '添加产品',
    description: '维护产品中心并快速新增产品信息',
    path: '/content/product',
  },
  {
    key: 'media',
    title: '上传图片',
    description: '进入多媒体库管理图片与附件素材',
    path: '/content/media',
  },
  {
    key: 'page',
    title: '编辑页面',
    description: '调整官网关于我们等页面配置内容',
    path: '/page/about',
  },
];

export function getActivityIcon(type: string) {
  switch (type) {
    case 'create':
      return <PlusOutlined />;
    case 'update':
      return <EditOutlined />;
    case 'delete':
      return <DeleteOutlined />;
    default:
      return <EditOutlined />;
  }
}

export function getStatIcon(key: string) {
  switch (key) {
    case 'content':
      return <FileTextOutlined />;
    case 'published':
      return <EyeOutlined />;
    case 'media':
      return <PictureOutlined />;
    case 'message':
      return <MessageOutlined />;
    default:
      return <ShoppingOutlined />;
  }
}

export function getActionIcon(key: string) {
  switch (key) {
    case 'news':
      return <PlusOutlined />;
    case 'product':
      return <ShoppingOutlined />;
    case 'media':
      return <PictureOutlined />;
    case 'page':
      return <EditOutlined />;
    default:
      return <PlusOutlined />;
  }
}
