import type { ColProps, RowProps } from 'antd';
import type { FormInstance, FormItemProps, FormProps, Rule } from 'antd/es/form';

export type BuiltInFieldType =
  | 'input'
  | 'password'
  | 'textarea'
  | 'select'
  | 'number'
  | 'switch'
  | 'date'
  | 'dateRange'
  | 'radio'
  | 'checkboxGroup';

export type Option = {
  label: string;
  value: string | number | boolean;
};

export type FormField<TComponentProps extends Record<string, unknown> = Record<string, unknown>> = {
  name: string;
  label?: React.ReactNode;
  type: BuiltInFieldType | string;
  rules?: Rule[];
  hidden?: boolean;
  options?: Option[];
  componentProps?: TComponentProps;
  formItemProps?: Omit<FormItemProps, 'name' | 'label' | 'rules' | 'children'>;
  colProps?: ColProps;
};

export type RendererContext = {
  form: FormInstance;
};

export type FieldRenderer = (field: FormField, context: RendererContext) => React.ReactNode;

export type GridConfig = {
  enabled?: boolean;
  columns?: number;
  rowProps?: RowProps;
};

export type FormActionRenderParams = {
  form: FormInstance;
  submitText: string;
  resetText: string;
  reset: () => void;
};

export type SchemaFormProps = {
  fields: FormField[];
  form?: FormInstance;
  initialValues?: Record<string, unknown>;
  formProps?: Omit<FormProps, 'onFinish' | 'initialValues'>;
  submitText?: string;
  resetText?: string;
  showActions?: boolean;
  onReset?: () => void;
  actionRender?: (params: FormActionRenderParams) => React.ReactNode;
  customRenderers?: Record<string, FieldRenderer>;
  grid?: GridConfig;
  onSubmit?: (values: Record<string, unknown>) => void;
};
