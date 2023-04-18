import React, { useCallback } from 'react';
import { Card, Box, Grid, Button, TextField, InputAdornment  } from '@mui/material';
import { ActionKind, usePageContext } from './Context';
import { ImageInfo, LineInfo, TextInfo } from './type';

type NumberAttrsInTextInfo = 'x' | 'y' | 'width' | 'lineHeight' | 'fontSize';
type NumberAttrsInImageInfo = 'x' | 'y' | 'width' | 'height';
type NumberAttrsInLineInfo = 'x' | 'y' | 'width' | 'height';

type EditorSetting = {
  min: number;
  max: number;
  step: number;
};

const EDITOR_SETTINGS = {
  fontSize: {
    max: 40,
    min: 4,
    step: 1,
  },
  lineHeight: {
    max: 3,
    min: 0.5,
    step: 0.1,
  },
  stroke: {
    max: 5,
    min: 1,
    step: 0.1,
  },
  width: { // TODO Stageサイズに合わせたい
    max: 1000,
    min: 10,
    step: 1,
  },
  height: { // TODO Stageサイズに合わせたい
    max: 1000,
    min: 10,
    step: 1,
  },
  x: { // TODO Stageサイズに合わせたい
    max: 1000,
    min: 0,
    step: 1,
  },
  y: { // TODO Stageサイズに合わせたい
    max: 1000,
    min: 0,
    step: 1,
  }
} as const;

const clamp = (num: number, {min, max, step}: EditorSetting) => Math.min(Math.max(num, min), max);
const upAndClamp = (num: number, {min, max, step}: EditorSetting) => Math.min(Math.max(num + step, min), max);
const downAndClamp = (num: number, {min, max, step}: EditorSetting) => Math.min(Math.max(num - step, min), max);


const useNumberEditorFnText = (selected: TextInfo, attrName: keyof Pick<TextInfo, NumberAttrsInTextInfo>, setting: EditorSetting) => {
  const {dispatch} = usePageContext();

  const up= useCallback(() => {
    if (!selected) return;

    const current = selected[attrName];
    const clamped = upAndClamp(current, setting);

    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: {
      createdAt: selected.createdAt,
      [attrName]: clamped,
    }});

  }, [attrName, dispatch, selected, setting]);

  const down= useCallback(() => {
    if (!selected) return;

    const current = selected[attrName];
    const clamped = downAndClamp(current, setting);

    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: {
      createdAt: selected.createdAt,
      [attrName]: clamped,
    }});

  }, [attrName, dispatch, selected, setting]);

  const set= useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selected) return;

    const str = e.target.value;
    if (str === '') return;

    const num = Number(str)
    if (Number.isNaN(num)) return;

    const clamped = clamp(num, setting);

    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: {
      createdAt: selected.createdAt,
      [attrName]: clamped,
    }});
  }, [attrName, dispatch, selected, setting]);

  return {up, down, set}
}


const useNumberEditorFnForImage = (selected: ImageInfo, attrName: keyof Pick<ImageInfo, NumberAttrsInImageInfo>, setting: EditorSetting) => {
  const {dispatch} = usePageContext();

  const up= useCallback(() => {
    if (!selected) return;

    const current = selected[attrName];
    const clamped = upAndClamp(current, setting);

    dispatch({type: ActionKind.UPDATE_SELECTED_IMAGE, payload: {
      createdAt: selected.createdAt,
      [attrName]: clamped,
    }});

  }, [attrName, dispatch, selected, setting]);

  const down= useCallback(() => {
    if (!selected) return;

    const current = selected[attrName];
    const clamped = downAndClamp(current, setting);

    dispatch({type: ActionKind.UPDATE_SELECTED_IMAGE, payload: {
      createdAt: selected.createdAt,
      [attrName]: clamped,
    }});

  }, [attrName, dispatch, selected, setting]);

  const set= useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selected) return;

    const str = e.target.value;
    if (str === '') return;

    const num = Number(str)
    if (Number.isNaN(num)) return;

    const clamped = clamp(num, setting);

    dispatch({type: ActionKind.UPDATE_SELECTED_IMAGE, payload: {
      createdAt: selected.createdAt,
      [attrName]: clamped,
    }});
  }, [attrName, dispatch, selected, setting]);

  return {up, down, set}
}


