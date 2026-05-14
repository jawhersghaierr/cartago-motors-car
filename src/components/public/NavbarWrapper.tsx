import { getSettings } from '@/services/settings'
import Navbar from './Navbar'

export default async function NavbarWrapper() {
  const settings = await getSettings()
  return <Navbar logoUrl={settings.logo_url} companyName={settings.company_name} />
}
