
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { HelmetProvider } from 'react-helmet-async';
import ReloadPrompt from './components/pwa/ReloadPrompt';
import LandingPage from './LandingPage'; // Keep landing page immediate for SEO

// Lazy load all other pages
const Balanced = lazy(() => import('./Balanced'));
const AboutPage = lazy(() => import('./AboutPage'));
const ResourcesPage = lazy(() => import('./ResourcesPage'));
const CalculatorsPage = lazy(() => import('./CalculatorsPage'));
const EmergencyFundCalc = lazy(() => import('./EmergencyFundCalc'));
const AssetAllocationCalc = lazy(() => import('./AssetAllocationCalc'));
const RebalanceFrequencyCalc = lazy(() => import('./RebalanceFrequencyCalc'));
const EmergencyFundGuide = lazy(() => import('./EmergencyFundGuide'));
const RebalancingGuide = lazy(() => import('./RebalancingGuide'));
const TaxEfficientGuide = lazy(() => import('./TaxEfficientGuide'));
const FAQPage = lazy(() => import('./FAQPage'));

const LoadingFallback = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Loading Balanced...</p>
    </div>
);

export default function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ReloadPrompt />
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/app" element={<Balanced />} />
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
        </HelmetProvider>
    );
}
