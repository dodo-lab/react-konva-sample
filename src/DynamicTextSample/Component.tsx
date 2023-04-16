import Konva from 'konva';
import React, { useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { EditableText } from './EditableText';
import { Box, Grid, Button, TextField, InputAdornment  } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ActionKind, WithContext, usePageContext } from './Context';


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

  const updateFontSize= useCallback((fontSize: number) => {
    if (!selected) return;

    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: {
      createdAt: selected.createdAt,
      fontSize,
    }});

  }, [dispatch, selected]);

  const updateWidth= useCallback((width: number) => {
    if (!selected) return;

    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: {
      createdAt: selected.createdAt,
      width,
    }});

  }, [dispatch, selected]);

  const updatePositionX= useCallback((x: number) => {
    if (!selected) return;

    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: {
      createdAt: selected.createdAt,
      x,
    }});

  }, [dispatch, selected]);

  const updatePositionY= useCallback((y: number) => {
    if (!selected) return;

    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: {
      createdAt: selected.createdAt,
      y,
    }});

  }, [dispatch, selected]);

  const toggleFontStyle= useCallback(() => {
    if (!selected) return;

    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: {
      createdAt: selected.createdAt,
      isBold: !selected.isBold,
    }});

  }, [dispatch, selected]);

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
            sx={{
              opacity: selected ? 1: 0.3,
              "&:hover": selected ? {}: {cursor: 'not-allowed'},
            }}
          >
            <Grid item>
              <Box fontSize="h5.fontSize">General</Box>
            </Grid>

            <Grid item container direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <Box fontSize="h6.fontSize">Size：</Box>
              </Grid>
              <Grid item xs={8} container direction="row">
                <Grid item>
                  <TextField
                    type="number"
                    value={selected?.width ?? 0}
                    size='small'
                    sx={{width: '8rem'}}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">W</InputAdornment>
                    }}
                    onChange={(e) => {
                      const str = e.target.value;
                      if (str === '') return;

                      const num = Number(str)
                      if (Number.isNaN(num)) return;

                      const newOne = Math.min(1000, Math.max(0, num));
                      updateWidth(newOne);
                    }}
                  />

                </Grid>
              </Grid>
            </Grid>

            <Grid item container direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <Box fontSize="h6.fontSize">Position：</Box>
              </Grid>
              <Grid item xs={8} container direction="row">
              <Grid item>
                  <TextField
                    type="number"
                    value={selected?.x ?? 0}
                    size='small'
                    sx={{width: '8rem'}}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">X</InputAdornment>
                    }}
                    onChange={(e) => {
                      const str = e.target.value;
                      if (str === '') return;

                      const num = Number(str)
                      if (Number.isNaN(num)) return;

                      const newOne = Math.min(1000, Math.max(0, num));
                      updatePositionX(newOne);
                    }}
                  />

                </Grid>
                <Grid item>
                  <TextField
                    type="number"
                    value={selected?.y ?? 0}
                    size='small'
                    sx={{width: '8rem'}}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">Y</InputAdornment>
                    }}
                    onChange={(e) => {
                      const str = e.target.value;
                      if (str === '') return;

                      const num = Number(str)
                      if (Number.isNaN(num)) return;

                      const newOne = Math.min(1000, Math.max(0, num));
                      updatePositionY(newOne);
                    }}
                  />

                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Box fontSize="h5.fontSize">Text</Box>
            </Grid>

            <Grid item container direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <Box fontSize="h6.fontSize">Size：</Box>
              </Grid>
              <Grid item xs={8} container direction="row">
                <Grid item>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    sx={{height: '100%'}}
                    onClick={() => {
                      const current = selected?.fontSize ?? 0;
                      const newOne = Math.max(0, current - 1);
                      updateFontSize(newOne);
                    }}
                  >
                    -
                  </Button>
                </Grid>
                <Grid item>
                  <TextField
                    type="number"
                    value={selected?.fontSize ?? 0}
                    size='small'
                    sx={{width: '4rem'}}
                    onChange={(e) => {
                      const str = e.target.value;
                      if (str === '') return;

                      const num = Number(str)
                      if (Number.isNaN(num)) return;

                      const newOne = Math.min(42, Math.max(0, num));
                      updateFontSize(newOne);
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    sx={{height: '100%'}}
                    onClick={() => {
                      const current = selected?.fontSize ?? 0;
                      const newOne = Math.min(42, current + 1);
                      updateFontSize(newOne);
                    }}
                  >
                    +
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item container direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <Box fontSize="h6.fontSize">Style：</Box>
              </Grid>
              <Grid item xs={8} container direction="row">
                <Grid item>
                  <Button
                    variant={selected?.isBold ? 'contained': 'outlined'}
                    color="inherit"
                    size="small"
                    sx={{height: '100%', fontWeight: 'bold'}}
                    onClick={() => toggleFontStyle()}
                  >
                    B
                  </Button>
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};


