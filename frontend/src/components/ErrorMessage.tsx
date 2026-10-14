'use client';

export interface ErrorMessageProps {
  title?: string;
  message?: string;
  statusCode?: number;
  onRetry?: () => void;
}

export function ErrorMessage({
  title = 'Unable to load content',
  message = 'An unexpected error occurred while communicating with the catalog service.',
  statusCode,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center text-rose-950">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="mt-3 text-base font-semibold">
        {title} {statusCode ? `(${statusCode})` : ''}
      </h3>
      <p className="mt-1 text-sm text-rose-700 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-rose-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
