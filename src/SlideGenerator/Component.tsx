import Konva from 'konva';
import React, { useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { EditableText } from './EditableText';
import { Card, Box, Grid, Button } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ActionKind, WithContext, usePageContext } from './Context';
import { StyleEditor } from './StyleEditor';


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
  const {state: {selected, texts}, dispatch} = usePageContext();

  const stageRef = useRef<Konva.Stage>(null);

  const onClickAddText = useCallback(()=> {
    dispatch({type: ActionKind.ADD_TEXT, payload: {
      x: 100, // 位置は適当
      y: 100, // // 位置は適当
      fontSize: 20,
      width: 200,
      text: '何か入力してください',
      isBold: false,
    }});
  }, [dispatch]);

  const onDropAddText = useCallback((e: React.DragEvent<HTMLDivElement>)=> {
    e.preventDefault();

    if (!stageRef.current) return;

    stageRef.current.setPointersPositions(e);
    const position = stageRef.current.getPointerPosition();

    if (!position) return;

    dispatch({type: ActionKind.ADD_TEXT, payload: {
      ...position,
      fontSize: 20,
      width: 200,
      text: '何か入力してください',
      isBold: false,
    }});
  }, [dispatch]);

  return (
    <Box m={4}>
      <Grid container direction="column"  spacing={4}>
        <Grid item>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<DragIndicatorIcon />}
            draggable="true"
            onClick={onClickAddText}
          >テキスト追加</Button>
        </Grid>
        <Grid item container direction="row" spacing={4}>
          <Grid item xs={8}>
            <Box
              onDrop={onDropAddText}
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
              <StyleEditor />
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
      <Box sx={{whiteSpace: "pre"}}>
        {value}
      </Box>
    </Card>
  );
}
