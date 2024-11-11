'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <h2 className="text-xl font-bold mb-4">出错了</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        重试
      </button>
    </div>
  );
} 