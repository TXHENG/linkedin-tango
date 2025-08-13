import { FC, PropsWithChildren, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Fallback from './Fallback';
import Error404 from '../../pages/error/Error404';

const RoutesWith404: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {children}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default RoutesWith404;
