import { AppProvider } from '@/context/AppContext';
import './app.scss';

function App({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

export default App;