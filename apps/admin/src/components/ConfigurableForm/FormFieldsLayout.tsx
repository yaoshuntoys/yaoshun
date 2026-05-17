import { Col, Row } from 'antd';
import type { FormInstance } from 'antd/es/form';

import { FormField as SchemaFormField } from '@/components/ConfigurableForm/FormField';
import type {
  FieldRenderer,
  FormField,
  GridConfig,
} from '@/components/ConfigurableForm/types';

interface Props {
  fields: FormField[];
  form: FormInstance;
  grid?: GridConfig;
  renderers: Record<string, FieldRenderer>;
}

export function FormFieldsLayout({ fields, form, grid, renderers }: Props) {
  const isGrid = Boolean(grid?.enabled);
  const columns = grid?.columns && grid.columns > 0 ? grid.columns : 2;
  const defaultSpan = Math.max(1, Math.floor(24 / columns));

  const formItems = fields.map((field) => {
    if (field.hidden) {
      return null;
    }

    if (!isGrid) {
      return (
        <SchemaFormField
          key={field.name}
          field={field}
          form={form}
          renderers={renderers}
        />
      );
    }

    return (
      <Col key={field.name} span={defaultSpan} {...field.colProps}>
        <SchemaFormField field={field} form={form} renderers={renderers} />
      </Col>
    );
  });

  if (!isGrid) {
    return <>{formItems}</>;
  }

  return (
    <Row gutter={[16, 0]} {...grid?.rowProps}>
      {formItems}
    </Row>
  );
}