const useNumberEditorFnForLine = (selected: LineInfo, attrName: keyof Pick<LineInfo, NumberAttrsInLineInfo>, setting: EditorSetting) => {
  const {dispatch} = usePageContext();

  const up= useCallback(() => {
    if (!selected) return;

    const current = selected[attrName];
    const clamped = upAndClamp(current, setting);

    dispatch({type: ActionKind.UPDATE_SELECTED_LINE, payload: {
      createdAt: selected.createdAt,
      [attrName]: clamped,
    }});

  }, [attrName, dispatch, selected, setting]);

  const down= useCallback(() => {
    if (!selected) return;

    const current = selected[attrName];
    const clamped = downAndClamp(current, setting);

    dispatch({type: ActionKind.UPDATE_SELECTED_LINE, payload: {
      createdAt: selected.createdAt,
      [attrName]: clamped,
    }});

  }, [attrName, dispatch, selected, setting]);

  const set= useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selected) return;

    const str = e.target.value;
    if (str === '') return;

    const num = Number(str)
    if (Number.isNaN(num)) return;

    const clamped = clamp(num, setting);

    dispatch({type: ActionKind.UPDATE_SELECTED_LINE, payload: {
      createdAt: selected.createdAt,
      [attrName]: clamped,
    }});
  }, [attrName, dispatch, selected, setting]);

  return {up, down, set}
}

export const TextStyleEditor: React.FC<{selected: TextInfo}> = ({selected}) => {
  const {dispatch} = usePageContext();

  const widthFn = useNumberEditorFnText(selected, 'width', EDITOR_SETTINGS.width)
  const fontSizeFn = useNumberEditorFnText(selected, 'fontSize', EDITOR_SETTINGS.fontSize)
  const xFn = useNumberEditorFnText(selected, 'x', EDITOR_SETTINGS.x)
  const yFn = useNumberEditorFnText(selected, 'y', EDITOR_SETTINGS.y)
  const lineHeightFn = useNumberEditorFnText(selected, 'lineHeight', EDITOR_SETTINGS.lineHeight)

  // 太字
  const toggleFontStyle= useCallback(() => {
    if (!selected) return;

    dispatch({type: ActionKind.UPDATE_SELECTED_TEXT, payload: {
      createdAt: selected.createdAt,
      isBold: !selected.isBold,
    }});

  }, [dispatch, selected]);

  return (
    <Card variant="outlined" sx={{padding: 2}}>
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Box fontSize="h5.fontSize">General</Box>
      </Grid>

      <Grid item container direction="row" alignItems="center" spacing={2}>
        <Grid item>
          <Box fontSize="h6.fontSize">Width：</Box>
        </Grid>
        <Grid item xs={8} container direction="row">
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={widthFn.down}
            >
              -
            </Button>
          </Grid>

          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.width}
              value={selected?.width ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: "center"}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">W</InputAdornment>
              }}
              onChange={widthFn.set}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={widthFn.up}
            >
              +
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container direction="row" alignItems="center" spacing={2} wrap="nowrap">
        <Grid item>
          <Box fontSize="h6.fontSize">Position：</Box>
        </Grid>
        <Grid item xs={8} container direction="row" wrap="nowrap">
          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.x}
              value={selected?.x ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: 'right'}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">X</InputAdornment>
              }}
              onChange={xFn.set}
            />
          </Grid>
          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.y}
              value={selected?.y ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: 'right'}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">Y</InputAdornment>
              }}
              onChange={yFn.set}
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
              onClick={fontSizeFn.down}
            >
              -
            </Button>
          </Grid>
          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.fontSize}
              value={selected?.fontSize ?? 0}
              size='small'
              sx={{width: '6rem',input: {textAlign: "center"}}}
              onChange={fontSizeFn.set}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={fontSizeFn.up}
            >
              +
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container direction="row" alignItems="center" spacing={2}>
        <Grid item>
          <Box fontSize="h6.fontSize">Line Height：</Box>
        </Grid>
        <Grid item xs={8} container direction="row">
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={lineHeightFn.down}
            >
              -
            </Button>
          </Grid>
          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.lineHeight}
              value={selected?.lineHeight ?? 0}
              size='small'
              sx={{width: '6rem', input: {textAlign: "center"}}}
              onChange={lineHeightFn.set}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={lineHeightFn.up}
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
              onClick={toggleFontStyle}
            >
              B
            </Button>
          </Grid>
        </Grid>
      </Grid>

    </Grid>
    </Card>
  );
};





