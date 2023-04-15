import Konva from 'konva';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import * as EditableText from './EditableText';

const STAGE_WIDTH = 300;
const STAGE_HIGHT = 600;

export const DynamicText: React.FC = () => {
  const [text, setText] = useState("Click to resize. Double click to edit.");
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const setPosition = useCallback((newXValue: number,newYValue: number) => {
    setX(newXValue);
    setY(newYValue);
  }, []);


  const textRef = useRef<Konva.Text>(null);
  const trRef = React.useRef<Konva.Transformer>(null);


  const [isSelected, setSelected] = useState(false);

  useEffect(()=> { 
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      const layer = trRef.current.getLayer()
      if (!layer) return;

      layer.batchDraw();
    }
  }, [isSelected]);


  const [isEditing, setIsEditing] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  const startEditing = useCallback(() => {
    setIsEditing(true);
    setSelected(true);
  }, []);

  const startTransforming = useCallback(() => {
    setIsTransforming(true);
    setSelected(true);
  }, []);

  const release = useCallback(() => {
    setSelected(false);
    setIsEditing(false);
    setIsTransforming(false);
  }, []);

  const setSize = useCallback((newWidth:number, newHeight: number) => {
    setWidth(newWidth);
    setHeight(newHeight);
  }, []);


  return (
    <Stage
      width={STAGE_WIDTH}
      height={STAGE_HIGHT}
      onClick={(e) => {
        if (e.currentTarget._id === e.target._id) release();
      }}
      style={{
        width: STAGE_WIDTH,
        height: STAGE_HIGHT,
        border: '1px solid gray'
      }}
    >
      <Layer>
        {isEditing ? (
          <EditableText.Editor
            x={x}
            y={y}
            
            width={width}
            height={height}
            
            value={text}
            setValue={setText}
            finishEditing={release}
          />
        ) : (
          <EditableText.PreviewAndTransformer
            x={x}
            y={y}
            setPosition={setPosition}

            width={width}
            height={height}
            setSize={setSize}

            isSelected={isTransforming}
            startTransforming={startTransforming}
            startEditing={startEditing}
            text={text}
          />
        )}
      </Layer>
    </Stage>
  );
}
