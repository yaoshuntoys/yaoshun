import { Navigate, useParams } from 'react-router-dom';

import PageEditorLayout from '@/pages/page/components/PageEditorLayout';
import { pageMetaByRoute } from '@/pages/page/config';

export default function GenericPageConfig() {
  const { pageRoute } = useParams();
  const meta = pageRoute ? pageMetaByRoute[pageRoute] : undefined;

  if (!meta) {
    return <Navigate to="/page/home" replace />;
  }

  return (
    <PageEditorLayout
      pageKey={meta.key}
      title={meta.title}
      description={meta.description}
    />
  );
}
