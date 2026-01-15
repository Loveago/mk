export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {["Total Sales","New Users","Active Vendors","Pending Orders"].map((m) => (
          <div key={m} className="rounded border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">{m}</div>
            <div className="mt-2 text-xl font-semibold">--</div>
          </div>
        ))}
      </div>
    </div>
  );
}


