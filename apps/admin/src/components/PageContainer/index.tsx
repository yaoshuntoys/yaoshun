import type { ReactNode } from 'react';
import { Typography } from 'antd';

import styles from '@/components/PageContainer/index.module.css';

const { Title } = Typography;

interface Props {
  title: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
}

export default function PageContainer({
  title,
  description,
  extra,
  children,
}: Props) {
  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div className={styles.meta}>
          {typeof title === 'string' ? (
            <Title level={4} className={styles.title}>
              {title}
            </Title>
          ) : (
            title
          )}
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </div>
        {extra ? <div>{extra}</div> : null}
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
