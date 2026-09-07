import { useLocation, useNavigate } from 'react-router-dom'
import { useRole } from '../../contexts/RoleContext'
import styles from './ProfilePage.module.css'
import { DashboardTab } from './tabs/DashboardTab'
import { SourcesTab } from './tabs/SourcesTab'
import { EvidenceTab } from './tabs/EvidenceTab'
import { EvidenceDetailTab } from './tabs/EvidenceDetailTab'
import { TimelineTab } from './tabs/TimelineTab'
import { GapsTab } from './tabs/GapsTab'
import { OpportunitiesTab } from './tabs/OpportunitiesTab'
import { PassportTab } from './tabs/PassportTab'

type ProfileTab = 'u1' | 'u0' | 'u3' | 'evd' | 'u6' | 'u2' | 'u4' | 'u5'

export function ProfilePage() {
  const { user } = useRole()
  const location = useLocation()
  const navigate = useNavigate()

  const path = location.pathname
  let activeTab: ProfileTab = 'u1'
  let directEvIndex = 0

  if (path === '/profile/sources') activeTab = 'u0'
  else if (path === '/profile/evidence') activeTab = 'u3'
  else if (path.startsWith('/profile/evidence/')) {
    activeTab = 'evd'
    const parsed = parseInt(path.replace('/profile/evidence/', ''), 10)
    if (!isNaN(parsed)) directEvIndex = parsed
  }
  else if (path === '/profile/timeline') activeTab = 'u6'
  else if (path === '/profile/gaps') activeTab = 'u2'
  else if (path === '/profile/opportunities') activeTab = 'u4'
  else if (path === '/profile/passport') activeTab = 'u5'

  const handleOpenEvidence = (idx: number) => {
    navigate('/profile/evidence/' + idx)
  }

  return (
    <div className={`wrap ${styles.profileContainer}`} dir="rtl">
      {activeTab === 'u1' && <DashboardTab user={user} navigate={navigate} />}
      {activeTab === 'u0' && <SourcesTab />}
      {activeTab === 'u3' && <EvidenceTab onOpenEvidence={handleOpenEvidence} />}
      {activeTab === 'evd' && <EvidenceDetailTab evidenceIndex={directEvIndex} navigate={navigate} />}
      {activeTab === 'u6' && <TimelineTab />}
      {activeTab === 'u2' && <GapsTab navigate={navigate} />}
      {activeTab === 'u4' && <OpportunitiesTab />}
      {activeTab === 'u5' && <PassportTab user={user} />}
    </div>
  )
}

export default ProfilePage
