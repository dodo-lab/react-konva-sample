import Konva from 'konva';
import React, { useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { EditableText } from './EditableText';
import { Card, Box, Grid, Button } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ActionKind, WithContext, usePageContext } from './Context';
import { ImageStyleEditor, TextStyleEditor } from './StyleEditor';
import { EditableImage } from './EditableImage';
import { ImageInfo, TextInfo } from './type';


const STAGE_WIDTH = 600;
const STAGE_HIGHT = 1000;

const Component: React.FC = () => {
  return (
    <WithContext>
      <Content />
    </WithContext>
  );
};

export default Component;


const Content: React.FC = () => {
  const {state: {selected, texts, images}, dispatch} = usePageContext();

  const stageRef = useRef<Konva.Stage>(null);

  const onClickAddText = useCallback(()=> {
    dispatch({type: ActionKind.ADD_TEXT, payload: {
      x: 100, // 位置は適当
      y: 100, // // 位置は適当
      fontSize: 20,
      lineHeight: 1.4,
      width: 200,
      text: '何か入力してください',
      isBold: false,
    }});
  }, [dispatch]);

  const addElement = useCallback((e: React.DragEvent<HTMLDivElement>)=> {
    e.preventDefault();

    if (!stageRef.current) return;


    stageRef.current.setPointersPositions(e);
    const position = stageRef.current.getPointerPosition();

    if (!position) return;

    const elementType = e.dataTransfer.getData('type');
    if (elementType === 'text') {
        dispatch({type: ActionKind.ADD_TEXT, payload: {
          ...position,
          fontSize: 20,
        width: 200,
        lineHeight: 1.4,
        text: '何か入力してください',
        isBold: false,
      }});
    }

    if (elementType === 'image') {
      dispatch({type: ActionKind.ADD_IMAGE, payload: {
        ...position,
        width: 100,
        height: 100,
        src: e.dataTransfer.getData('src'),
      }});
    }

  }, [dispatch]);

  return (
    <Box m={4}>
      <Grid container direction="column"  spacing={4}>
        <Grid item container direction="row" spacing={2} wrap="nowrap">
        <Grid item>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<DragIndicatorIcon />}
              draggable="true"
              onClick={onClickAddText}
              onDragStart={(e) => {
                e.dataTransfer.setData('type', 'text')
              }}
            >テキスト追加</Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<DragIndicatorIcon />}
              draggable="true"
              onClick={onClickAddText}
            >
              <img
                alt="lion"
                src="https://konvajs.org/assets/lion.png"
                draggable="true"
                onDragStart={(e) => {
                  const html = e.dataTransfer.getData('text/html');
                  const src = new DOMParser().parseFromString(html, "text/html").querySelector('img')?.src ?? '';
                  console.log(src)
                  e.dataTransfer.setData('type', 'image')
                  e.dataTransfer.setData('src', src)
                }}
              />
            </Button>
          </Grid>
        </Grid>
        <Grid item container direction="row" spacing={4} wrap="nowrap">
          <Grid item xs={8}>
            <Box
              onDrop={addElement}
              onDragOver={(e) => e.preventDefault()}
            >
              <Stage
                ref={stageRef}
                width={STAGE_WIDTH}
                height={STAGE_HIGHT}
                onClick={(e) => {
                  if (e.currentTarget._id === e.target._id) {
                    dispatch({type: ActionKind.RELEASE_SELECTED})
                  };
                }}
                style={{
                  width: STAGE_WIDTH,
                  height: STAGE_HIGHT,
                  border: '1px solid gray'
                }}
              >
                <Layer>
                {texts.map((item) => <EditableText key={item.createdAt} item={item} maxWidth={STAGE_WIDTH} />)}
                {images.map((item) => <EditableImage key={item.createdAt} item={item} maxWidth={STAGE_WIDTH} />)}
                </Layer>
              </Stage>
            </Box>
          </Grid>


          <Grid
            item
            xs={4}
            container
            direction="column"
            spacing={2}
          >
            <Grid item sx={{
              opacity: selected ? 1: 0.3,
              "&:hover": selected ? {}: {cursor: 'not-allowed'},
            }}>
              {isText(selected) && <TextStyleEditor selected={selected}/>}
              {isImage(selected) && <ImageStyleEditor selected={selected}/>}
            </Grid>
            <ShowState />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const ShowState: React.FC = () => {
  const {state} = usePageContext();
  const value = JSON.stringify(state, null, 4);
  return (
    <Card variant="outlined" sx={{padding: 2}}>
      <Box sx={{whiteSpace: "pre-wrap"}}>
        {value}
      </Box>
    </Card>
  );
}

const isText = (obj: TextInfo | ImageInfo | undefined) : obj is TextInfo => obj !== undefined && 'fontSize' in obj;
const isImage = (obj: TextInfo | ImageInfo | undefined) : obj is ImageInfo => obj !== undefined && 'src' in obj;
