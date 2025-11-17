export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 pt-10">
      <h1 className="text-4xl font-bold">404 – Page Not Found</h1>
      <p className="text-gray-500">Sorry, we couldn’t find that page.</p>
      <a
        href="/"
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        Go Home
      </a>
    </div>
  );
}
