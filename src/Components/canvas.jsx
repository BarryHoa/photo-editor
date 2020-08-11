import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {EditorStyle, EditorStyleCanvas} from './styled';

/*const HOOK_SVG =  'm129.03125 63.3125c0-34.914062-28.941406-63.3125-64.519531-63.3125-35.574219 0-64.511719 28.398438-64.511719 63.3125 0 29.488281 20.671875 54.246094 48.511719 61.261719v162.898437c0 53.222656 44.222656 96.527344 98.585937 96.527344h10.316406c54.363282 0 98.585938-43.304688 98.585938-96.527344v-95.640625c0-7.070312-4.640625-13.304687-11.414062-15.328125-6.769532-2.015625-14.082032.625-17.960938 6.535156l-42.328125 64.425782c-4.847656 7.390625-2.800781 17.3125 4.582031 22.167968 7.386719 4.832032 17.304688 2.792969 22.160156-4.585937l12.960938-19.71875v42.144531c0 35.582032-29.863281 64.527344-66.585938 64.527344h-10.316406c-36.714844 0-66.585937-28.945312-66.585937-64.527344v-162.898437c27.847656-7.015625 48.519531-31.773438 48.519531-61.261719zm-97.03125 0c0-17.265625 14.585938-31.3125 32.511719-31.3125 17.929687 0 32.511719 14.046875 32.511719 31.3125 0 17.261719-14.582032 31.3125-32.511719 31.3125-17.925781 0-32.511719-14.050781-32.511719-31.3125zm0 0'
const HOOK_PATH = new Path2D(HOOK_SVG);
const SCALE = 0.3;
const OFFSET = 80;*/
const _w = 500;
const _h = 400;
const EditorContext = React.createContext();
function drawImage(ctx, url) {
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        // ctx.beginPath();
        // ctx.moveTo(30, 96);
        // ctx.lineTo(70, 66);
        // ctx.lineTo(103, 76);
        // ctx.lineTo(170, 15);
        // ctx.stroke();
    };
    img.src = url;
}
function draw(ctx, location) {
    // ctx.fillStyle = 'deepskyblue';
    // ctx.shadowColor = 'dodgerblue';
    // ctx.shadowBlur = 20;
    // ctx.save();
    // ctx.scale(SCALE, SCALE);
    // ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET);
    // ctx.fill(HOOK_PATH);
    // ctx.restore();
    ctx.beginPath();
    ctx.moveTo(75, 25);
    ctx.quadraticCurveTo(25, 25, 25, 62.5);
    // ctx.quadraticCurveTo(25, 100, 50, 100);
    // ctx.quadraticCurveTo(50, 120, 30, 125);
    // ctx.quadraticCurveTo(60, 120, 65, 100);
    // ctx.quadraticCurveTo(125, 100, 125, 62.5);
    // ctx.quadraticCurveTo(125, 25, 75, 25);
    ctx.stroke();
}
function ProcessImage(props) {
    const [process, setProcess] = useState(0);
    useEffect(() => {
        axios({
            url: props.url,
            onDownloadProgress(progress) {
                progress = Math.round((progress.loaded / progress.total) * 100);

                setProcess(progress);
            }
        }).then(response => {
            console.log('response has arrived');
        });
    }, []);
    return (
        <div>Process : {process} %</div>
    )
}
function Canvas(props) {
    let ctx_rel = React.useRef(null);
    const [ctx, setCtx] = useState(null);
    useEffect(() => {
        if (ctx_rel.current) {
            const ctx = ctx_rel.current.getContext('2d');
            drawImage(ctx, props.url);
            setCtx(ctx);
        }
    },[]);
    return(
        <>
            <button onClick={() => {return null}}>clear</button>
            <EditorStyleCanvas id="tutorial"
                               width={_w}
                               height={_h}
                               ref={ctx_rel}
                               onClick={e => {
                                   //draw(ctx, { x: e.clientX, y: e.clientY })
                               }}>
            </EditorStyleCanvas>

        </>
    )
}
function Layer(props) {
    let ctx_rel = React.useRef(null);
    const [ctx, setCtx] = useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [lastMouse, setLastMouse] = useState({
        x : 0,
        y : 0
    });
    const [boundary, setBoundary] = useState({});
    const editorContext = useContext(EditorContext);
    useEffect(() => {
        if (ctx_rel.current) {
            console.log(ctx_rel.current.getBoundingClientRect());
            const ctx = ctx_rel.current.getContext('2d');
            const boundingRect = ctx_rel.current.getBoundingClientRect();
            setCtx(ctx);
            setBoundary(boundingRect);
        }
    },[]);
    // function for mouse
    function mouse_up_event(e) {
        setIsMouseDown(false);
    }
    function mouse_move_event(e) {
        if(isMouseDown) {
            const mouseX = Math.abs(parseInt(e.clientX-boundary.x));
            const mouseY = Math.abs(parseInt(e.clientY-boundary.y));
            ctx.clearRect(0,0, _w, _h); //clear canvas
            ctx.beginPath();
            const width = mouseX - lastMouse.x;
            const height = mouseY - lastMouse.y;
            ctx.rect(lastMouse.x, lastMouse.y , width, height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(25, 94, 131, 0.8)';
            ctx.fillStyle = 'rgba(25, 94, 131, 0.5)';
            ctx.stroke();
            ctx.fill();
        }
    }
    function mouse_down_event(e) {
        ctx.clearRect(0,0, _w, _h); //clear canvas
        setLastMouse({
            x : parseInt(e.clientX - boundary.x),
            y : parseInt(e.clientY - boundary.y)
        });
        setIsMouseDown(true);
    }
    return (
        <EditorStyleCanvas
            id="layer"
            width={_w}
            height={_h}
            ref={ctx_rel}
            onMouseDown={mouse_down_event}
            onMouseMove={mouse_move_event}
            onMouseUp={mouse_up_event}>
        </EditorStyleCanvas>

    )
}
export function Editor(props) {
    const url = 'https://fetch-progress.anthum.com/30kbps/images/sunrise-baseline.jpg';
    const [location, setLocation] = useState({});
    return (
        <EditorStyle>
            <EditorContext.Provider value={{location, setLocation}}>
                <ProcessImage url={url} />
                <Canvas url={url} />
                <Layer/>
            </EditorContext.Provider>
        </EditorStyle>
    )
}