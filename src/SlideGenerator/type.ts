
// 要素：テキスト
export type TextInfo = {
  createdAt: string; // 一意に特定するキー(msecまで)
  x: number;
  y: number;
  fontSize: number;
  width: number;
  lineHeight: number;
  // height: number; フォントサイズ、幅によって適宜改行するので高さは保持しない
  text: string;
  isBold: boolean;
};

export type ImageInfo = {
  createdAt: string; // 一意に特定するキー(msecまで)
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
};

export type PageState = {
  selected: TextInfo | ImageInfo | undefined,
  modeOnSelected: 'none' | 'preview' | 'editing' |'transforming',
  texts: TextInfo[],
  images: ImageInfo[],
};
