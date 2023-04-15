import { Button, Grid, Box } from '@mui/material';
import Konva from 'konva';
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Star, Rect, Circle, Line, Shape, Image, Transformer, KonvaNodeEvents } from 'react-konva';
import useImage from 'use-image';


const generateShapes = ({
  numOfShapes = 10, 
  width = 400, 
  height = 1200,
}: {
  numOfShapes?: number;
  width?: number;
  height?: number;
}) => [...Array(numOfShapes)].map((_, i) => ({
  id: i.toString(),
  x: Math.random() * width,
  y: Math.random() * height,
  rotation: Math.random() * 180,
  isDragging: false,
}));

const imageWidth = 400;
const imageHeight= 800;


const initialRectangles:  Array<React.ComponentProps<typeof Rect>> = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: 'red',
    id: 'rect1',
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: 'green',
    id: 'rect2',
  },
];


type TranslatedImage = {
  x: number;
  y: number;
  src: string;
}

const URLImage: React.FC<{image: TranslatedImage}> = ({ image }) => {
  const [img] = useImage(image.src);
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      draggable={true}
      isSelected={true}
      // I will use offset to set origin to the center of the image
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
    />
  );
};

export const Sample: React.VFC = () => {

  const [stars, setStars] = useState((generateShapes({width:imageWidth, height: imageHeight})));
  const [image] = useImage('https://konvajs.org/assets/lion.png', 'anonymous');
  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.cache();
    }
  }, [image]);

  const handleDragEnd = () => {
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: false,
        };
      })
    );
  };


  const handleExport = () => {
    if (!stageRef.current) return;

    const uri = stageRef.current.toDataURL();
    downloadURI(uri, 'stage.png');
  };

  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedId, selectShape] = useState<string>("");

  const checkDeselect = (e: Konva.KonvaEventObject<Event>): void => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape('');
    }
  };

  const hoge = false;

  const [dragUrl,setDragUrl] = useState('');
  const [translatedImages, setTranslatedImages] = React.useState<TranslatedImage[]>([]);


  if (!hoge) {
    return <Grid container direction="column">
      <Grid item>
      ここから
      </Grid>
      <Grid item>
      </Grid>
      <Grid item>
        ここまで
      </Grid>
    </Grid>
  }

  return (
    <Box m={4}>
      <Grid container direction="column" alignContent="center" spacing={4}>
      {/* <Grid item>
        <DynamicText />
      </Grid> */}
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleExport}>Click here to log stage data URL</Button>
        </Grid>
        <Grid item>
          <img
            alt="lion"
            src="https://konvajs.org/assets/lion.png"
            draggable="true"
            onDragStart={(e) => {
              const html = e.dataTransfer.getData('text/html');
              const src = new DOMParser().parseFromString(html, "text/html").querySelector('img')?.src ?? '';
              setDragUrl(src)
            }}
          />
        </Grid>
        {hoge && (

        <Grid item
          onDrop={(e) => {
            e.preventDefault();
            
            if (!stageRef.current) return;

            // register event position
            stageRef.current.setPointersPositions(e);
            const position = stageRef.current.getPointerPosition();

            if (!position) return;

            const newOne = {...position, src: dragUrl};

            // add image
            setTranslatedImages((current) => current.concat([newOne]));
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Stage 
            ref={stageRef} 
            width={imageWidth}
            height={imageHeight}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            style={{
              border: '1px solid black',
              width: imageWidth,
              height: imageHeight,
            }}
          >
            <Layer>
              {translatedImages.map((image) => <URLImage image={image} />)}
              {rectangles.map((rect, i) => (
                <Rectangle
                  key={i}
                  shapeProps={rect}
                  isSelected={rect.id !== undefined &&selectedId !== null && rect.id === selectedId}
                  onSelect={() => {
                    selectShape(rect.id ?? '');
                  }}
                  onChange={(newAttrs) => {
                    const rects = rectangles.slice();
                    rects[i] = newAttrs;
                    setRectangles(rects);
                  }}
                />
              ))}
              {hoge && (<>
                <Image
                  image={image} 
                  x={100}
                  y={400}
                  draggable
                  filters={[Konva.Filters.Blur]}
                  blurRadius={10}
                  ref={imageRef}
                />
                <Rect 
                  x={20}
                  y={50}
                  width={100}
                  height={100}
                  fill="red"
                  shadowBlur={10}
                />
                <Circle 
                  x={200}
                  y={200}
                  radius={50}
                  fill='green'
                />
                <Line
                  x={20}
                  y={200}
                  points={[0, 0, 100, 0, 100, 100]}
                  tension={0.5}
                  closed
                  stroke="black"
                  fillLinearGradientStartPoint={{ x: -50, y: -50 }}
                  fillLinearGradientEndPoint={{ x: 50, y: 50 }}
                  fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
                />
                <Shape
                  sceneFunc={(context, shape) => {
                    context.beginPath();
                    context.moveTo(20, 50);
                    context.lineTo(220, 80);
                    context.quadraticCurveTo(150, 100, 260, 170);
                    context.closePath();
                    // (!) Konva specific method, it is very important
                    context.fillStrokeShape(shape);
                  }}
                  fill="#00D2FF"
                  stroke="black"
                  strokeWidth={4}
                />
              </>)}
              {hoge && stars.map((star) => (
                <Star
                  key={star.id}
                  id={star.id}
                  x={star.x}
                  y={star.y}
                  numPoints={5}
                  innerRadius={20}
                  outerRadius={40}
                  fill="#89b717"
                  opacity={0.8}
                  draggable
                  rotation={star.rotation}
                  shadowColor="black"
                  shadowBlur={10}
                  shadowOpacity={0.6}
                  shadowOffsetX={star.isDragging ? 10 : 5}
                  shadowOffsetY={star.isDragging ? 10 : 5}
                  scaleX={star.isDragging ? 1.2 : 1}
                  scaleY={star.isDragging ? 1.2 : 1}
                  onDragStart={(e) => {
                    const id = e.target.id();
                    setStars(
                      stars.map((star) => {
                        return {
                          ...star,
                          isDragging: star.id === id,
                        };
                      })
                    );
                  }}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </Layer>
          </Stage>
        </Grid>
                )}
      </Grid>
    </Box>
  );
}



const downloadURI = (uri: string, name: string): void => {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



const Rectangle = ({ 
  shapeProps,
  isSelected,
  onSelect,
  onChange 
}: { 
  shapeProps: React.ComponentProps<typeof Rect>,
  isSelected: boolean,
  onSelect: KonvaNodeEvents['onClick'],
  onChange: (newOne: React.ComponentProps<typeof Rect>) => void
}) => {
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = React.useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      const layer = trRef.current.getLayer()
      if (!layer) return;

      layer.batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (!node) return

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
