import React, { useCallback } from 'react';
import { Grid, Button } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ActionKind, usePageContext } from './Context';


export const ElementTemplates: React.FC = () => {

  const {dispatch} = usePageContext();

  const onDragStartText = useCallback((e: React.DragEvent<HTMLButtonElement>)=> {
    e.dataTransfer.setData('type', 'text')
  }, []);

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

  const onClickAddImage = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
    dispatch({type: ActionKind.ADD_IMAGE, payload: {
      x: 100, // 位置は適当
      y: 100, // // 位置は適当
      width: 100,
      height: 100,
      src: "https://konvajs.org/assets/lion.png", // TODO どっかから持ってくる
    }});
  }, [dispatch]);


  const onDragStartImage = useCallback((e:React.DragEvent<HTMLImageElement>) => {
    const html = e.dataTransfer.getData('text/html');
    const src = new DOMParser().parseFromString(html, "text/html").querySelector('img')?.src ?? '';
    e.dataTransfer.setData('type', 'image')
    e.dataTransfer.setData('src', src)
  },[]);


  const onDragStartLine = useCallback((e: React.DragEvent<HTMLButtonElement>)=> {
    e.dataTransfer.setData('type', 'line')
  }, []);

  const onClickAddLine = useCallback(()=> {
    dispatch({type: ActionKind.ADD_LINE, payload: {
      x: 100, // 位置は適当
      y: 100, // // 位置は適当
      width: 200,
      height: 3,
      stroke: 'black',
    }});
  }, [dispatch]);


  return (
    <Grid item container direction="row" spacing={2} wrap="nowrap">
      <Grid item>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<DragIndicatorIcon />}
          draggable="true"
          onClick={onClickAddText}
          onDragStart={onDragStartText}
        >テキスト</Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<DragIndicatorIcon />}
          draggable="true"
          onClick={onClickAddImage}
        >
          <img
            alt="lion"
            src="https://konvajs.org/assets/lion.png"
            draggable="true"
            onDragStart={onDragStartImage}
            height={26}
          />
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<DragIndicatorIcon />}
          draggable="true"
          onClick={onClickAddLine}
          onDragStart={onDragStartLine}
        >
          罫線
        </Button>
      </Grid>
    </Grid>
  );

};
