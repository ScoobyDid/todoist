import React, { useState, useEffect, useRef } from 'react';
import { lockScroll, unlockScroll, findFrontElement, freezeScroll, addToBackStack, onBackNavigation, removeFromBackStack, uid } from 'helpers/functions';
import A11y from 'helpers/A11y/A11y';
import * as focusTrap from 'focus-trap';
import ModalsController from './ModalsController';

const Modal = ({ options = {} }) => {
  const modalEl = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [focusTrapInstance, setFocusTrapInstance] = useState(null);
  const [optionsState, setOptionsState] = useState(_setupOptions(options));
  const [isUnwantedClose, setIsUnwantedClose] = useState(false);
  const [closingAfterBackdropClick, setClosingAfterBackdropClick] = useState(false);
  const elToFocus = useRef(null);

  useEffect(() => {
    if (!modalEl.current) {
      console.error('Modal: modal element not found');
      return;
    }

    if (!modalEl.current.id) {
      console.error('Modal: modal should have unique id');
      return;
    }

    init(options);

    return () => {
      // Cleanup event listeners
      window.removeEventListener('pointerup', _closeOnClickOutside);
      window.removeEventListener('pointerdown', _preventAccidentalClose);
      window.removeEventListener('keydown', _handleEscKey);
    };
  }, []);

  const init = (options) => {
    setOptionsState(_setupOptions(options));
    elToFocus.current = modalEl.current.querySelector(optionsState.elFocusSelector);
    addA11y();
    _supportPopstate();
    modalEl.current._modal = this;

    modalEl.current.addEventListener('transitionstart', () => {
      setIsAnimating(true);
    });

    _determineUnwantedClose = _determineUnwantedClose.bind(this);
  };

  const _setupOptions = (options) => {
    const defaultOptions = {
      modalEl: null,
      openBtns: [],
      closeBtns: [],
      placeInTopLayer: false,
      disableScroll: true,
      preventCloseOnOtherModalOpen: false,
      closeOnClickOutside: true,
      closeOnEscKey: true,
      closeOnPopstate: true,
      useClasses: true,
      supportA11y: true,
      elFocusSelector: '[data-modal-focus]',
      keepOpenedOnElementClickSelectors: ['[data-modal-keep-opened]'],
      preventCloseOnEscElSelectors: ['[data-modal-prevent-close-on-esc]'],
    };

    const overrideOptions = {};

    _setOverriddenOptionIfExists('placeInTopLayer', overrideOptions);
    _setOverriddenOptionIfExists('disableScroll', overrideOptions);
    _setOverriddenOptionIfExists('closeOnClickOutside', overrideOptions);
    _setOverriddenOptionIfExists('closeOnEscKey', overrideOptions);
    _setOverriddenOptionIfExists('closeOnPopstate', overrideOptions);
    _setOverriddenOptionIfExists('useClasses', overrideOptions);
    _setOverriddenOptionIfExists('supportA11y', overrideOptions);
    _setOverriddenOptionIfExists('elFocusSelector', overrideOptions, false);
    _setOverriddenOptionIfExists('keepOpenedOnElementClickSelectors', overrideOptions, false, true);
    _setOverriddenOptionIfExists('preventCloseOnEscElSelectors', overrideOptions, false, true);
    _setOverriddenOptionIfExists('preventCloseOnOtherModalOpen', overrideOptions, false, false, true);

    const resultOptions = {
      ...defaultOptions,
      ...options,
      ...overrideOptions,
    };

    if (resultOptions.placeInTopLayer && !modalEl.current.showModal) {
      resultOptions.placeInTopLayer = false;
    }

    return resultOptions;
  };

  const _setOverriddenOptionIfExists = (optionName, obj, isBoolean = true, isArray = false, isMixed = false) => {
    const datasetItem = modalEl.current.dataset[optionName];

    if (datasetItem === undefined) return;

    if (isBoolean) {
      if (datasetItem === 'false' || datasetItem === 'true') obj[optionName] = datasetItem === 'true';
      else obj[optionName] = true;
    } else if (isArray) {
      const value = isArray ? datasetItem.split(',').map((item) => item.trim()) : datasetItem;
      obj[optionName] = value;
    } else if (isMixed) {
      if (Number.isFinite(datasetItem) && datasetItem.trim() !== '') {
        obj[optionName] = parseFloat(datasetItem);
      } else if (datasetItem === 'true' || datasetItem === 'false' || datasetItem === undefined) {
        obj[optionName] = (datasetItem === 'true' || datasetItem === undefined);
      } else if (datasetItem.includes(',')) {
        obj[optionName] = datasetItem.split(',').map((item) => item.trim());
      } else {
        obj[optionName] = datasetItem;
      }
    }
  };

  const addA11y = () => {
    if (!optionsState.supportA11y) return;

    modalEl.current.setAttribute('aria-modal', true);
    modalEl.current.setAttribute('aria-haspopup', 'dialog');
    modalEl.current.setAttribute('tabindex', '0');

    optionsState.openBtns.forEach((btn) => {
      btn.setAttribute('aria-controls', modalEl.current.id);
      btn.setAttribute('aria-haspopup', 'dialog');
    });

    optionsState.closeBtns.forEach((btn) => {
      btn.setAttribute('aria-controls', modalEl.current.id);
    });

    modalEl.current.inert = isOpen;
  };

  const waitForTransitionEnd = () => {
    return new Promise((resolve) => {
      if (isAnimating) {
        modalEl.current.addEventListener('transitionend', () => {
          resolve(isOpen);
        }, { once: true });
      } else {
        resolve(isOpen);
      }
    });
  };

  const open = () => {
    ModalsController.modals.forEach((modalInstance) => {
      if (modalInstance.modalEl.open || modalInstance.modalEl.hasAttribute('open')) {
        const preventClose = modalInstance.options.preventCloseOnOtherModalOpen;

        if (!optionsState.placeInTopLayer) {
          if (preventClose
            || (Array.isArray(preventClose) && preventClose.includes(modalEl.current.id))
            || (typeof preventClose === 'string' && preventClose === modalEl.current.id)) {
            return;
          }
        }

        modalInstance.close(true);
      }
    });

    modalEl.current.inert = false;

    if (optionsState.placeInTopLayer) modalEl.current.showModal();
    else modalEl.current.setAttribute('open', '');

    _manageClasses({
      documentAddClasses: ['has-modal-opened', 'overlay-bg-active'],
      classWhileTransition: 'opening',
      classAfterTransition: 'is-opened',
      immediatelyRemoveClass: 'is-closed',
    });

    const openModals = ModalsController.getOpenModals();

    if (openModals.length <= 1 && optionsState.disableScroll) lockScroll();

    if (optionsState.closeOnPopstate) {
      addToBackStack({ id: this.INSTANCE_ID });
    }

    _handleFocusOnOpen();

    modalEl.current.dispatchEvent(new CustomEvent('modal::open', {
      detail: {
        instance: this,
      },
    }));

    ModalsController.updateTopModal();

    setTimeout(() => {
      if (optionsState.closeOnClickOutside) {
        window.addEventListener('pointerup', _closeOnClickOutside);
        window.addEventListener('pointerdown', _preventAccidentalClose);
      }

      window.addEventListener('keydown', _handleEscKey);
    }, 0);
  };

  const close = (keepScrollLocked = false) => {
    if (this.preventClose) return;

    if (!isOpen || (closingAfterBackdropClick && isUnwantedClose)) return;

    modalEl.current.inert = true;

    if (optionsState.placeInTopLayer && modalEl.current.close) modalEl.current.close();
    else modalEl.current.removeAttribute('open');

    const hasOpenModal = (ModalsController.modals.some((modalInstance) => modalInstance.isOpen()) && !optionsState.placeInTopLayer);

    _manageClasses({
      documentRemoveClasses: hasOpenModal ? [] : ['has-modal-opened', 'overlay-bg-active'],
      classWhileTransition: 'closing',
      classAfterTransition: 'is-closed',
      immediatelyRemoveClass: 'is-opened',
    });

    if (!hasOpenModal && optionsState.disableScroll && !keepScrollLocked) {
      unlockScroll();
    }

    if (optionsState.closeOnPopstate) {
      removeFromBackStack(this.INSTANCE_ID);
    }

    if (!optionsState.placeInTopLayer) {
      focusTrapInstance?.deactivate();
    }

    modalEl.current.dispatchEvent(new CustomEvent('modal::close', {
      detail: {
        instance: this,
      },
    }));

    if (optionsState.closeOnClickOutside) {
      window.removeEventListener('pointerup', _closeOnClickOutside);
      window.removeEventListener('pointerdown', _preventAccidentalClose);
      setClosingAfterBackdropClick(false);
    }

    window.removeEventListener('keydown', _handleEscKey);

    ModalsController.updateTopModal();

    if (optionsState.supportA11y) A11y.alert('modal has been closed', 500);
  };

  const _supportPopstate = () => {
    if (!optionsState.closeOnPopstate) return;

    this.INSTANCE_ID = this.constructor.name + uid();

    onBackNavigation(this.INSTANCE_ID, () => {
      if (!isOpen) return;
      freezeScroll();
      close();
    });
  };

  const _handleFocusOnOpen = async (focus = true, _skipPlaceInTopLayer = false) => {
    if (focus) {
      if (elToFocus.current) {
        await waitForTransitionEnd();

        const isVisible = elToFocus.current.getBoundingClientRect().top - modalEl.current.clientHeight < 0;
        if (isVisible) {
          elToFocus.current.focus();
          if (document.activeElement !== elToFocus.current) {
            let attempt = 0;
            const intervalId = setInterval(() => {
              if (document.activeElement !== elToFocus.current || ++attempt > 5) {
                clearInterval(intervalId);
              }
              elToFocus.current?.focus();
            }, 100);
          }
        }
      } else modalEl.current.focus();
    }

    if (!optionsState.placeInTopLayer) {
      if (optionsState.placeInTopLayer || _skipPlaceInTopLayer) return;

      const isOpen = await waitForTransitionEnd();
      if (!isOpen) return;

      if (!focusTrapInstance) {
        const trap = focusTrap.createFocusTrap(modalEl.current, {
          initialFocus: false,
          allowOutsideClick: true,
        });
        setFocusTrapInstance(trap);
      }

      focusTrapInstance.activate();
    }
  };

  const _handleEscKey = (e) => {
    if (!isTopModal()) return;

    if (e.code !== 'Escape' || e.repeat) return;

    if (!optionsState.closeOnEscKey) {
      e.preventDefault();
      return;
    }

    const preventCloseOnEscEl = e.target.closest(optionsState.preventCloseOnEscElSelectors.join(','));

    if (preventCloseOnEscEl) {
      e.preventDefault();
      return;
    }

    closeTopModal();
  };

  const _closeOnClickOutside = (e) => {
    if (!isTopModal()) return;

    let closestSelector = `${optionsState.keepOpenedOnElementClickSelectors.join(',')}`;
    ModalsController.modals.forEach((modalInstance) => {
      closestSelector += `, #${modalInstance.modalEl.id}`;
    });

    if (e.target.closest(closestSelector)) return;

    setClosingAfterBackdropClick(true);

    closeTopModal();

    if (!isOpen) document.removeEventListener('pointermove', _determineUnwantedClose);
  };

  const _preventAccidentalClose = () => {
    setClosingAfterBackdropClick(false);
    setIsUnwantedClose(false);

    let pointerMoveCount = 0;
    document.addEventListener('pointermove', () => {
      if (++pointerMoveCount > 10) {
        setIsUnwantedClose(true);
        document.removeEventListener('pointermove', _determineUnwantedClose);
      }
    });
  };

  const _manageClasses = async (options) => {
    if (!optionsState.useClasses) return;

    if (options.documentAddClasses) document.documentElement.classList.add(...options.documentAddClasses);
    else if (options.documentRemoveClasses) document.documentElement.classList.remove(...options.documentRemoveClasses);

    if (options.immediatelyRemoveClass) modalEl.current.classList.remove(options.immediatelyRemoveClass);
    if (options.classWhileTransition) modalEl.current.classList.add(options.classWhileTransition);

    await waitForTransitionEnd();

    if (options.classWhileTransition) modalEl.current.classList.remove(options.classWhileTransition);
    if (options.classAfterTransition) modalEl.current.classList.add(options.classAfterTransition);
  };

  const isTopModal = () => {
    return ModalsController.topModal === this;
  };

  const closeTopModal = () => {
    const openModals = ModalsController.getOpenModals();

    if (openModals.length > 1) {
      const topModal = findFrontElement(openModals.map((modalInstance) => modalInstance.modalEl));
      ModalsController.modals.find((modal) => modal.modalEl === topModal).close();
    } else close();
  };

  return (
    <div ref={modalEl} id={options.modalEl?.id} className="modal">
      {/* Modal content goes here */}
    </div>
  );
};

export default Modal;