import { LayoutDashboard } from "lucide-react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Home</h1>

          <Link
            to="/admin/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <LayoutDashboard className="h-5 w-5" />
            Manage Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
