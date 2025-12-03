import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import PortfolioApp from './Balanced';
import AboutPage from './AboutPage';
import FAQPage from './FAQPage';
import CalculatorsPage from './CalculatorsPage';
import EmergencyFundCalc from './EmergencyFundCalc';
import AssetAllocationCalc from './AssetAllocationCalc';
import RebalanceFrequencyCalc from './RebalanceFrequencyCalc';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<PortfolioApp />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/calculators" element={<CalculatorsPage />} />
                <Route path="/calculators/emergency-fund" element={<EmergencyFundCalc />} />
                <Route path="/calculators/asset-allocation" element={<AssetAllocationCalc />} />
                <Route path="/calculators/rebalance-frequency" element={<RebalanceFrequencyCalc />} />
                {/* Catch all - redirect to landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
