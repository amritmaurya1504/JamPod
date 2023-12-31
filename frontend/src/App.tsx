import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Activate, Authenticate, GetStarted, Home, Profile, Rooms, SingleRoom } from "./pages";
import { RouteProps } from "./types";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import FullScreenLoader from "./components/FullScreenLoader";

function App() {

  const { loading } = useLoadingWithRefresh();

  return loading   ? (
    <FullScreenLoader message="LOADING RESOURCES HOLD TIGHT!" />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/authenticate" element={<GuestRoute><Authenticate /></GuestRoute>} />
        <Route path="/activate" element={<SemiProtectedRoute><Activate /></SemiProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
        <Route path="/room/:id" element={<ProtectedRoute><SingleRoom /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

const GuestRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuth } = useSelector((state: any) => state.auth);
  return isAuth ? <Navigate to="/rooms" replace={true} /> : <>{children}</>
};

const SemiProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuth, user } = useSelector((state: any) => state.auth);
  return !isAuth ? <Navigate to="/authenticate" replace={true} /> : isAuth && !user.activated ? <>{children}</> :
    <Navigate to="/rooms" replace={true} />
}

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuth, user } = useSelector((state: any) => state.auth);
  return !isAuth ? <Navigate to="/authenticate" replace={true} /> : isAuth && !user.activated ?
    <Navigate to="/activate" replace={true} /> : <>{children}</>
}

export default App;
