import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './providers/AppProviders'
import { router } from './router/routes'
export default function App() {
  return <AppProviders><a className="skiplink" href="#main">تخطَّ إلى المحتوى</a><RouterProvider router={router} /></AppProviders>
}
