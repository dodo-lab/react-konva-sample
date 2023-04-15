import Konva from "konva";
import React, { useRef, useEffect, useCallback } from "react";
import { Text, Transformer, Circle, Image } from "react-konva";
import { Html, useImage } from "react-konva-utils"
import fontSizeUpIcon from './font-size-up-icon.png';
import fontSizeDownIcon from './font-size-down-icon.png';

const EDITOR_MIN_HEIGHT = 30;

export const PreviewAndTransformer: React.FC<{
  x:number;
  y:number;
  setPosition: (x:number, y:number)=> void;

  fontSize: number;
  upFontSize: () => void
  downFontSize: () => void

  width:number;
  height:number;
  setSize:((newWidth: number, newHeight: number) => void);

  isBold: boolean
  toggleBold: () => void;

  text:string;
  isSelected:boolean;
  startTransforming: () => void;
  startEditing: () => void;
  remove: () => void;
}> = ({
  x,
  y,
  setPosition,
  fontSize,
  upFontSize,
  downFontSize,

  width,
  height,
  setSize,

  text,
  isBold,
  toggleBold,
  isSelected,

  startTransforming,
  startEditing,
  remove,
}) => {
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current !== null && textRef.current !== null) {
      transformerRef.current.nodes([textRef.current]);
      const layer = transformerRef.current.getLayer();

      if (!layer) return;

      layer.batchDraw();
    }
  }, [isSelected]);


  const handleResize = useCallback(() => {
    const textNode = textRef.current;
    if (textNode !== null) {
      const newWidth = textNode.width() * textNode.scaleX();
      const newHeight = textNode.height() * textNode.scaleY();
      textNode.setAttrs({
        width: newWidth,
        scaleX: 1
      });
      setSize(newWidth, newHeight);
    }
  }, [setSize]);


  useEffect(() => {
    // 初期表示時
    handleResize();
  }, [handleResize]);

  const deleteButtonRef = React.useRef<Konva.Circle>(null);
  const [fontSizeUpIconImage] = useImage(fontSizeUpIcon)
  const [fontSizeDownIconImage] = useImage(fontSizeDownIcon)

  return (
    <>
      <Text
        ref={textRef}
        // 位置
        x={x}
        y={y}
        fontSize={fontSize}
        lineHeight={1.4}
        draggable
        onDragEnd={(e) => setPosition(e.target.x(),e.target.y())}
        // サイズ
        width={width}
        height={height}
        // テキスト文字列
        text={text}
        fontStyle={isBold ? "bold" : "normal"}
        // シングル→変形、ダブル→編集
        onClick={startTransforming}
        onTap={startTransforming}
        onDblClick={startEditing}
        onDblTap={startEditing}
        onTransform={handleResize}
        // その他スタイル
        fill="black"
        fontFamily="sans-serif"
        perfectDrawEnabled={false}
      />
      { isSelected && (
        <Transformer
          ref={transformerRef}
          // 幅変更のみ許可
          rotateEnabled={false}
          flipEnabled={false}
          enabledAnchors={['middle-right','middle-left']}
          boundBoxFunc={(_, newBox) => ({...newBox, width: Math.max(EDITOR_MIN_HEIGHT, newBox.width)})}
        >
          <Circle
            radius={8}
            fill="red"
            ref={deleteButtonRef}
            onClick={remove}
            x={textRef.current ? textRef.current.width() : 0}
          />
          <Image
            image={fontSizeUpIconImage}
            x={10}
            y={textRef.current ? textRef.current.height() - 10 : 0}
            width={36}
            height={36}
            shadowColor="gray"
            shadowOffsetX={0}
            shadowOffsetY={0}
            shadowBlur={1}
            onMouseOver={(e) => {
              const shape = e.target;
              document.body.style.cursor = 'pointer';
              shape.scaleX(1.1);
              shape.scaleY(1.1);
            }}
            onMouseOut={(e) => {
              const shape = e.target;
              document.body.style.cursor = 'default';
              shape.scaleX(1);
              shape.scaleY(1);
            }}
            onClick={upFontSize}
          />

          <Image
            image={fontSizeDownIconImage}
            x={55}
            y={textRef.current ? textRef.current.height() - 10 : 0}
            width={32}
            height={32}
            shadowColor="gray"
            shadowOffsetX={0}
            shadowOffsetY={0}
            shadowBlur={1}
            onMouseOver={(e) => {
              const shape = e.target;
              document.body.style.cursor = 'pointer';
              shape.scaleX(1.1);
              shape.scaleY(1.1);
            }}
            onMouseOut={(e) => {
              const shape = e.target;
              document.body.style.cursor = 'default';
              shape.scaleX(1);
              shape.scaleY(1);
            }}
            onClick={downFontSize}
          />

          <Text
            text="B" 
            x={100}
            y={textRef.current ? textRef.current.height() - 5 : 0}
            width={32}
            height={32}
            fontSize={20}
            fill={isBold ? "black" : "gray"}
            shadowColor="gray"
            shadowOffsetX={0}
            shadowOffsetY={0}
            shadowBlur={1}
            fontStyle={isBold ? "bold": "normal"}
            onClick={toggleBold}
            onMouseOver={(e) => {
              const shape = e.target;
              document.body.style.cursor = 'pointer';
              shape.scaleX(1.1);
              shape.scaleY(1.1);
            }}
            onMouseOut={(e) => {
              const shape = e.target;
              document.body.style.cursor = 'default';
              shape.scaleX(1);
              shape.scaleY(1);
            }}
          />
        </Transformer>
      )}
    </>
  );
}



const offset = 4;
const inputBackgroundColor = "#c8dde3";

export const Editor: React.FC<{
  x:number;
  y:number;
  width:number;
  height:number;
  text: string;
  fontSize: number;
  setText: (val: string) => void;
  finishEditing: () => void;
}> = ({
  x,
  y,
  width,
  height,
  fontSize,
  text,
  setText,
  finishEditing,
}) => {
  const wrapperStyle = { 
    opacity: 1,
    borderRadius: `${offset}px`,
    padding: `${offset}px`,
    backgroundColor: inputBackgroundColor,
  };

  const wrapperPosition = { x: x - offset, y: y - offset };
  const style = getStyle(width, height, fontSize);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.code === 'Enter' && !e.shiftKey) || e.code === 'Escape') {
      finishEditing();
    }
  }, [finishEditing])

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value),[setText]);

  return (
    <Html groupProps={wrapperPosition} divProps={{ style:  wrapperStyle}}>
      <textarea
        value={text}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={style}
        autoFocus
      />
    </Html>
  );
}

function getStyle(width: number, height:number, fontSize: number) {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  return {
    width,
    height,
    border: 'none',
    padding: '0px',
    margin: '0px',
    background: 'none',
    outline: 'none',
    resize: 'none' as const,
    colour: 'black',
    fontSize: `${fontSize}px`,
    lineHeight: '1.4',
    fontFamily: 'sans-serif',
    backgroundColor: inputBackgroundColor,
    ...(!isFirefox && {margintop: "-4px"})
  };
}

