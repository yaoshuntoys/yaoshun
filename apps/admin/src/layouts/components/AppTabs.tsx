import { ClearOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useTabsStore } from '@/stores';

export default function AppTabs() {
  const navigate = useNavigate();
  const {
    tabs,
    activeKey,
    closeTab,
    closeOtherTabs,
    closeLeftTabs,
    closeRightTabs,
    clearTabs,
    setActiveKey,
  } = useTabsStore();

  const navigateTo = (key: string) => {
    const target = tabs.find((tab) => tab.key === key);
    if (!target) return;
    setActiveKey(key);
    navigate(target.path);
  };

  const handleClose = (key: string) => {
    const nextKey = closeTab(key);
    if (nextKey) {
      navigateTo(nextKey);
    }
  };

  const handleClear = () => {
    const nextPath = clearTabs();
    navigate(nextPath);
  };

  return (
    <div className="admin-tabs">
      <div className="admin-tabs-track">
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;

          return (
            <Dropdown
              key={tab.key}
              trigger={['contextMenu']}
              menu={{
                items: [
                  {
                    key: 'closeCurrent',
                    label: '关闭当前',
                    disabled: !tab.closable,
                  },
                  { type: 'divider' },
                  { key: 'closeOther', label: '关闭其他' },
                  { key: 'closeLeft', label: '关闭左侧' },
                  { key: 'closeRight', label: '关闭右侧' },
                ],
                onClick: ({ key }) => {
                  if (key === 'closeCurrent') handleClose(tab.key);
                  if (key === 'closeOther') closeOtherTabs(tab.key);
                  if (key === 'closeLeft') closeLeftTabs(tab.key);
                  if (key === 'closeRight') closeRightTabs(tab.key);
                },
              }}
            >
              <button
                type="button"
                className={`admin-tab ${isActive ? 'admin-tab-active' : ''}`}
                onClick={() => navigateTo(tab.key)}
                title={tab.title}
              >
                <span className="admin-tab-title">{tab.title}</span>
                {tab.closable ? (
                  <span
                    className="admin-tab-close"
                    role="button"
                    tabIndex={0}
                    aria-label={`关闭 ${tab.title}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClose(tab.key);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        event.stopPropagation();
                        handleClose(tab.key);
                      }
                    }}
                  >
                    <CloseOutlined />
                  </span>
                ) : null}
              </button>
            </Dropdown>
          );
        })}
      </div>
      <Tooltip title="清理页签">
        <Button
          className="admin-tabs-clear"
          type="text"
          size="small"
          icon={<ClearOutlined />}
          disabled={tabs.every((tab) => !tab.closable)}
          onClick={handleClear}
        />
      </Tooltip>
    </div>
  );
}
