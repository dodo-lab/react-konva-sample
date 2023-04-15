import Konva from 'konva';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import * as EditableText from './EditableText';
import dayjs from 'dayjs';
import { Box, Grid, Button } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';


const STAGE_WIDTH = 600;
const STAGE_HIGHT = 1000;

type TextInfo = {
  createdAt: string; // 一意に特定するキー(msecまで)
  x: number;
  y: number;
  fontSize: number;
  width: number;
  height: number;
  text: string;
  isBold: boolean;
}

export const DynamicText: React.FC = () => {
  const [textInfoList, setTextInfoList] = React.useState<TextInfo[]>([]);

  const addTextInfo = useCallback((newOne: Omit<TextInfo, 'createdAt'>) => {
    setTextInfoList((current) => {
      const newOneWithCreatedAt =  {...newOne, createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')};
      return [...current, newOneWithCreatedAt];
    });
  },[])

  const removeTextInfo = useCallback((createdAt: string) => {
    setTextInfoList((current)=> current.filter((one)=> one.createdAt !== createdAt));
  }, []);

  const updateTextInfo = useCallback((createdAt: string, updated: Partial<TextInfo>) => {
    setTextInfoList((current) => {
      return current.map((one) => {
        if (one.createdAt === createdAt) {
          return {...one, ...updated};
        }

        return one;
      });
    });
  }, []);

  const stageRef = useRef<Konva.Stage>(null);

  const onClickAddText = useCallback(()=> {
    addTextInfo({
      x: 100, // 位置は適当
      y: 100, // // 位置は適当
      fontSize: 20,
      width: 200,
      height: 100,
      text: '何か入力してください',
      isBold: false,
    });
  }, [addTextInfo]);

  const onDropAddText = useCallback((e: React.DragEvent<HTMLDivElement>)=> {
    e.preventDefault();

    if (!stageRef.current) return;

    stageRef.current.setPointersPositions(e);
    const position = stageRef.current.getPointerPosition();

    if (!position) return;

    addTextInfo({
      ...position,
      fontSize: 20,
      width: 200,
      height: 100,
      text: '何か入力してください',
      isBold: false,
    });

  }, [addTextInfo]);
  
  return (
    <Box m={4}>
      <Grid container direction="column" alignContent="center" spacing={4}>
        <Grid item>
          <Button
            variant="contained"
            color="inherit" 
            startIcon={<DragIndicatorIcon />}
            draggable="true"
            onClick={onClickAddText}
          >テキスト追加</Button>
        </Grid>
        <Grid item>
          <Box
            onDrop={onDropAddText}
            onDragOver={(e) => e.preventDefault()}
          >
            <Stage
              ref={stageRef} 
              width={STAGE_WIDTH}
              height={STAGE_HIGHT}
              // onClick={(e) => {
              //   if (e.currentTarget._id === e.target._id) releaseAll();
              // }}
              style={{
                width: STAGE_WIDTH,
                height: STAGE_HIGHT,
                border: '1px solid gray'
              }}
            >
              <Layer>
              {textInfoList.map((item) => <DynamicTextContent 
                key={item.createdAt} 
                item={item} 
                updateItem={updateTextInfo} 
                removeItem={removeTextInfo}
              />)}
              </Layer>
            </Stage>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};


const DynamicTextContent: React.FC<{
  item: TextInfo;
  updateItem :(createdAt: string, updated: Partial<TextInfo>) => void;
  removeItem :(createdAt: string) => void;
}> = ({
  item, 
  updateItem,
  removeItem,
}) => {
  const setPosition = useCallback((x: number,y: number) => {
    updateItem(item.createdAt, {x, y})
  }, [item.createdAt, updateItem]);

  const setText = useCallback((text: string) => {
    updateItem(item.createdAt, {text})
  }, [item.createdAt, updateItem]);

  const setSize = useCallback((width:number, height: number) => {
    updateItem(item.createdAt, {width, height})
  }, [item.createdAt, updateItem]);

  const upFontSize = useCallback(() => {
    updateItem(item.createdAt, {fontSize: item.fontSize + 1})
  }, [item.createdAt, item.fontSize, updateItem]);

  const downFontSize = useCallback(() => {
    updateItem(item.createdAt, {fontSize: item.fontSize - 1})
  }, [item.createdAt, item.fontSize, updateItem]);

  const toggleBold = useCallback(() => {
    updateItem(item.createdAt, {isBold: !item.isBold})
  },[item.createdAt, item.isBold, updateItem]);

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


  const remove = useCallback(() => removeItem(item.createdAt), [removeItem, item.createdAt]);

  return (
      <>
        {isEditing ? (
          <EditableText.Editor
            {...item}
            setText={setText}
            finishEditing={release}
          />
        ) : (
          <EditableText.PreviewAndTransformer
            {...item}
            setPosition={setPosition}
            setSize={setSize}
            upFontSize={upFontSize}
            downFontSize={downFontSize}
            isSelected={isTransforming}
            startTransforming={startTransforming}
            startEditing={startEditing}
            remove={remove}
            toggleBold={toggleBold}
          />
        )}
      </>
  );
}
