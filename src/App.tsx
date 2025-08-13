// import { lazy } from 'react';
import { Route } from 'react-router-dom';
import RoutesWith404 from './components/router/RoutesWith404';
import Home from './pages/Home';

// const About = lazy(() => import('./pages/About'));
// const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <>
      <RoutesWith404>
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
        <Route index element={<Home />} />
      </RoutesWith404>
    </>
  );
}

export default App;
