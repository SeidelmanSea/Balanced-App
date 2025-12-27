
import React from 'react';
import {
  PieChart as PieChartIcon,
  Sun,
  Moon,
  LayoutDashboard,
  Wallet,
  SlidersHorizontal,
  Scale,
  Settings,
  AlertCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

import SEO from './components/SEO';
import { usePortfolio } from './hooks/usePortfolio';

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
    bondStrategyMode,
    equityStrategy,
    isAddingAsset,
    taxStrategy,
    rebalanceModeTaxable,
    rebalanceModeSheltered
  } = state;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 pb-20 md:pb-0 font-sans">
      <SEO
        title="Dashboard"
        description="Manage your portfolio, track asset allocation, and calculate rebalancing trades."
        canonical="/app"
      />

      {/* Mobile Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-emerald-500/30"><PieChartIcon className="w-5 h-5" /></div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">Balanced</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-zinc-400 hidden sm:block font-medium">Tax-Efficient Portfolio Manager</div>
            <button onClick={actions.toggleTheme} className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Toggle Dark Mode">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex space-x-1 bg-white dark:bg-zinc-900 p-1 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8 w-full sm:w-auto inline-flex overflow-x-auto">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'accounts', icon: Wallet, label: 'My Accounts' },
            { id: 'configure', icon: SlidersHorizontal, label: 'Configure' },
            { id: 'rebalance', icon: Scale, label: 'Balance' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => actions.setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardSummary
              portfolioMetrics={metrics}
              accounts={accounts}
              setActiveTab={actions.setActiveTab}
              setShowAccountModal={actions.setShowAccountModal}
              isDarkMode={isDarkMode}
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
              />
            </div>
          )}

          {activeTab === 'configure' && (
            <div data-tour="strategy" className="overflow-visible">
              <StrategyConfig
                userAge={userAge}
                yearsToRetirement={metrics.yearsToRetirement || (retirementYear - new Date().getFullYear())} // pass calculated/state
                retirementYear={retirementYear}
                setRetirementYear={actions.setRetirementYear}
                emergencyFund={emergencyFund}
                setEmergencyFund={actions.setEmergencyFund}
                taxStrategy={taxStrategy}
                setTaxStrategy={actions.setTaxStrategy}
                bondAllocation={bondAllocation}
                setBondAllocation={actions.setBondAllocation}
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
          <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-2 ${notification.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'}`}>
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
    </div>
  );
}
