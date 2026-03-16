import React, { useMemo } from 'react';
import styles from './stackblitz.module.css';

export function Stackblitz({
  initialPath,
  file,
  repo,
  branch,
  title,
}: {
  repo: string;
  title: string;
  branch?: string;
  file?: string;
  initialPath?: string;
}) {
  const [organization, repoName] = repo.split('/');
  const stackblitzUrl = useMemo(() => {
    if (!organization || !repoName) {
      throw new Error(
        'Invalid repo format. Expected format: organization/repo-name',
      );
    }

    let segments = ['github', organization, repoName];
    if (branch) {
      segments = [...segments, 'tree', branch];
    }

    const url = new URL('https://stackblitz.com');
    url.pathname = _segmentsToPath(segments);
    url.searchParams.set('embed', '1');
    url.searchParams.set('terminalHeight', '0');
    url.searchParams.set('file', file);
    if (initialPath) {
      url.searchParams.set('initialPath', initialPath);
    }
    return url;
  }, [organization, repoName, branch, file, initialPath]);

  const githubUrl = useMemo(() => {
    let segments = [
      organization,
      repoName,
      file ? 'blob' : 'tree',
      branch ?? 'main',
    ];
    if (file) {
      segments = [...segments, ...file.split('/')];
    }

    const url = new URL('https://github.com');
    url.pathname = _segmentsToPath(segments);
    return url;
  }, [organization, repoName, branch, file]);

  return (
    <>
      <iframe
        title={title}
        style={{ width: '100%', minHeight: '500px' }}
        src={stackblitzUrl.toString()}
      />
      <div className={styles.links}>
        <a
          href={stackblitzUrl.toString()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://developer.stackblitz.com/img/open_in_stackblitz.svg"
            alt="Open in StackBlitz"
          />
        </a>
        <a
          href={githubUrl.toString()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://img.shields.io/badge/Open%20in-GitHub-181717?logo=github&style=for-the-badge"
            alt="Open in GitHub"
          />
        </a>
      </div>
    </>
  );
}

function _segmentsToPath(segments: string[]) {
  return segments.map((segment) => encodeURIComponent(segment)).join('/');
}
