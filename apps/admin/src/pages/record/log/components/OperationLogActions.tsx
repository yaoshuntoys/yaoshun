import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface Props {
  onRefresh: () => void;
}

export default function OperationLogActions({ onRefresh }: Props) {
  return (
    <Button icon={<ReloadOutlined />} onClick={onRefresh}>
      刷新
    </Button>
  );
}
