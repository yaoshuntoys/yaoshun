import { useState, type ReactNode } from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Row, Space, Switch, Typography } from 'antd';

import MediaSelector from '@/components/MediaSelector';
import ProductSelector from '@/components/ProductSelector';
import type { PageKey } from '@/types';
import {
  buildPageEditorContent,
  fieldLabels,
  pageModuleLabels,
} from './pageSchema';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface Props {
  content?: Record<string, unknown>;
  pageKey: PageKey;
}

type PathSegment = string | number;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getLabel(segment: PathSegment) {
  if (typeof segment === 'number') return `第 ${segment + 1} 项`;
  return fieldLabels[segment] ?? segment;
}

function resolveInputType(path: PathSegment[], value: unknown) {
  const last = String(path[path.length - 1] ?? '');
  if (last === 'href' || last === 'image' || last === 'icon') return 'url';
  if (last === 'route') return 'text';
  if (typeof value === 'number') return 'number';
  return 'text';
}

function isProductField(path: PathSegment[]) {
  const last = String(path[path.length - 1] ?? '');
  return last === 'productIds' || last === 'featuredProductIds';
}

function isMediaField(path: PathSegment[]) {
  const last = String(path[path.length - 1] ?? '');
  return (
    last === 'image' ||
    last === 'video' ||
    last === 'ogImage' ||
    last === 'fallbackImage' ||
    last === 'galleryImages' ||
    last === 'certificateImages' ||
    last === 'factoryVideo'
  );
}

function isVideoField(path: PathSegment[]) {
  const last = String(path[path.length - 1] ?? '');
  return last === 'video' || last === 'factoryVideo';
}

function PrimitiveField({
  path,
  value,
}: {
  path: PathSegment[];
  value: unknown;
}) {
  const label = getLabel(path[path.length - 1] ?? '');
  const inputType = resolveInputType(path, value);
  const isArrayValue = Array.isArray(value);
  const isBooleanValue = typeof value === 'boolean';
  const isNumberValue = typeof value === 'number';
  const isLong =
    isArrayValue ||
    String(path[path.length - 1] ?? '').toLowerCase().includes('description') ||
    String(path[path.length - 1] ?? '').toLowerCase().includes('text') ||
    String(path[path.length - 1] ?? '').toLowerCase().includes('paragraph') ||
    String(path[path.length - 1] ?? '').toLowerCase().includes('body') ||
    (typeof value === 'string' && value.length > 80);

  return (
    <Form.Item
      name={path}
      label={label}
      getValueProps={(fieldValue) => ({
        value:
          Array.isArray(fieldValue) && !isProductField(path) && !isMediaField(path)
            ? fieldValue.join('\n')
            : fieldValue,
      })}
      normalize={(nextValue) => {
        if (isProductField(path) || isMediaField(path)) {
          return nextValue;
        }

        if (!isArrayValue || typeof nextValue !== 'string') {
          return nextValue;
        }

        return nextValue
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);
      }}
      valuePropName={isBooleanValue ? 'checked' : 'value'}
    >
      {isProductField(path) ? (
        <ProductSelector />
      ) : isMediaField(path) ? (
        <MediaValueInput multiple={isArrayValue} type={isVideoField(path) ? 'video' : 'image'} />
      ) : isBooleanValue ? (
        <Switch />
      ) : isNumberValue ? (
        <InputNumber className="w-full" min={0} />
      ) : isLong ? (
        <TextArea rows={isArrayValue ? 4 : 3} placeholder={`请输入${label}`} />
      ) : (
        <Input type={inputType} placeholder={`请输入${label}`} />
      )}
    </Form.Item>
  );
}

function MediaValueInput({
  multiple,
  onChange,
  type,
  value,
}: {
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
  type: 'image' | 'video';
  value?: string | string[];
}) {
  const [open, setOpen] = useState(false);
  const textValue = Array.isArray(value) ? value.join('\n') : value;

  const handleTextChange = (nextValue: string) => {
    if (multiple) {
      onChange?.(
        nextValue
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      );
      return;
    }

    onChange?.(nextValue);
  };

  const handleSelect = (url: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value.filter(Boolean) : [];
      onChange?.([...current, url]);
      return;
    }

    onChange?.(url);
  };

  return (
    <Space.Compact block>
      {multiple ? (
        <Input.TextArea
          rows={3}
          value={textValue}
          onChange={(event) => handleTextChange(event.target.value)}
          placeholder="从多媒体库选择或粘贴 URL，每行一个"
        />
      ) : (
        <Input
          value={textValue}
          onChange={(event) => handleTextChange(event.target.value)}
          placeholder="从多媒体库选择或粘贴 URL"
        />
      )}
      <Button onClick={() => setOpen(true)}>选择</Button>
      <MediaSelector
        open={open}
        type={type}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </Space.Compact>
  );
}

