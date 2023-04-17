import React, {createContext, useContext, useReducer} from 'react';
import { PageState, TextInfo } from './type';
import dayjs from 'dayjs';


const initialPageContext: PageState = {
  selected: undefined,
  modeOnSelected: 'none',
  texts: [] as TextInfo[],
} as const;

export enum ActionKind {
  INIT = 'INIT',
  SET_SELECTED = 'SET_SELECTED',
  RELEASE_SELECTED = 'RELEASE_SELECTED',
  START_EDITING = 'START_EDITING',
  START_TRANSFORMING = 'START_TRANSFORMING',
  ADD_TEXT = 'ADD_TEXT',
  REMOVE_TEXT = 'REMOVE_TEXT',
  UPDATE_SELECTED_TEXT = 'UPDATE_SELECTED_TEXT',
}

type Action =
  | {
      type: ActionKind.INIT;
    }
  | {
      type: ActionKind.SET_SELECTED;
      payload: TextInfo;
    }
  | {
      type: ActionKind.RELEASE_SELECTED;
    }
  | {
      type: ActionKind.START_EDITING;
      payload: TextInfo;
    }
  | {
      type: ActionKind.START_TRANSFORMING;
      payload: TextInfo;
    }
  | {
      type: ActionKind.ADD_TEXT;
      payload: Omit<TextInfo, 'createdAt'>;
    }
  | {
      type: ActionKind.REMOVE_TEXT;
      payload: Pick<TextInfo, 'createdAt'>;
    }
  | {
      type: ActionKind.UPDATE_SELECTED_TEXT;
      payload: Pick<TextInfo,'createdAt'> & Partial<Omit<TextInfo, 'createdAt'>>;
    }

type PageContextType = {
  state: PageState;
  dispatch: React.Dispatch<Action>;
};

const PageContext = createContext({} as PageContextType);
export const usePageContext = (): PageContextType => useContext(PageContext);

function reducer(state: PageState, action: Action): PageState {
  const {selected, texts} = state;
  switch (action.type) {
    case ActionKind.INIT:
      return initialPageContext;
    case ActionKind.SET_SELECTED:
      return {
        ...state,
        selected: action.payload,
        modeOnSelected: 'preview',
      };
    case ActionKind.RELEASE_SELECTED:
      return {
        ...state,
        selected: undefined, // 開放する
        modeOnSelected: 'none', // 開放する
      };
    case ActionKind.START_EDITING:
      return {
        ...state,
        selected: action.payload,
        modeOnSelected: 'editing',
      };
    case ActionKind.START_TRANSFORMING:
      return {
        ...state,
        selected: action.payload,
        modeOnSelected: 'transforming',
      };
    case ActionKind.ADD_TEXT: {
      const newOne =  {
        ...action.payload,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      };

      return {
        ...state,
        selected: undefined, // 開放する
        modeOnSelected: 'none', // 開放する
        texts: [...texts, newOne],
      };
    }
    case ActionKind.REMOVE_TEXT:
      return {
        ...state,
        selected: undefined, // 開放する
        modeOnSelected: 'none', // 開放する
        texts: texts.filter((one)=> one.createdAt !== action.payload.createdAt),
      };
    case ActionKind.UPDATE_SELECTED_TEXT: {
      const newTexts = texts.map((one) => one.createdAt === action.payload.createdAt ? {...one, ...action.payload} : one);
      const newSelected = (selected && selected.createdAt === action.payload.createdAt) ? {...selected, ...action.payload} : selected;

      return {
        ...state,
        selected: newSelected,
        texts: newTexts,
      };
    }
  }
}

export const WithContext: React.FC<{children: JSX.Element}> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialPageContext);

  return <PageContext.Provider value={{state, dispatch}}>{children}</PageContext.Provider>;
};


