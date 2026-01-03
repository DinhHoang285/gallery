'use client';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer
} from 'react';

interface IMainLayoutContext {
  modal: 'login' | 'register' | null;
  setModal: (modal: 'login' | 'register' | null) => void;
}

interface Action {
  type: string;
  payload?: any;
}

const MainLayoutContext = createContext({
  modal: null,
  setModal: () => { },
});

const initializer = {
  modal: null,
  setModal: () => { },
}

const reducers = (state: typeof initializer, action: Action) => {
  switch (action.type) {
    case 'setModal': {
      return {
        ...state,
        modal: action.payload.modal
      };
    }
  }
}

export default function MainLayoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducers as any, initializer) as any;
  const setModal = useCallback((data: 'login' | 'register') => dispatch({ type: 'setModal', payload: data }), [dispatch]);

  const themeValue = useMemo<IMainLayoutContext>(
    () => ({
      setModal,
      ...state
    }),
    [
      setModal,
      state
    ]
  );

  return (
    <MainLayoutContext.Provider value={themeValue as unknown as any}>
      {children}
    </MainLayoutContext.Provider>
  )
}

export const useMainThemeLayout = () => useContext(MainLayoutContext);