import { Select } from 'antd';
import { useEffect, useState } from 'react';

import { getProductList } from '@/api/product';
import type { Product } from '@/types';

interface ProductSelectorProps {
  value?: string | string[];
  onChange?: (value: string[]) => void;
}

function normalizeValue(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export default function ProductSelector({ value, onChange }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const selectedValue = normalizeValue(value);

  useEffect(() => {
    setLoading(true);
    getProductList({ pageSize: 100, publicOnly: true })
      .then((result) => setProducts(result.list))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Select
      mode="multiple"
      allowClear
      showSearch
      loading={loading}
      value={selectedValue}
      onChange={onChange}
      optionFilterProp="label"
      placeholder="请选择商品"
      options={products.map((product) => ({
        label: `${product.productId || product.slug} - ${product.titleZh}`,
        value: product.productId || product.slug,
      }))}
    />
  );
}
