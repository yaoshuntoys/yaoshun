import { Form } from 'antd';
import type { FormInstance } from 'antd/es/form';

import { FormActions } from '@/components/ConfigurableForm/FormActions';
import { FormFieldsLayout } from '@/components/ConfigurableForm/FormFieldsLayout';
import type { FieldRenderer, SchemaFormProps } from '@/components/ConfigurableForm/types';

type FormContainerProps = Pick<
  SchemaFormProps,
  | 'fields'
  | 'initialValues'
  | 'formProps'
  | 'submitText'
  | 'resetText'
  | 'showActions'
  | 'onReset'
  | 'actionRender'
  | 'grid'
  | 'onSubmit'
> & {
  form: FormInstance;
  renderers: Record<string, FieldRenderer>;
};

export function FormContainer({
  fields,
  initialValues,
  formProps,
  submitText = '提交',
  resetText = '重置',
  showActions = true,
  onReset,
  actionRender,
  grid,
  onSubmit,
  form,
  renderers,
}: FormContainerProps) {
  const reset = () => {
    form.resetFields();
    onReset?.();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={initialValues}
      onFinish={onSubmit}
      {...formProps}
    >
      <FormFieldsLayout
        fields={fields}
        form={form}
        grid={grid}
        renderers={renderers}
      />
      {showActions && (
        <FormActions
          actionRender={actionRender}
          form={form}
          submitText={submitText}
          resetText={resetText}
          onReset={reset}
        />
      )}
    </Form>
  );
}
