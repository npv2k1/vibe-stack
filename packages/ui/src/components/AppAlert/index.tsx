import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../Modal';
import { Button } from '../Button';

/**
 * Alert type variants for different message severities
 */
type AppAlertType = 'success' | 'error' | 'warning' | 'info';

/**
 * Props for configuring an AppAlert message
 */
type AppAlertProps = {
  /** The message text to display in the alert */
  message: string;
  /** The type of alert which determines styling and icon */
  type?: AppAlertType;
};

/**
 * Ref interface for controlling AppAlert programmatically
 */
type AppAlertRef = {
  /** Shows an alert with the given props and returns a promise that resolves when dismissed */
  show: (props: AppAlertProps) => Promise<true>;
  /** Dismisses the currently shown alert */
  dismiss: () => void;
};

/**
 * Internal ref for managing promise resolution
 */
type PromiseRef = {
  resolve: (value: true) => void;
};

/**
 * Internal alert component that manages the modal display and promise resolution
 */
const AppAlertRoot: React.ForwardRefRenderFunction<AppAlertRef> = (_, ref) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>();
  const promiseRef = useRef<PromiseRef>();

  /**
   * Dismisses the alert and resolves any pending promise
   */
  const dismiss = useCallback(() => {
    setIsOpen(false);
    setMessage(undefined);
    promiseRef.current?.resolve(true);
    promiseRef.current = undefined;
  }, []);

  /**
   * Shows an alert with the given props and returns a promise that resolves when dismissed
   */
  const show = useCallback((props: AppAlertProps) => {
    setIsOpen(true);
    setMessage(props.message);
    return new Promise<true>((resolve) => {
      promiseRef.current = { resolve };
    });
  }, []);

  useImperativeHandle(ref, () => ({ show, dismiss }), [dismiss, show]);

  useEffect(() => {
    return () => {
      dismiss();
    };
  }, [dismiss]);

  return (
    <Modal isOpen={isOpen} onClose={dismiss} className="">
      <div className="flex w-full flex-col space-y-4">
        <div>{message}</div>
        <div className="w-full flex justify-center items-center">
          <Button className="w-full max-w-[150px]" onClick={dismiss}>
            {t('ok')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const AppAlertRootWithRef = forwardRef(AppAlertRoot);

/**
 * AppAlert component that provides a global alert system.
 * Multiple instances can be rendered, with the most recent one taking priority.
 * Use AppAlert.show() to display alerts programmatically.
 */
export const AppAlert = () => {
  const alertRef = React.useRef<AppAlertRef>();

  const setRef = React.useCallback((ref: AppAlertRef | null) => {
    if (ref) {
      alertRef.current = ref;
      addNewRef(ref);
    } else {
      removeOldRef(alertRef.current ?? null);
    }
  }, []);

  return <AppAlertRootWithRef ref={setRef} />;
};

let refs: { current: AppAlertRef | null }[] = [];

/**
 * Adds a new alert ref to the global refs array
 */
function addNewRef(ref: AppAlertRef) {
  refs.push({
    current: ref,
  });
}

/**
 * Removes an old alert ref from the global refs array and dismisses it
 */
function removeOldRef(ref: AppAlertRef | null) {
  refs = refs.filter((r) => r.current !== ref && !!r.current);
  ref?.dismiss();
}

/**
 * Gets the active alert ref, prioritizing the most recently added
 */
function getRef() {
  const reversePriority = [...refs].reverse();
  const activeRef = reversePriority.find((ref) => ref?.current !== null);
  return activeRef ? activeRef.current : null;
}

/**
 * Static method to show an alert globally
 */
AppAlert.show = async (props: AppAlertProps) => {
  return getRef()?.show(props);
};

/**
 * Static method to dismiss the currently shown alert globally
 */
AppAlert.dismiss = () => {
  getRef()?.dismiss();
};
