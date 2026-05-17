import { Checkbox, DatePicker, Input, InputNumber, Radio, Select, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import type { BuiltInFieldType, FieldRenderer } from '@/components/ConfigurableForm/types';

export const builtInRenderers: Record<BuiltInFieldType, FieldRenderer> = {
  input: (field) => <Input prefix={<SearchOutlined className="text-slate-400" />} {...field.componentProps} />,
  password: (field) => <Input.Password {...field.componentProps} />,
  textarea: (field) => <Input.TextArea {...field.componentProps} />,
  select: (field) => <Select options={field.options} allowClear className="min-w-[120px]" {...field.componentProps} />,
  number: (field) => <InputNumber className="w-full" {...field.componentProps} />,
  switch: (field) => <Switch {...field.componentProps} />,
  date: (field) => <DatePicker className="w-full" {...field.componentProps} />,
  dateRange: (field) => (
    <DatePicker.RangePicker className="w-full" {...field.componentProps} />
  ),
  radio: (field) => <Radio.Group options={field.options} {...field.componentProps} />,
  checkboxGroup: (field) => <Checkbox.Group options={field.options} {...field.componentProps} />,
};
