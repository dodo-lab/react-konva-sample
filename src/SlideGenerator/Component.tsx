import Konva from 'konva';
import React, { useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import {Node} from 'konva/lib/Node'
import { EditableText } from './EditableText';
import { Card, Box, Grid, Button } from '@mui/material';
import { ActionKind, WithContext, usePageContext } from './Context';
import { ImageStyleEditor, LineStyleEditor, TextStyleEditor } from './ElementEditor';
import { EditableImage } from './EditableImage';
import { ImageInfo, LineInfo, TextInfo } from './type';
import { ElementTemplates } from './ElementTemplates';
import { EditableLine } from './EditableLine';


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
  const {state: {selected, texts, images, lines}, dispatch} = usePageContext();

  const stageRef = useRef<Konva.Stage>(null);


  const downloadImage = useCallback(() => {
    if (!stageRef.current) return

    const dataUrl = stageRef.current.toDataURL({mimeType: 'image/png'});

    const link = document.createElement('a');
    // URL設定
    link.href = dataUrl;

    // ファイル名設定
    const fileName = "sample.png";
    link.setAttribute('download', fileName);

    // ノードを追加。作成したlinkを小ノードとして追加
    document.body.appendChild(link);
    link.click();
    // aタグをHTMLから除去
    link.remove();
  },[]);

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

    if (elementType === 'line') {
      dispatch({type: ActionKind.ADD_LINE, payload: {
        ...position,
        width: 200,
        height: 3,
        stroke: 'black',
      }});
    }

  }, [dispatch]);

  return (
    <Box m={4}>
      <Grid container direction="column"  spacing={4}>
        <Grid item>
          <Button color="primary" variant="contained" size="large" onClick={downloadImage}>画像取得</Button>
        </Grid>

        <ElementTemplates />
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
                style={{
                  width: STAGE_WIDTH,
                  height: STAGE_HIGHT,
                  border: '1px solid gray'
                }}
              >
                <Layer>
                  <Rect x={0} y={0} width={STAGE_WIDTH} height={STAGE_HIGHT} fill='white' onClick={(e) => {
                    if (e.currentTarget._id === e.target._id) {
                      dispatch({type: ActionKind.RELEASE_SELECTED})
                    };
                  }} />
                  {texts.map((item) => <EditableText key={item.createdAt} item={item} maxWidth={STAGE_WIDTH} />)}
                  {images.map((item) => <EditableImage key={item.createdAt} item={item} maxWidth={STAGE_WIDTH} />)}
                  {lines.map((item) => <EditableLine key={item.createdAt} item={item} maxWidth={STAGE_WIDTH} />)}
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
              {isLine(selected) && <LineStyleEditor selected={selected}/>}
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

const isText = (obj: TextInfo | ImageInfo | LineInfo | undefined) : obj is TextInfo => obj !== undefined && 'fontSize' in obj;
const isImage = (obj: TextInfo | ImageInfo | LineInfo | undefined) : obj is ImageInfo => obj !== undefined && 'src' in obj;
const isLine = (obj: TextInfo | ImageInfo | LineInfo | undefined) : obj is LineInfo => obj !== undefined && 'stroke' in obj;
