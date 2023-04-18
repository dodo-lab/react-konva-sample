import React, {createContext, useContext, useReducer} from 'react';
import { PageState, TextInfo, ImageInfo, LineInfo } from './type';
import dayjs from 'dayjs';


const initialPageContext: PageState = {
  selected: undefined,
  modeOnSelected: 'none',
  texts: [] as TextInfo[],
  images: [] as ImageInfo[],
  lines: [] as LineInfo[],
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

  ADD_IMAGE = 'ADD_IMAGE',
  REMOVE_IMAGE = 'REMOVE_IMAGE',
  UPDATE_SELECTED_IMAGE = 'UPDATE_SELECTED_IMAGE',

  ADD_LINE = 'ADD_LINE',
  REMOVE_LINE = 'REMOVE_LINE',
  UPDATE_SELECTED_LINE = 'UPDATE_SELECTED_LINE',
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
      payload: TextInfo | ImageInfo  | LineInfo;
    }
  // テキスト
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
  // 画像
  | {
    type: ActionKind.ADD_IMAGE;
    payload: Omit<ImageInfo, 'createdAt'>;
  }
  | {
    type: ActionKind.REMOVE_IMAGE;
    payload: Pick<ImageInfo, 'createdAt'>;
  }
  | {
    type: ActionKind.UPDATE_SELECTED_IMAGE
    payload: Pick<ImageInfo,'createdAt'> & Partial<Omit<ImageInfo, 'createdAt'>>;
  }
  // 罫線
  | {
    type: ActionKind.ADD_LINE
    payload: Omit<LineInfo, 'createdAt'>;
  }
  | {
    type: ActionKind.REMOVE_LINE
    payload: Pick<LineInfo, 'createdAt'>;
  }
  | {
    type: ActionKind.UPDATE_SELECTED_LINE
    payload: Pick<LineInfo,'createdAt'> & Partial<Omit<LineInfo, 'createdAt'>>;
  }



type PageContextType = {
  state: PageState;
  dispatch: React.Dispatch<Action>;
};

const PageContext = createContext({} as PageContextType);
export const usePageContext = (): PageContextType => useContext(PageContext);

function reducer(state: PageState, action: Action): PageState {
  const {selected, texts, images, lines} = state;
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

    // テキスト
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

    // 画像
    case ActionKind.ADD_IMAGE: {
      const newOne =  {
        ...action.payload,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      };

      return {
        ...state,
        selected: undefined, // 開放する
        modeOnSelected: 'none', // 開放する
        images: [...images, newOne],
      };
    }
    case ActionKind.REMOVE_IMAGE:
      return {
        ...state,
        selected: undefined, // 開放する
        modeOnSelected: 'none', // 開放する
        images: images.filter((one)=> one.createdAt !== action.payload.createdAt),
      };
    case ActionKind.UPDATE_SELECTED_IMAGE: {
      const newImages = images.map((one) => one.createdAt === action.payload.createdAt ? {...one, ...action.payload} : one);
      const newSelected = (selected && selected.createdAt === action.payload.createdAt) ? {...selected, ...action.payload} : selected;

      return {
        ...state,
        selected: newSelected,
        images: newImages,
      };
    }

    // 罫線
    case ActionKind.ADD_LINE: {
      const newOne =  {
        ...action.payload,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      };

      return {
        ...state,
        selected: undefined, // 開放する
        modeOnSelected: 'none', // 開放する
        lines: [...lines, newOne],
      };
    }
    case ActionKind.REMOVE_LINE:
      return {
        ...state,
        selected: undefined, // 開放する
        modeOnSelected: 'none', // 開放する
        lines: lines.filter((one)=> one.createdAt !== action.payload.createdAt),
      };
    case ActionKind.UPDATE_SELECTED_LINE: {
      const newLines = lines.map((one) => one.createdAt === action.payload.createdAt ? {...one, ...action.payload} : one);
      const newSelected = (selected && selected.createdAt === action.payload.createdAt) ? {...selected, ...action.payload} : selected;

      return {
        ...state,
        selected: newSelected,
        lines: newLines,
      };
    }

  }
}

export const WithContext: React.FC<{children: JSX.Element}> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialPageContext);

  return <PageContext.Provider value={{state, dispatch}}>{children}</PageContext.Provider>;
};


