import MarketingClient from "@/components/marketing-client";
import { getUser } from "@/lib/authService";

export default async function Home() {
  const user = await getUser();
  const isAuth = user !== null;

  return <MarketingClient isAuth={isAuth} />;
}
