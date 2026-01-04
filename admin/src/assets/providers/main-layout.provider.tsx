'use client';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer
} from 'react';

// Define all state properties here - easy to extend
interface IMainLayoutState {
  modal: 'login' | 'register' | null;
  // Add more state properties as needed:
  // sidebarOpen?: boolean;
  // theme?: 'light' | 'dark';
  // notifications?: number;
}

interface IMainLayoutContext extends IMainLayoutState {
  // Generic setState function - can update any state key
  setState: <K extends keyof IMainLayoutState>(
    key: K,
    value: IMainLayoutState[K]
  ) => void;
  // Batch update multiple keys at once
  setStateBatch: (updates: Partial<IMainLayoutState>) => void;
}

interface Action {
  type: 'SET_STATE' | 'SET_STATE_BATCH';
  payload?: any;
}

const initialState: IMainLayoutState = {
  modal: null,
};

const MainLayoutContext = createContext<IMainLayoutContext>({
  ...initialState,
  setState: () => { },
  setStateBatch: () => { },
});

const reducers = (state: IMainLayoutState, action: Action): IMainLayoutState => {
  switch (action.type) {
    case 'SET_STATE': {
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: value
      };
    }
    case 'SET_STATE_BATCH': {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
};

export default function MainLayoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducers, initialState);

  // Generic setState function - can set any state key
  const setState = useCallback(<K extends keyof IMainLayoutState>(
    key: K,
    value: IMainLayoutState[K]
  ) => {
    dispatch({
      type: 'SET_STATE',
      payload: { key, value }
    });
  }, []);

  // Batch update multiple state keys at once
  const setStateBatch = useCallback((updates: Partial<IMainLayoutState>) => {
    dispatch({
      type: 'SET_STATE_BATCH',
      payload: updates
    });
  }, []);

  const contextValue = useMemo<IMainLayoutContext>(
    () => ({
      ...state,
      setState,
      setStateBatch,
    }),
    [state, setState, setStateBatch]
  );

  return (
    <MainLayoutContext.Provider value={contextValue}>
      {children}
    </MainLayoutContext.Provider>
  );
}

export const useMainThemeLayout = () => useContext(MainLayoutContext);

