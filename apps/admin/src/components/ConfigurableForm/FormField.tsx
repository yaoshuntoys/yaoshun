import { Form, Input } from 'antd';
import type { FormInstance } from 'antd/es/form';

import type { FieldRenderer, FormField } from '@/components/ConfigurableForm/types';

type FormFieldProps = {
  field: FormField;
  form: FormInstance;
  renderers: Record<string, FieldRenderer>;
};

export function FormField({ field, form, renderers }: FormFieldProps) {
  const renderer = renderers[field.type];
  const componentNode = renderer?.(field, { form }) ?? (
    <Input placeholder={`未找到 ${field.type} 对应渲染器`} disabled />
  );

  const valuePropName = field.type === 'switch' ? 'checked' : 'value';

  return (
    <Form.Item
      name={field.name}
      label={field.label}
      rules={field.rules}
      valuePropName={valuePropName}
      {...field.formItemProps}
    >
      {componentNode}
    </Form.Item>
  );
}
