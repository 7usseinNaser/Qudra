import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './providers/AppProviders'
import { router } from './router/routes'
import { SplashScreen } from '../components/layout/SplashScreen'

export default function App() {
  return (
    <AppProviders>
      <SplashScreen />
      <a className="skiplink" href="#main">تخطَّ إلى المحتوى</a>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
