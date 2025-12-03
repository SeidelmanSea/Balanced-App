import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage'; // Keep landing page immediate for SEO

// Lazy load all other pages
const PortfolioApp = lazy(() => import('./Balanced'));
const AboutPage = lazy(() => import('./AboutPage'));
const FAQPage = lazy(() => import('./FAQPage'));
const CalculatorsPage = lazy(() => import('./CalculatorsPage'));
const EmergencyFundCalc = lazy(() => import('./EmergencyFundCalc'));
const AssetAllocationCalc = lazy(() => import('./AssetAllocationCalc'));
const RebalanceFrequencyCalc = lazy(() => import('./RebalanceFrequencyCalc'));
const ResourcesPage = lazy(() => import('./ResourcesPage'));
const RebalancingGuide = lazy(() => import('./RebalancingGuide'));
const TaxEfficientGuide = lazy(() => import('./TaxEfficientGuide'));
const EmergencyFundGuide = lazy(() => import('./EmergencyFundGuide'));

// Loading component
const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
    </div>
);

export default function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/app" element={<PortfolioApp />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/calculators" element={<CalculatorsPage />} />
                    <Route path="/calculators/emergency-fund" element={<EmergencyFundCalc />} />
                    <Route path="/calculators/asset-allocation" element={<AssetAllocationCalc />} />
                    <Route path="/calculators/rebalance-frequency" element={<RebalanceFrequencyCalc />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/resources/portfolio-rebalancing-guide" element={<RebalancingGuide />} />
                    <Route path="/resources/tax-efficient-investing" element={<TaxEfficientGuide />} />
                    <Route path="/resources/emergency-fund-guide" element={<EmergencyFundGuide />} />
                    {/* Catch all - redirect to landing */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
