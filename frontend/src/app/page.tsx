import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white dark:bg-gray-950 mt-32">
      <div className="container mx-auto flex max-w-5xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-6xl md:text-7xl">
          Event Manager
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400 md:text-xl">
          Streamline your event planning with our powerful and intuitive
          platform.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/events"
            className="inline-flex h-12 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            prefetch={false}
          >
            View Events
          </Link>
          <Link
            href="/events/create"
            className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200  bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            prefetch={false}
          >
            Create Event
          </Link>
        </div>
      </div>
    </div>
  );
}
