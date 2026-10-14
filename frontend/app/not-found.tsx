import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
      <span className="text-sm font-bold uppercase tracking-wider text-neutral-400">
        404 Error
      </span>
      <h1 className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-neutral-900">
        Page Not Found
      </h1>
      <p className="mt-3 text-base text-neutral-500 max-w-md mx-auto">
        The category, product type, or item you are looking for does not exist or has been relocated.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-neutral-800 transition-colors"
        >
          Return to Storefront
        </Link>
      </div>
    </div>
  );
}
