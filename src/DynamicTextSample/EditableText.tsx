import Konva from "konva";
import React, { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { Text, Transformer, Circle } from "react-konva";
import { Html } from "react-konva-utils"
import { TextInfo } from "./type";
import { ActionKind, usePageContext } from "./Context";
import { KonvaEventObject } from "konva/lib/Node";
import { TextareaAutosize } from '@mui/base';

const EDITOR_MIN_WIDTH = 30;
const offset = 4;
const inputBackgroundColor = "#c8dde3";

type Props = {
  item: TextInfo;
  maxWidth: number;
};

export const EditableText: React.FC<Props> = React.memo(({item, maxWidth}) => {
  const {dispatch} = usePageContext();

  // TODO これらステートもコンテキストで管理する？
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = useCallback(() => {
    setIsEditing(true);
    dispatch({type: ActionKind.SET_SELECTED, payload: item})
  }, [dispatch, item]);

  const startTransforming = useCallback(() => {
    setIsEditing(false);
    dispatch({type: ActionKind.SET_SELECTED, payload: item})
  }, [dispatch, item]);

  const release = useCallback(() => {
    setIsEditing(false);
    dispatch({type: ActionKind.RELEASE_SELECTED})
  }, [dispatch]);

  if (isEditing) {
    return <Editor item={item} maxWidth={maxWidth} release={release}/>
  }
  return <Preview  item={item} maxWidth={maxWidth} startTransforming={startTransforming} startEditing={startEditing} />
});


const Preview: React.FC<Props & {startTransforming: ()=>void; startEditing: ()=>void;}> = React.memo(({item, maxWidth, startTransforming, startEditing}) => {
  const {state: {selected}, dispatch} = usePageContext();
  const isSelected = useMemo(() => selected && selected.createdAt === item.createdAt,[item.createdAt, selected]);

  const textAttrs = useMemo(() => {
    const {createdAt, isBold, ...rest} = item;
    return {...rest, fontStyle: isBold ? "bold" : "normal"}
  },[item]);


  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);



  const move = useCallback((e: KonvaEventObject<DragEvent>) => {
    const updated = {...item, x: e.target.x(), y: e.target.y()};
    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: updated});
  }, [dispatch, item]);

  const remove = useCallback(() => dispatch({type: ActionKind.REMOVE_TEXT, payload: {createdAt: item.createdAt}}), [dispatch, item])
  const deleteButtonRef = React.useRef<Konva.Circle>(null);


  const handleResize = useCallback(() => {
    const textNode = textRef.current;
    if (textNode !== null) {
      const width = textNode.width() * textNode.scaleX();
      const height = textNode.height() * textNode.scaleY();
      textNode.setAttrs({
        width: width,
        scaleX: 1
      });
      const updated = {createdAt: item.createdAt, width, height};
      dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: updated});
    }
  }, [dispatch, item]);


  useEffect(() => {
    if (isSelected && transformerRef.current !== null && textRef.current !== null) {
      transformerRef.current.nodes([textRef.current]);
      const layer = transformerRef.current.getLayer();

      if (!layer) return;

      layer.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={textRef}
        {...textAttrs}
        lineHeight={1.4}  // TODO これもTextInfoに追加する？
        draggable
        onDragEnd={move}
        // シングル→変形、ダブル→編集
        onClick={startTransforming}
        onTap={startTransforming}
        onDblClick={startEditing}
        onDblTap={startEditing}
        // onTransform={handleResize}
        // その他スタイル
        fill="black"
        fontFamily="sans-serif"
        perfectDrawEnabled={false}
        onTransform={handleResize}
        />
      { isSelected && (
        <Transformer
          ref={transformerRef}
          // 幅変更のみ許可
          rotateEnabled={false}
          flipEnabled={false}
          enabledAnchors={['middle-right','middle-left']}
          boundBoxFunc={(_, newBox) => ({
            ...newBox,
            width: Math.min(maxWidth, Math.max(EDITOR_MIN_WIDTH, newBox.width)),
          })}
          >
          <Circle
            radius={8}
            fill="red"
            ref={deleteButtonRef}
            onClick={remove}
            x={textRef.current ? textRef.current.width() : 0}
          />
        </Transformer>
      )}
    </>
  );
});



const Editor: React.FC<Props & {release: () => void}> = ({item, release}) => {
  const {dispatch} = usePageContext();
  const wrapperStyle = {
    opacity: 1,
    borderRadius: `${offset}px`,
    padding: `${offset}px`,
    backgroundColor: inputBackgroundColor,
  };

  const wrapperPosition = { x: item.x - offset, y: item.y - offset };
  const style = useMemo(() => {
    return getStyle(item)
  },[item]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.code === 'Enter' && !e.shiftKey) || e.code === 'Escape') {
      release();
    }
  }, [release])

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: {...item, text: e.currentTarget.value}})
  },[dispatch, item]);


  return (
    <Html groupProps={wrapperPosition} divProps={{ style:  wrapperStyle}}>
      <TextareaAutosize
        value={item.text}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={style}
        autoFocus
      />
    </Html>
  );
};



function getStyle({width, fontSize, isBold} : TextInfo) {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  return {
    width,
    fontSize: `${fontSize}px`,
    ...(isBold && {fontWeight: 'bold'}),
    ...(!isFirefox && {margintop: "-4px"}),
    border: 'none',
    padding: '0px',
    margin: '0px',
    background: 'none',
    outline: 'none',
    resize: 'none' as const,
    colour: 'black',
    lineHeight: '1.4',
    fontFamily: 'sans-serif',
    backgroundColor: inputBackgroundColor,
  };
}

