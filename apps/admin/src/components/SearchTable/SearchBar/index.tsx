import { Button, Form, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';

import { builtInRenderers } from '@/components/ConfigurableForm/builtInRenderers';
import type { FormField } from '@/components/ConfigurableForm/types';
import styles from '@/components/SearchTable/SearchBar/index.module.css';

export type SearchBarProps = {
  fields: FormField[];
  form?: FormInstance;
  initialValues?: Record<string, unknown>;
  onSearch?: (values: Record<string, unknown>) => void;
  onReset?: () => void;
  extraAction?: React.ReactNode;
};

export function SearchBar({
  fields,
  form,
  initialValues,
  onSearch,
  onReset,
  extraAction,
}: SearchBarProps) {
  const [innerForm] = Form.useForm();
  const usedForm = form ?? innerForm;
  const visibleFields = fields.filter((field) => !field.hidden);

  const handleReset = () => {
    usedForm.resetFields();
    onReset?.();
  };

  return (
    <Form
      form={usedForm}
      layout="inline"
      initialValues={initialValues}
      onFinish={(values) => onSearch?.(values as Record<string, unknown>)}
      className={styles.form}
    >
      <div className={styles.fieldsWrap}>
        {visibleFields.map((field) => {
          const renderer = builtInRenderers[field.type as keyof typeof builtInRenderers];
          const node = renderer?.(field, { form: usedForm });
          const fieldTypeClassName =
            styles[
              `field${String(field.type).charAt(0).toUpperCase()}${String(field.type).slice(1)}`
            ] ?? '';

          return (
            <div
              key={field.name}
              className={`${styles.fieldCol} ${fieldTypeClassName}`}
            >
              <Form.Item
                name={field.name}
                className={styles.fieldItem}
                {...field.formItemProps}
              >
                {node}
              </Form.Item>
            </div>
          );
        })}

        <Form.Item className={styles.actionItem}>
          <div className={styles.actionWrap}>
            <Space className={styles.actionSpace} size={8}>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              {extraAction}
            </Space>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
}
