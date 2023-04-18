import Konva from "konva";
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { Image, Transformer as KonvaTransformer, Circle } from "react-konva";
import { ImageInfo } from "./type";
import { ActionKind, usePageContext } from "./Context";
import { KonvaEventObject } from "konva/lib/Node";
import useImage from 'use-image';


const EDITOR_MIN_WIDTH = 30;

type Props = {
  item: ImageInfo;
  maxWidth: number;
};

export const EditableImage: React.FC<Props> = React.memo(({item, maxWidth}) => {
  const {state: {selected, modeOnSelected: mode}} = usePageContext();
  const isSelected = useMemo(() => selected && selected.createdAt === item.createdAt,[item.createdAt, selected]);

  if (isSelected && mode === 'transforming') return <Transformer  item={item} maxWidth={maxWidth} />;
  return <Preview  item={item} maxWidth={maxWidth}  />;
});


const Preview: React.FC<Props> = React.memo(({item}) => {
  const {dispatch} = usePageContext();

  const imageRef = useRef<Konva.Image>(null);

  const [image] = useImage(item.src, 'anonymous');

  const move = useCallback((e: KonvaEventObject<DragEvent>) => {
    const updated = {...item, x: e.target.x(), y: e.target.y()};
    console.log("onDragEnd", updated)
    dispatch({type: ActionKind.UPDATE_SELECTED_IMAGE, payload: updated});
  }, [dispatch, item]);

  const startTransforming = useCallback(() => dispatch({type: ActionKind.START_TRANSFORMING, payload: item}), [dispatch, item]);

  return (
    <Image
      image={image}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      draggable
      ref={imageRef}
      onDragEnd={move}
      // シングル→変形
      onClick={startTransforming}
      onTap={startTransforming}
      perfectDrawEnabled={false}
    />
  );
});

// 選択済みである前提
const Transformer: React.FC<Props> = React.memo(({item, maxWidth}) => {
  const {dispatch} = usePageContext();
  const [image] = useImage(item.src, 'anonymous');

  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const move = useCallback((e: KonvaEventObject<DragEvent>) => {
    const updated = {...item, x: e.target.x(), y: e.target.y()};
    console.log("onDragEnd", updated)
    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: updated});
  }, [dispatch, item]);

  const remove = useCallback(() => dispatch({type: ActionKind.REMOVE_TEXT, payload: {createdAt: item.createdAt}}), [dispatch, item])
  const deleteButtonRef = React.useRef<Konva.Circle>(null);


  const handleResize = useCallback(() => {
    const textNode = imageRef.current;
    if (textNode !== null) {
      const width = textNode.width() * textNode.scaleX();
      const height = textNode.height() * textNode.scaleY();
      textNode.setAttrs({
        width: width,
        height: height,
        scaleX: 1
      });
      const updated = {createdAt: item.createdAt, width, height};
      dispatch({type: ActionKind.UPDATE_SELECTED_IMAGE, payload: updated});
    }
  }, [dispatch, item]);

  // 初期表示時
  useEffect(() => {
    if (transformerRef.current !== null && imageRef.current !== null) {
      transformerRef.current.nodes([imageRef.current]);
      const layer = transformerRef.current.getLayer();

      if (!layer) return;

      layer.batchDraw();
    }
  }, []);

  const startTransforming = useCallback(() => dispatch({type: ActionKind.START_TRANSFORMING, payload: item}), [dispatch, item]);

  return (
    <>
      <Image
        image={image}
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        draggable
        ref={imageRef}
        onDragEnd={move}
        // シングル→変形
        onClick={startTransforming}
        onTap={startTransforming}
        perfectDrawEnabled={false}
        onTransform={handleResize}
      />

      <KonvaTransformer
        ref={transformerRef}
        // アスペクト非変更は許可しない
        rotateEnabled={false}
        flipEnabled={false}
        enabledAnchors={['bottom-right']}
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
          x={imageRef.current ? imageRef.current.width() : 0}
        />
      </KonvaTransformer>
    </>
  );
});

