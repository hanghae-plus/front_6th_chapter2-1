import { createContext, useContext, useReducer, ReactNode } from "react";
import { ToastMessage } from "../components/Toast";

interface ToastState {
  messages: ToastMessage[];
}

type ToastAction = { type: "ADD_TOAST"; message: Omit<ToastMessage, "id"> } | { type: "REMOVE_TOAST"; id: string } | { type: "CLEAR_ALL" };

const initialState: ToastState = {
  messages: [],
};

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST": {
      const id = Date.now().toString();
      const newMessage: ToastMessage = {
        ...action.message,
        id,
      };
      return {
        ...state,
        messages: [...state.messages, newMessage],
      };
    }

    case "REMOVE_TOAST": {
      return {
        ...state,
        messages: state.messages.filter(msg => msg.id !== action.id),
      };
    }

    case "CLEAR_ALL": {
      return {
        ...state,
        messages: [],
      };
    }

    default:
      return state;
  }
};

interface ToastContextType {
  messages: ToastMessage[];
  addToast: (message: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const addToast = (message: Omit<ToastMessage, "id">) => {
    dispatch({ type: "ADD_TOAST", message });
  };

  const removeToast = (id: string) => {
    dispatch({ type: "REMOVE_TOAST", id });
  };

  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  const contextValue: ToastContextType = {
    messages: state.messages,
    addToast,
    removeToast,
    clearAll,
  };

  return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
};
