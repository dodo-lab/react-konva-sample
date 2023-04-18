import Konva from "konva";
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { Transformer as KonvaTransformer, Circle, Line } from "react-konva";
import { LineInfo } from "./type";
import { ActionKind, usePageContext } from "./Context";
import { KonvaEventObject } from "konva/lib/Node";

const EDITOR_MIN_WIDTH = 30;

type Props = {
  item: LineInfo;
  maxWidth: number;
};

const convertInfoToAttrs = (info: LineInfo) => {
  const {x, y, width, height, stroke} = info;
  return {
    x,
    y,
    points: [0, 0, width, 0],
    stroke,
    strokeWidth: height,
  };
};

export const EditableLine: React.FC<Props> = React.memo(({item, maxWidth}) => {
  const {state: {selected, modeOnSelected: mode}} = usePageContext();
  const isSelected = useMemo(() => selected && selected.createdAt === item.createdAt,[item.createdAt, selected]);

  if (isSelected && mode === 'transforming') return <Transformer  item={item} maxWidth={maxWidth} />;
  return <Preview  item={item} maxWidth={maxWidth}  />;
});


const Preview: React.FC<Props> = React.memo(({item}) => {
  const {dispatch} = usePageContext();

  const attrs = useMemo(() => convertInfoToAttrs(item),[item]);
  const elementRef = useRef<Konva.Line>(null);

  const move = useCallback((e: KonvaEventObject<DragEvent>) => {
    const updated = {...item, x: e.target.x(), y:  e.target.y()};
    dispatch({type: ActionKind.UPDATE_SELECTED_LINE, payload: updated});
  }, [dispatch, item]);

  const startTransforming = useCallback(() => dispatch({type: ActionKind.START_TRANSFORMING, payload: item}), [dispatch, item]);


 // 初期表示時
  useEffect(() => {
    if (elementRef.current !== null) {
      const layer = elementRef.current.getLayer();

      if (!layer) return;

      layer.batchDraw();
    }
  }, [item]);

  return (
    <Line
      ref={elementRef}
      {...attrs}
      draggable
      onDragEnd={move}
      // シングル→変形、ダブル→編集
      onClick={startTransforming}
      onTap={startTransforming}
      // その他スタイル
      perfectDrawEnabled={false}
      hitStrokeWidth={20}
    />
  );
});

// 選択済みである前提
const Transformer: React.FC<Props> = React.memo(({item, maxWidth}) => {
  const {dispatch} = usePageContext();

  const attrs = useMemo(() => convertInfoToAttrs(item),[item]);

  const elementRef = useRef<Konva.Line>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const move = useCallback((e: KonvaEventObject<DragEvent>) => {
    const updated = {...item, x: e.target.x(), y:  e.target.y()};
    dispatch({type: ActionKind.UPDATE_SELECTED_LINE, payload: updated});
  }, [dispatch, item]);

  const remove = useCallback(() => dispatch({type: ActionKind.REMOVE_LINE, payload: {createdAt: item.createdAt}}), [dispatch, item])
  const deleteButtonRef = React.useRef<Konva.Circle>(null);

  const handleResize = useCallback(() => {
    const node = elementRef.current;
    if (node !== null) {
      const width = node.width() * node.scaleX();
      const height = node.height() * node.scaleY();
      node.setAttrs({
        width: width,
        scaleX: 1
      });
      const updated = {createdAt: item.createdAt, width, height};
      console.log(item, updated)
      dispatch({type: ActionKind.UPDATE_SELECTED_LINE, payload: updated});
    }
  }, [dispatch, item]);

  // 初期表示時
  useEffect(() => {
    if (transformerRef.current !== null && elementRef.current !== null) {
      transformerRef.current.nodes([elementRef.current]);
      const layer = transformerRef.current.getLayer();

      if (!layer) return;

      layer.batchDraw();
    }
  }, []);

  const startTransforming = useCallback(() => dispatch({type: ActionKind.START_TRANSFORMING, payload: item}), [dispatch, item]);

  return (
    <>
      <Line
        ref={elementRef}
        {...attrs}
        draggable
        onDragEnd={move}
        // シングル→変形、ダブル→編集
        onClick={startTransforming}
        onTap={startTransforming}
        // その他スタイル
        onTransform={handleResize}
        hitStrokeWidth={20}
        />
      <KonvaTransformer
        ref={transformerRef}
        // 幅変更のみ許可
        rotateEnabled={false}
        flipEnabled={false}
        enabledAnchors={[]}
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
          x={elementRef.current ? elementRef.current.width() : 0}
        />
      </KonvaTransformer>
    </>
  );
});
