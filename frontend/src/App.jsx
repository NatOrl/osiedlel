import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Announcements from './pages/Announcements';
import Documents from './pages/Documents';
import Contact from './pages/Contact';
import RadaOsiedla from './pages/RadaOsiedla';
import Administration from './pages/Administration';
import Employees from './pages/Employees';
import Gallery from './pages/Gallery';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="documents" element={<Documents />} />
        <Route path="contact" element={<Contact />} />
        <Route path="rada-osiedla" element={<RadaOsiedla />} />
        <Route path="administration" element={<Administration />} />
        <Route path="employees" element={<Employees />} />
        <Route path="gallery" element={<Gallery />} />
      </Route>
    </Routes>
  );
}

export default App;
