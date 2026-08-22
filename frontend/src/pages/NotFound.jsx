import { ArrowLeft, Compass, House } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

import Button from "../components/Button";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 text-center shadow-lg sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Compass className="h-8 w-8 text-blue-600" />
        </div>

        <p className="text-6xl font-bold italic leading-none text-red-500 sm:text-7xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
          Page not found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
          We could not find the page you were looking for. It may have been
          moved, renamed, or it never existed.
        </p>

        <p className="mx-auto mt-4 max-w-full truncate rounded-lg bg-gray-50 px-4 py-2 font-mono text-xs text-gray-500">
          {location.pathname}
        </p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="secondary"
            icon={<ArrowLeft className="h-5 w-5" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.99]"
          >
            <House className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
