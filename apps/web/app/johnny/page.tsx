import { getActiveEntries } from "@/lib/cache/service"
import CacheDashboard from "../../components/cache-dashboard"

export default function Page() {
  const initialData = getActiveEntries()
  return <CacheDashboard initialData={initialData} />
}
