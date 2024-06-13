import Link from "next/link";

export function Navbar() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 border-b">
      <Link className="mr-6 flex items-center" href="/">
        {/* <img
          alt="Logo"
          className="h-8 w-8"
          height="40"
          src="/placeholder.svg"
          style={{
            aspectRatio: "40/40",
            objectFit: "cover",
          }}
          width="40"
        /> */}
        <span className="text-lg font-semibold">jjx</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 md:gap-6">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/"
        >
          Home
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/events"
        >
          Events
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/events/create"
        >
          Create
        </Link>
      </nav>
    </header>
  );
}