export const ImageStyleEditor: React.FC<{selected: ImageInfo}> = ({selected}) => {

  const widthFn = useNumberEditorFnForImage(selected, 'width', EDITOR_SETTINGS.width)
  const heightFn = useNumberEditorFnForImage(selected, 'height', EDITOR_SETTINGS.height)
  const xFn = useNumberEditorFnForImage(selected, 'x', EDITOR_SETTINGS.x)
  const yFn = useNumberEditorFnForImage(selected, 'y', EDITOR_SETTINGS.y)

  return (
    <Card variant="outlined" sx={{padding: 2}}>
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Box fontSize="h5.fontSize">General</Box>
      </Grid>

      <Grid item container direction="row" alignItems="center" spacing={2} wrap="nowrap">
        <Grid item>
          <Box fontSize="h6.fontSize">Width：</Box>
        </Grid>
        <Grid item xs={8} container direction="row" wrap="nowrap">
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={widthFn.down}
            >
              -
            </Button>
          </Grid>

          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.width}
              value={selected?.width ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: "center"}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">W</InputAdornment>
              }}
              onChange={widthFn.set}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={widthFn.up}
            >
              +
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container direction="row" alignItems="center" spacing={2} wrap="nowrap">
        <Grid item>
          <Box fontSize="h6.fontSize">Height：</Box>
        </Grid>
        <Grid item xs={8} container direction="row" wrap="nowrap">
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={heightFn.down}
            >
              -
            </Button>
          </Grid>

          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.height}
              value={selected?.height ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: "center"}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">W</InputAdornment>
              }}
              onChange={heightFn.set}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={heightFn.up}
            >
              +
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container direction="row" alignItems="center" spacing={2} wrap="nowrap">
        <Grid item>
          <Box fontSize="h6.fontSize">Position：</Box>
        </Grid>
        <Grid item xs={8} container direction="row" wrap="nowrap">
          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.x}
              value={selected?.x ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: 'right'}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">X</InputAdornment>
              }}
              onChange={xFn.set}
            />
          </Grid>
          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.y}
              value={selected?.y ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: 'right'}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">Y</InputAdornment>
              }}
              onChange={yFn.set}
            />
          </Grid>
        </Grid>
      </Grid>

    </Grid>
    </Card>
  );
};


export const LineStyleEditor: React.FC<{selected: LineInfo}> = ({selected}) => {

  const widthFn = useNumberEditorFnForLine(selected, 'width', EDITOR_SETTINGS.width)
  const heightFn = useNumberEditorFnForLine(selected, 'height', EDITOR_SETTINGS.stroke) // TODO 微妙
  const xFn = useNumberEditorFnForLine(selected, 'x', EDITOR_SETTINGS.x)
  const yFn = useNumberEditorFnForLine(selected, 'y', EDITOR_SETTINGS.y)

  return (
    <Card variant="outlined" sx={{padding: 2}}>
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Box fontSize="h5.fontSize">General</Box>
      </Grid>

      <Grid item container direction="row" alignItems="center" spacing={2} wrap="nowrap">
        <Grid item>
          <Box fontSize="h6.fontSize">Width：</Box>
        </Grid>
        <Grid item xs={8} container direction="row" wrap="nowrap">
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={widthFn.down}
            >
              -
            </Button>
          </Grid>

          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.width}
              value={selected?.width ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: "center"}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">W</InputAdornment>
              }}
              onChange={widthFn.set}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={widthFn.up}
            >
              +
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container direction="row" alignItems="center" spacing={2} wrap="nowrap">
        <Grid item>
          <Box fontSize="h6.fontSize">Height：</Box>
        </Grid>
        <Grid item xs={8} container direction="row" wrap="nowrap">
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={heightFn.down}
            >
              -
            </Button>
          </Grid>

          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.stroke} // TODO
              value={selected?.height ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: "center"}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">W</InputAdornment>
              }}
              onChange={heightFn.set}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{height: '100%'}}
              onClick={heightFn.up}
            >
              +
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container direction="row" alignItems="center" spacing={2} wrap="nowrap">
        <Grid item>
          <Box fontSize="h6.fontSize">Position：</Box>
        </Grid>
        <Grid item xs={8} container direction="row" wrap="nowrap">
          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.x}
              value={selected?.x ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: 'right'}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">X</InputAdornment>
              }}
              onChange={xFn.set}
            />
          </Grid>
          <Grid item>
            <TextField
              type="number"
              inputProps={EDITOR_SETTINGS.y}
              value={selected?.y ?? 0}
              size='small'
              sx={{width: '8rem', input: {textAlign: 'right'}}}
              InputProps={{
                endAdornment: <InputAdornment position="end">Y</InputAdornment>
              }}
              onChange={yFn.set}
            />
          </Grid>
        </Grid>
      </Grid>

    </Grid>
    </Card>
  );
};
