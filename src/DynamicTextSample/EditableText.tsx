import Konva from "konva";
import React, { useRef, useEffect, useCallback } from "react";
import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils"

const EDITOR_MIN_HEIGHT = 30;

export const PreviewAndTransformer: React.FC<{
  x:number;
  y:number;
  setPosition: (x:number, y:number)=> void;

  width:number;
  height:number;
  setSize:((newWidth: number, newHeight: number) => void);

  text:string;
  isSelected:boolean;
  startTransforming: () => void;
  startEditing: () => void;
}> = ({
  x,
  y,
  setPosition,

  width,
  height,
  setSize,

  text,
  isSelected,

  startTransforming,
  startEditing,
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

  return (
    <>
      <Text
        ref={textRef}
        // 位置
        x={x}
        y={y}
        draggable
        onDragEnd={(e) => setPosition(e.target.x(),e.target.y())}
        // サイズ
        width={width}
        height={height}
        // テキスト文字列
        text={text}        
        // シングル→変形、ダブル→編集
        onClick={startTransforming}
        onTap={startTransforming}
        onDblClick={startEditing}
        onDblTap={startEditing}
        onTransform={handleResize}
        // その他スタイル
        fill="black"
        fontFamily="sans-serif"
        fontSize={24}
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
        />
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
  value: string;
  setValue: (val: string) => void;
  finishEditing: () => void;
}> = ({
  x,
  y,
  width,
  height,
  value,
  setValue,
  finishEditing,
}) => {
  const wrapperStyle = { 
    opacity: 1,
    borderRadius: `${offset}px`,
    padding: `${offset}px`,
    backgroundColor: inputBackgroundColor,
  };

  const wrapperPosition = { x: x - offset, y: y - offset };
  const style = getStyle(width, height);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.code === 'Enter' && !e.shiftKey) || e.code === 'Escape') {
      finishEditing();
    }
  }, [finishEditing])

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.currentTarget.value),[setValue]);

  return (
    <Html groupProps={wrapperPosition} divProps={{ style:  wrapperStyle}}>
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={style}
        autoFocus
      />
    </Html>
  );
}

function getStyle(width: number, height:number) {
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
    fontSize: '24px',
    lineHeight: '1',
    fontFamily: 'sans-serif',
    backgroundColor: inputBackgroundColor,
    ...(!isFirefox && {margintop: "-4px"})
  };
}

