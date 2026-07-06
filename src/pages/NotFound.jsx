import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold">404</h1>

      <p className="mt-4 text-gray-600">
        Page not found.
      </p>

      <Link
        to="/"
        className="inline-block mt-6 bg-black text-white px-5 py-3 rounded"
      >
        Back Home
      </Link>
    </div>
  );
}

export default NotFound;