function ArrayField({
  path,
  value,
}: {
  path: PathSegment[];
  value: unknown[];
}) {
  const label = getLabel(path[path.length - 1] ?? '');
  const fallbackItem = value[0] ?? '';

  return (
    <Form.List name={path}>
      {(fields, { add, remove }) => (
        <Card
          size="small"
          title={label}
          className="page-editor-nested-card"
          extra={(
            <Button size="small" onClick={() => add(fallbackItem)}>
              新增
            </Button>
          )}
        >
          <Space direction="vertical" size="middle" className="w-full">
            {fields.map((field) => (
              <div key={field.key} className="page-editor-array-item">
                <div className="page-editor-array-header">
                  <Text strong>{label} {field.name + 1}</Text>
                  <Button size="small" danger onClick={() => remove(field.name)}>
                    删除
                  </Button>
                </div>
                {Array.isArray(fallbackItem) ? (
                  <Text type="secondary">暂不支持数组套数组字段，请在外层结构中拆分维护。</Text>
                ) : isRecord(fallbackItem) ? (
                  <ObjectFields
                    path={[field.name]}
                    value={fallbackItem}
                  />
                ) : (
                  <PrimitiveField
                    path={[field.name]}
                    value={fallbackItem}
                  />
                )}
              </div>
            ))}
          </Space>
        </Card>
      )}
    </Form.List>
  );
}

function ObjectFields({
  path,
  value,
}: {
  path: PathSegment[];
  value: Record<string, unknown>;
}) {
  return (
    <Row gutter={16}>
      {Object.entries(value).map(([key, entry]) => (
        <Col key={[...path, key].join('.')} span={Array.isArray(entry) || isRecord(entry) ? 24 : 12}>
          {renderField([...path, key], entry)}
        </Col>
      ))}
    </Row>
  );
}

function renderField(path: PathSegment[], value: unknown): ReactNode {
  if (Array.isArray(value)) {
    if (isProductField(path) || isMediaField(path)) {
      return <PrimitiveField path={path} value={value} />;
    }

    if (isPrimitiveArray(value)) {
      return <PrimitiveField path={path} value={value.join('\n')} />;
    }
    return <ArrayField path={path} value={value} />;
  }

  if (isRecord(value)) {
    return <ObjectFields path={path} value={value} />;
  }

  return <PrimitiveField path={path} value={value} />;
}

function renderModuleField(path: PathSegment[], value: unknown): ReactNode {
  return renderField(path, value);
}

function isPrimitiveArray(value: unknown[]) {
  return value.every(
    (item) =>
      item === null ||
      ['string', 'number', 'boolean', 'undefined'].includes(typeof item),
  );
}

export default function PageConfigForm({ content, pageKey }: Props) {
  const editorContent = buildPageEditorContent(pageKey, content);
  const labels = pageModuleLabels[pageKey];

  return (
    <Row gutter={24}>
      <Col xs={24} lg={5}>
        <div className="page-editor-side-card">
          <Title level={5}>模块导航</Title>
          <div className="page-editor-module-list">
            {labels.map((module) => (
              <a
                key={module.key}
                href={`#page-module-${module.key}`}
                className="page-editor-module-item"
              >
                {module.label}
              </a>
            ))}
          </div>
        </div>
      </Col>
      <Col xs={24} lg={19}>
        <Space direction="vertical" className="w-full" size="large">
          {labels.map((module) => {
            const value = editorContent[module.key] ?? {};
            return (
              <Card
                key={module.key}
                id={`page-module-${module.key}`}
                size="small"
                title={module.label}
              >
                <Form.Item shouldUpdate noStyle>
                  {() => renderModuleField([module.key], value)}
                </Form.Item>
              </Card>
            );
          })}
        </Space>
      </Col>
    </Row>
  );
}
