import { Spin } from 'antd';

export default function RouteLoading() {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-white">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Spin size="small" />
        <span>页面加载中...</span>
      </div>
    </div>
  );
}
