
import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  LayoutDashboard,
  Wallet,
  SlidersHorizontal,
  Scale,
  Settings,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Palette,
  Check
} from 'lucide-react';

import SEO from './components/SEO';
import { usePortfolio } from './hooks/usePortfolio';
import { COLOR_PALETTES, getPalette } from './utils/palettes';

// Components
import DashboardSummary from './components/dashboard/DashboardSummary';
import AccountsManager from './components/dashboard/AccountsManager';
import StrategyConfig from './components/dashboard/StrategyConfig';
import RebalanceView from './components/dashboard/RebalanceView';
import SettingsPanel from './components/dashboard/SettingsPanel';
import WelcomeModal from './components/dashboard/WelcomeModal';
import TourOverlay from './components/dashboard/TourOverlay';
import ConfirmationModal from './components/ui/ConfirmationModal';

export default function PortfolioApp() {
  const { state, actions, metrics, rebalancingPlan } = usePortfolio();

  const {
    isDarkMode,
    colorPalette,
    accounts,
    activeTab,
    notification,
    confirmModal,
    showWelcome,
    tourActive,
    tourStep,
    userAge,
    retirementYear,
    emergencyFund,
    bondAllocation,
    cashAllocation,
    bondStrategyMode,
    equityStrategy,
    isAddingAsset,
    taxStrategy,
    hsaStrategy,
    rebalanceModeTaxable,
    rebalanceModeSheltered
  } = state;

  const totalEquity = Object.values(equityStrategy).reduce((a, b) => a + b, 0);
  const isEquityValid = Math.abs(totalEquity - 100) < 0.1;
  const totalTrades = Object.values(rebalancingPlan?.accountActions || {}).reduce(
    (sum, p) => sum + (p.actions?.length || 0),
    0
  );
  const hasAccounts = Object.keys(accounts).length > 0;
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);
  const paletteMenuRef = useRef(null);
  const activePaletteObj = getPalette(colorPalette);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (paletteMenuRef.current && !paletteMenuRef.current.contains(e.target)) {
        setPaletteMenuOpen(false);
      }
    };
    if (paletteMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [paletteMenuOpen]);

  const navTabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: false },
    { id: 'accounts', icon: Wallet, label: 'Accounts', badge: false },
    { id: 'configure', icon: SlidersHorizontal, label: 'Strategy', badge: !isEquityValid },
    { id: 'rebalance', icon: Scale, label: 'Balance', badge: totalTrades > 0 ? totalTrades : false },
    { id: 'settings', icon: Settings, label: 'Settings', badge: false },
  ];

  return (
    <div className="app-shell-bg min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 pb-24 sm:pb-0 font-sans">
      <SEO
        title="Dashboard"
        description="Manage your portfolio, track asset allocation, and calculate rebalancing trades."
        canonical="/app"
      />

      {/* Frosted-Glass Sticky Header */}
      <header className="bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/pwa-icon.svg" alt="Balanced" className="w-7 h-7 rounded-lg" />
            <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Balanced</h1>
            <span className="hidden sm:inline-block text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline-block font-medium">Portfolio OS</span>
          </div>
          <div className="flex items-center gap-2.5">
            {hasAccounts && (
              <button
                type="button"
                onClick={() => actions.setActiveTab(!isEquityValid ? 'configure' : 'rebalance')}
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100/80 hover:bg-zinc-200/70 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${!isEquityValid ? 'bg-rose-500 animate-pulse' : totalTrades > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="tabular-nums">
                  {!isEquityValid
                    ? 'Strategy invalid'
                    : totalTrades > 0
                    ? `${totalTrades} trade${totalTrades !== 1 ? 's' : ''} ready`
                    : 'Balanced'}
                </span>
              </button>
            )}
            {/* Quick Color Palette Switcher */}
            <div className="relative" ref={paletteMenuRef}>
              <button
                type="button"
                onClick={() => setPaletteMenuOpen(prev => !prev)}
                className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200/80 dark:hover:border-zinc-800 transition-all focus:outline-none"
                aria-label="Select Color Palette"
                title={`Palette: ${activePaletteObj.name}`}
              >
                <div className="flex items-center -space-x-1">
                  {activePaletteObj.swatches.slice(0, 3).map((hex, i) => (
                    <span
                      key={i}
                      style={{ backgroundColor: hex }}
                      className="w-2.5 h-2.5 rounded-full ring-1 ring-white dark:ring-zinc-950"
                    />
                  ))}
                </div>
                <span className="hidden md:inline text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  {activePaletteObj.shortName}
                </span>
              </button>

              {paletteMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    Color Palette
                  </div>
                  {Object.values(COLOR_PALETTES).map(pal => {
                    const isSelected = colorPalette === pal.id;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => {
                          actions.setColorPalette(pal.id);
                          setPaletteMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold flex items-center gap-1.5">
                            <span>{pal.name}</span>
                            {isSelected && <Check className="w-3 h-3 text-zinc-900 dark:text-zinc-100" />}
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate">
                            {pal.description}
                          </div>
                        </div>
                        <div className="flex items-center -space-x-1 shrink-0">
                          {pal.swatches.map((hex, i) => (
                            <span
                              key={i}
                              style={{ backgroundColor: hex }}
                              className="w-3 h-3 rounded-full ring-1 ring-white dark:ring-zinc-900"
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button onClick={actions.toggleTheme} className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 border border-transparent hover:border-zinc-200/80 dark:hover:border-zinc-800 transition-all focus:outline-none" aria-label="Toggle Dark Mode">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Desktop Navigation Bar */}
        <div className="hidden sm:inline-flex items-center gap-0.5 bg-zinc-100/80 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200/70 dark:border-zinc-800/90 mb-8">
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => actions.setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-zinc-200/60 dark:border-zinc-700/60'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border border-transparent'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge === true && (
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              )}
              {typeof tab.badge === 'number' && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-zinc-200/80 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 tabular-nums">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardSummary
              portfolioMetrics={metrics}
              rebalancingPlan={rebalancingPlan}
              accounts={accounts}
              setActiveTab={actions.setActiveTab}
              setShowAccountModal={actions.setShowAccountModal}
              isDarkMode={isDarkMode}
              colorPalette={colorPalette}
              loadDemoData={actions.loadDemoData}
              equityStrategy={equityStrategy}
              bondAllocation={bondAllocation}
              cashAllocation={cashAllocation}
              bondStrategyMode={bondStrategyMode}
              taxStrategy={taxStrategy}
              hsaStrategy={hsaStrategy}
              retirementYear={retirementYear}
              userAge={userAge}
            />
          )}

          {activeTab === 'accounts' && (
            <div data-tour="accounts">
              <AccountsManager
                accounts={accounts}
                totalNetWorth={metrics.totalNetWorth}
                updateAccount={actions.updateAccount}
                updateAccountCash={actions.updateAccountCash}
                addFund={actions.addFund}
                updateFund={actions.updateFund}
                removeFund={actions.removeFund}
                createAccount={actions.createAccount}
                deleteAccount={actions.deleteAccount}
                importFunds={actions.importFunds}
                isDarkMode={isDarkMode}
                hsaStrategy={hsaStrategy}
              />
            </div>
          )}

          {activeTab === 'configure' && (
            <div data-tour="strategy" className="overflow-visible">
              <StrategyConfig
                userAge={userAge}
                yearsToRetirement={metrics.yearsToRetirement || (retirementYear - new Date().getFullYear())}
                retirementYear={retirementYear}
                setRetirementYear={actions.setRetirementYear}
                emergencyFund={emergencyFund}
                setEmergencyFund={actions.setEmergencyFund}
                taxStrategy={taxStrategy}
                setTaxStrategy={actions.setTaxStrategy}
                hsaStrategy={hsaStrategy}
                setHsaStrategy={actions.setHsaStrategy}
                bondAllocation={bondAllocation}
                setBondAllocation={actions.setBondAllocation}
                cashAllocation={cashAllocation}
                setCashAllocation={actions.setCashAllocation}
                bondStrategyMode={bondStrategyMode}
                setBondStrategyMode={actions.setBondStrategyMode}
                equityStrategy={equityStrategy}
                setEquityStrategy={actions.setEquityStrategy}
                isAddingAsset={isAddingAsset}
                setIsAddingAsset={actions.setIsAddingAsset}
                updateEquityStrategy={actions.updateEquityStrategy}
                addEquityAsset={actions.addEquityAsset}
                removeEquityAsset={actions.removeEquityAsset}
                resetEquityStrategy={actions.resetEquityStrategy}
                normalizeEquityStrategy={actions.normalizeEquityStrategy}
                investableTotal={metrics.investableTotal}
              />
            </div>
          )}

          {activeTab === 'rebalance' && (
            <div data-tour="balance">
              <RebalanceView
                accounts={accounts}
                rebalanceModeTaxable={rebalanceModeTaxable}
                setRebalanceModeTaxable={actions.setRebalanceModeTaxable}
                rebalanceModeSheltered={rebalanceModeSheltered}
                setRebalanceModeSheltered={actions.setRebalanceModeSheltered}
                rebalancingPlan={rebalancingPlan}
                setActiveTab={actions.setActiveTab}
                equityStrategy={equityStrategy}
                hsaStrategy={hsaStrategy}
                applyRebalanceTrades={actions.applyRebalanceTrades}
                portfolioMetrics={metrics}
                bondAllocation={bondAllocation}
                cashAllocation={cashAllocation}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div data-tour="settings">
              <SettingsPanel
                handleExportData={actions.handleExportData}
                handleImportData={actions.handleImportData}
                loadDemoData={actions.loadDemoData}
                startTour={actions.startTour}
                resetAllData={actions.resetAllData}
                colorPalette={colorPalette}
                setColorPalette={actions.setColorPalette}
                isDarkMode={isDarkMode}
                toggleTheme={actions.toggleTheme}
              />
            </div>
          )}
        </div>

        {/* Modals and Overlays */}
        <WelcomeModal
          show={showWelcome}
          onLoadDemo={actions.handleLoadDemoFromWelcome}
          onStartTour={actions.startTour}
          onDismiss={actions.dismissWelcome}
        />

        <TourOverlay
          tourActive={tourActive}
          tourStep={tourStep}
          nextTourStep={actions.nextTourStep}
          prevTourStep={actions.prevTourStep}
          endTour={actions.endTour}
          loadDemoData={actions.loadDemoData}
        />

        {/* Global Notification */}
        {notification.message && (
          <div className={`fixed bottom-20 sm:bottom-4 right-4 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-2 ${notification.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'}`}>
            {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => actions.setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        />

        <footer className="max-w-5xl mx-auto px-4 py-8 border-t border-zinc-200 dark:border-zinc-800 mt-12">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <a href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About & Methodology</a>
              <a href="https://github.com/SeidelmanSea/Balanced-App" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">GitHub</a>
              <a href="https://buymeacoffee.com/balanced" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <span>Support Development</span>
                <span className="text-xs">☕</span>
              </a>
            </div>
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-600">
                <span className="font-semibold uppercase tracking-wider opacity-80 block mb-1">Risk Disclosure</span>
                This application is for informational and educational purposes only and does not constitute financial advice. All investing involves risk. Past performance is not indicative of future results.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-200/80 dark:border-zinc-800/80 px-2 py-1.5 flex items-center justify-around">
        {navTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => actions.setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">{tab.label}</span>
              {tab.badge === true && (
                <span className="absolute top-1 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
              {typeof tab.badge === 'number' && (
                <span className="absolute top-0.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold bg-emerald-500 text-white flex items-center justify-center tabular-nums">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
