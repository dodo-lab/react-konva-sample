import React, { useCallback } from 'react';
import { Card, Box, Grid, Button, TextField, InputAdornment  } from '@mui/material';
import { ActionKind, usePageContext } from './Context';


export const StyleEditor: React.FC = () => {
  const {state: {selected}, dispatch} = usePageContext();

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

      <Grid item container direction="row" alignItems="center" spacing={2} wrap="nowrap">
        <Grid item>
          <Box fontSize="h6.fontSize">Position：</Box>
        </Grid>
        <Grid item xs={8} container direction="row" wrap="nowrap">
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
    </Card>
  );
};


