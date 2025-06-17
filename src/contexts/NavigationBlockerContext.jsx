import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmationModal from '../components/ConfirmationModal'; // Assuming you have this
import { useNavigate } from 'react-router-dom';

const NavigationBlockerContext = createContext(undefined);

export const useNavigationBlocker = () => {
  const context = useContext(NavigationBlockerContext);
  if (context === undefined) {
    throw new Error('useNavigationBlocker must be used within a NavigationBlockerProvider');
  }
  return context;
};

export const NavigationBlockerProvider = ({ children }) => {
  const [isActionBlocked, setIsActionBlocked] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  const [onDiscardCallback, setOnDiscardCallback] = useState(() => () => Promise.resolve(true));
  const [onSaveDraftCallback, setOnSaveDraftCallback] = useState(() => () => Promise.resolve(true));
  const [onCancelCallback, setOnCancelCallback] = useState(() => () => Promise.resolve(true));
  
  const [nextPathToNavigate, setNextPathToNavigate] = useState(null);
  const navigate = useNavigate();

  const blockNavigation = useCallback((options) => {
    setIsActionBlocked(true);
    setOnDiscardCallback(() => options.onDiscard || (() => Promise.resolve(true)));
    setOnSaveDraftCallback(() => options.onSaveDraft || (() => Promise.resolve(true)));
    setOnCancelCallback(() => options.onCancel || (() => Promise.resolve(true))); // Ensure it's a function
  }, []);

  const unblockNavigation = useCallback(() => {
    setIsActionBlocked(false);
    setShowConfirmationModal(false);
    setNextPathToNavigate(null);
  }, []);

  const requestNavigationConfirmation = useCallback((path) => {
    if (isActionBlocked) {
      setNextPathToNavigate(path);
      setShowConfirmationModal(true);
      return true; // Indicate that navigation is blocked and modal is shown
    }
    return false; // Indicate that navigation is not blocked
  }, [isActionBlocked]);

  const handleModalDiscard = async () => {
    const canProceed = await onDiscardCallback();
    if (canProceed) {
      unblockNavigation();
      if (nextPathToNavigate) navigate(nextPathToNavigate);
    } else {
      // If onDiscard returns false (or doesn't resolve to true), keep modal open or handle as needed
      setShowConfirmationModal(false); // Or keep it open if you want user to try again
      setNextPathToNavigate(null); // Clear path as discard was not "successful" for navigation
    }
  };

  const handleModalSaveDraft = async () => {
    const canProceed = await onSaveDraftCallback();
    if (canProceed) {
      unblockNavigation();
      if (nextPathToNavigate) navigate(nextPathToNavigate);
    } else {
      setShowConfirmationModal(false);
      setNextPathToNavigate(null);
    }
  };

  const handleModalCancel = async () => {
    await onCancelCallback();
    unblockNavigation(); // Unblock, but don't navigate
  };

  return (
    <NavigationBlockerContext.Provider value={{ 
      isBlocked: isActionBlocked,
      blockNavigation, 
      unblockNavigation,
      requestNavigationConfirmation
    }}>
      {children}
      {showConfirmationModal && (
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={handleModalCancel}
          title="Unsaved Changes"
          message="You have unsaved changes. What would you like to do before leaving?"
          isDestructive={false}
        >
          {/* Custom footer for this specific modal */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex flex-col sm:flex-row-reverse sm:gap-3 gap-2 rounded-b-lg">
            <button
              onClick={handleModalSaveDraft}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-theme-secondary hover:bg-opacity-90 text-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-secondary sm:text-sm"
            >
              Save Draft & Leave
            </button>
            <button
              onClick={handleModalDiscard}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            >
              Discard & Leave
            </button>
            <button
              onClick={handleModalCancel}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary sm:text-sm"
            >
              Stay on Page
            </button>
          </div>
        </ConfirmationModal>
      )}
    </NavigationBlockerContext.Provider>
  );
};
