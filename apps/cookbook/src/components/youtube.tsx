import React from 'react';

export function Youtube({ title, videoId }: { title; videoId: string }) {
  return (
    <iframe
      title={title}
      width="100%"
      style={{ aspectRatio: '16 / 9', width: '100%' }}
      src={`https://www.youtube.com/embed/${videoId}`}
    />
  );
}
