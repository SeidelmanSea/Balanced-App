
import React from 'react';
import { X, Coffee } from 'lucide-react';
import { TOUR_STEPS } from '../../utils/constants';

const TourOverlay = ({
    tourActive,
    tourStep,
    nextTourStep,
    prevTourStep,
    endTour,
    loadDemoData
}) => {
    if (!tourActive) return null;

    const currentStep = TOUR_STEPS[tourStep];
    const isLastStep = tourStep === TOUR_STEPS.length - 1;

    // Get target element for spotlight
    let targetElement = null;
    if (currentStep.target === 'dashboard') {
        targetElement = document.querySelector('main');
    } else if (currentStep.target === 'accounts') {
        targetElement = document.querySelector('[data-tour="accounts"]');
    } else if (currentStep.target === 'configure') {
        targetElement = document.querySelector('[data-tour="strategy"]');
    } else if (currentStep.target === 'rebalance') {
        targetElement = document.querySelector('[data-tour="balance"]');
    } else if (currentStep.target === 'settings') {
        targetElement = document.querySelector('[data-tour="settings"]');
    }

    let spotlightStyle = {};
    if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        spotlightStyle = {
            position: 'fixed',
            top: `${rect.top - 8}px`,
            left: `${rect.left - 8}px`,
            width: `${rect.width + 16}px`,
            height: `${rect.height + 16}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)', // Reduced from 0.7 to 0.5 for less blur
            borderRadius: '12px',
            border: '3px solid rgb(16, 185, 129)', // Emerald border to highlight
            pointerEvents: 'none',
            zIndex: 45,
            transition: 'all 300ms ease-in-out'
        };
    }

    return (
        <>
            {/* Dark overlay with spotlight cutout */}
            {targetElement && <div style={spotlightStyle} className="animate-in fade-in duration-300" />}
            {!targetElement && <div className="fixed inset-0 z-40 bg-black/50" />}

            {/* Tour tooltip - always centered for simplicity */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                                    Step {tourStep + 1} of {TOUR_STEPS.length}
                                </div>
                                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{currentStep.title}</h3>
                            </div>
                            <button onClick={endTour} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">{currentStep.description}</p>

                        {isLastStep && (
                            <>
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => { endTour(); loadDemoData(); }}
                                        className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all"
                                    >
                                        Load Demo Data
                                    </button>
                                    <button
                                        onClick={endTour}
                                        className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                                    >
                                        Start Fresh
                                    </button>
                                </div>

                                <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg mb-4">
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                                        Balanced is free and privacy-focused. No data ever leaves your device.
                                    </p>
                                    <a
                                        href="https://buymeacoffee.com/balanced"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                                    >
                                        <Coffee className="w-3 h-3" />
                                        Support development
                                    </a>
                                </div>
                            </>
                        )}

                        <div className="flex justify-between items-center">
                            <button
                                onClick={prevTourStep}
                                disabled={tourStep === 0}
                                className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>

                            <div className="flex gap-1">
                                {TOUR_STEPS.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === tourStep ? 'bg-emerald-500 w-6' : 'bg-zinc-300 dark:bg-zinc-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            {!isLastStep ? (
                                <button
                                    onClick={nextTourStep}
                                    className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    onClick={endTour}
                                    className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                                >
                                    Finish
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TourOverlay;
