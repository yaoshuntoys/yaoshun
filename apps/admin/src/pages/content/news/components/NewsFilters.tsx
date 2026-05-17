import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select, Space } from 'antd';

const { Option } = Select;

interface Props {
  keyword: string;
  category?: string;
  status?: string;
  onKeywordChange: (value: string) => void;
  onCategoryChange: (value?: string) => void;
  onStatusChange: (value?: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function NewsFilters({
  keyword,
  category,
  status,
  onKeywordChange,
  onCategoryChange,
  onStatusChange,
  onSearch,
  onReset,
}: Props) {
  return (
    <Row gutter={16} align="middle">
      <Col xs={24} sm={12} md={6}>
        <Input
          placeholder="搜索标题"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={4}>
        <Select
          placeholder="选择分类"
          value={category}
          onChange={onCategoryChange}
          className="w-full"
          allowClear
        >
          <Option value="company">公司新闻</Option>
          <Option value="industry">行业动态</Option>
          <Option value="tech">技术文章</Option>
        </Select>
      </Col>
      <Col xs={24} sm={12} md={4}>
        <Select
          placeholder="选择状态"
          value={status}
          onChange={onStatusChange}
          className="w-full"
          allowClear
        >
          <Option value="draft">草稿</Option>
          <Option value="published">已发布</Option>
          <Option value="archived">已归档</Option>
        </Select>
      </Col>
      <Col>
        <Space>
          <Button type="primary" onClick={onSearch}>搜索</Button>
          <Button icon={<ReloadOutlined />} onClick={onReset}>重置</Button>
        </Space>
      </Col>
    </Row>
  );
}
