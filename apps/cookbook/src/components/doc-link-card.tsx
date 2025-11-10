import {
  useAllDocsData,
  useDocById,
} from '@docusaurus/plugin-content-docs/client';
import DocCard from '@theme/DocCard';

type DocLinkCardProps = {
  docId: string;
};

export function DocLinkCard({ docId }: DocLinkCardProps) {
  const allDocs = useAllDocsData(); // keyed by docs plugin id
  const doc = useDocById(docId);
  const docLink = allDocs.default.versions
    .find((v) => v.name === 'current')
    ?.docs.find((d) => d.id === docId);

  if (!doc || !docLink) {
    const message =
      `[DocLinkCard] Doc with id "${docId}" not found. ` +
      'Double-check the doc path or provide an explicit href.';
    throw new Error(message);
  }

  return (
    <DocCard
      item={{
        type: 'link',
        description: doc.description,
        label: doc.title,
        href: docLink.path,
      }}
    />
  );
}

export default DocLinkCard;
