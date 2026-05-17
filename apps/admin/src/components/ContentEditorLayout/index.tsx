import { Col, Row, Space, Typography } from 'antd';
import type { ReactNode } from 'react';

const { Title } = Typography;

interface ContentEditorModule {
  key: string;
  label: string;
}

interface Props {
  modules: ContentEditorModule[];
  aside?: ReactNode;
  children: ReactNode;
}

export default function ContentEditorLayout({ modules, aside, children }: Props) {
  return (
    <Row gutter={24} align="top">
      <Col xs={24} lg={5}>
        <div className="page-editor-side-card">
          <Title level={5}>模块导航</Title>
          <div className="page-editor-module-list">
            {modules.map((module) => (
              <a
                key={module.key}
                className="page-editor-module-item"
                href={`#${module.key}`}
              >
                {module.label}
              </a>
            ))}
          </div>
        </div>
      </Col>
      <Col xs={24} lg={aside ? 13 : 19}>
        <Space direction="vertical" size="large" className="w-full">
          {children}
        </Space>
      </Col>
      {aside ? (
        <Col xs={24} lg={6}>
          <Space direction="vertical" size="middle" className="w-full">
            {aside}
          </Space>
        </Col>
      ) : null}
    </Row>
  );
}
