import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import PortfolioApp from './Balanced';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<PortfolioApp />} />
                {/* Redirect /about.html to the static about page or back to landing */}
                <Route path="/about" element={<Navigate to="/about.html" replace />} />
                {/* Catch all - redirect to landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
