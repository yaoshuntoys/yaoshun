import { useMemo } from 'react';

import { Form } from 'antd';

import { builtInRenderers } from '@/components/ConfigurableForm/builtInRenderers';
import { FormContainer } from '@/components/ConfigurableForm/FormContainer';
import type { FieldRenderer, SchemaFormProps } from '@/components/ConfigurableForm/types';

export function FormSchema({
  form: injectedForm,
  fields,
  initialValues,
  formProps,
  submitText = '提交',
  resetText = '重置',
  showActions = true,
  onReset,
  actionRender,
  customRenderers,
  grid,
  onSubmit,
}: SchemaFormProps) {
  const [innerForm] = Form.useForm();
  const form = injectedForm ?? innerForm;

  const mergedRenderers = useMemo<Record<string, FieldRenderer>>(
    () => ({
      ...builtInRenderers,
      ...customRenderers,
    }),
    [customRenderers],
  );

  return (
    <FormContainer
      fields={fields}
      initialValues={initialValues}
      formProps={formProps}
      submitText={submitText}
      resetText={resetText}
      showActions={showActions}
      onReset={onReset}
      actionRender={actionRender}
      grid={grid}
      onSubmit={onSubmit}
      form={form}
      renderers={mergedRenderers}
    />
  );
}
