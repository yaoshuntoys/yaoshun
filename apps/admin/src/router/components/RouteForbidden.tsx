import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Props {
  title?: string;
}

export default function RouteForbidden({ title }: Props) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-white px-6 py-10">
      <Result
        status="403"
        title="暂无访问权限"
        subTitle={title ? `当前账号无权访问“${title}”页面。` : '当前账号无权访问该页面。'}
        extra={(
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        )}
      />
    </div>
  );
}
