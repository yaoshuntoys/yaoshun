import { Button, Form, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';

import type { FormActionRenderParams } from '@/components/ConfigurableForm/types';

interface Props {
  actionRender?: (params: FormActionRenderParams) => React.ReactNode;
  form: FormInstance;
  submitText: string;
  resetText: string;
  onReset: () => void;
}

export function FormActions({
  actionRender,
  form,
  submitText,
  resetText,
  onReset,
}: Props) {
  return (
    <Form.Item>
      <div className="flex w-full justify-end">
        {actionRender ? (
          actionRender({ form, submitText, resetText, reset: onReset })
        ) : (
          <Space>
            <Button type="primary" htmlType="submit">
              {submitText}
            </Button>
            <Button htmlType="button" onClick={onReset}>
              {resetText}
            </Button>
          </Space>
        )}
      </div>
    </Form.Item>
  );
}
