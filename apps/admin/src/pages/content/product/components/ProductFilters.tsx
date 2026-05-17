import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select } from 'antd';

import type { Product } from '@/types';

const { Option } = Select;

interface Props {
  keyword: string;
  category?: string;
  status?: string;
  onKeywordChange: (keyword: string) => void;
  onCategoryChange: (category?: Product['category']) => void;
  onStatusChange: (status?: Product['status']) => void;
  onSearch: () => void;
}

export default function ProductFilters({
  keyword,
  category,
  status,
  onKeywordChange,
  onCategoryChange,
  onStatusChange,
  onSearch,
}: Props) {
  return (
    <Row gutter={16} className="mb-4">
      <Col xs={24} sm={12} md={6}>
        <Input
          placeholder="搜索产品标题或描述"
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
          onChange={(value) => onCategoryChange(value as Product['category'] | undefined)}
          className="w-full"
          allowClear
        >
          <Option value="finished-toys">成品玩具项目</Option>
          <Option value="parts-structures">玩具结构件与部件</Option>
          <Option value="process-support">工艺配套能力</Option>
          <Option value="accessories">配件与包装</Option>
        </Select>
      </Col>
      <Col xs={24} sm={12} md={4}>
        <Select
          placeholder="选择状态"
          value={status}
          onChange={(value) => onStatusChange(value as Product['status'] | undefined)}
          className="w-full"
          allowClear
        >
          <Option value="active">上架</Option>
          <Option value="inactive">下架</Option>
        </Select>
      </Col>
      <Col>
        <Button type="primary" onClick={onSearch}>
          搜索
        </Button>
      </Col>
    </Row>
  );
}
