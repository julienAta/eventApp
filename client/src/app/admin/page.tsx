import AdminDashboard from "@/components/admin-dashboard";
import { getUser } from "@/lib/auth-service";
async function AdminPage() {
  const user = await getUser();
  if (!user) return <div>You are not authorized to access this page</div>;
  if (user.role !== "admin") {
    return <div>You are not authorized to access this page</div>;
  }

  return <AdminDashboard user={user} />;
}

export default AdminPage;
