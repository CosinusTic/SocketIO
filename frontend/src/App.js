import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import Login from './pages/Login';
import Sidebar from './components/sidebar';
import AuthChannelCreation from "./components/AuthChannelCreation";
import InputBar from "./components/InputBar";
import Home from './pages/Home';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/side" element={<Sidebar />} />
                <Route path="/form" element={<AuthChannelCreation />} />
                <Route path="/input" element={<InputBar />} />

            </Routes>
        </Router>
    );
}

export default App;
