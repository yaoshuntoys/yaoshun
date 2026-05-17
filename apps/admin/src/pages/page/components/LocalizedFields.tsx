import { Form, Input } from 'antd';

type NamePath = Array<string | number>;

interface Props {
  label: string;
  name: NamePath;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
}

export default function LocalizedFields({
  label,
  name,
  required = true,
  textarea = false,
  rows = 4,
  placeholder,
}: Props) {
  const Component = textarea ? Input.TextArea : Input;
  const rules = required ? [{ required: true, message: `请输入${label}` }] : [];

  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Component
        rows={textarea ? rows : undefined}
        placeholder={placeholder || `请输入${label}`}
      />
    </Form.Item>
  );
}
