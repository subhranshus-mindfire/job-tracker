
import { Link } from "react-router-dom";

export default function NoAuthorization() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
