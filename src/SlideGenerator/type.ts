
// 要素：テキスト
export type TextInfo = {
  createdAt: string; // 一意に特定するキー(msecまで)
  x: number;
  y: number;
  fontSize: number;
  width: number;
  // height: number; フォントサイズ、幅によって適宜改行するので高さは保持しない
  text: string;
  isBold: boolean;
};

export type PageState = {
  selected: TextInfo | undefined,
  modeOnSelected: 'none' | 'preview' | 'editing' |'transforming',
  texts: TextInfo[],
};
