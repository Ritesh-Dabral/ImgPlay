import './EditOverlay.css'

import React from 'react';
import { Button } from 'react-bootstrap';

export default function ZoomControl({zoomInput,setZoomInput}) {

    /**
     * Decrease zoomvalue
     */
    const decZoomValue = ()=>{
        let value = parseFloat(zoomInput);
        if(value>0.6 && value<=1){
            setZoomInput(parseFloat(zoomInput).toFixed(2)-0.1);
        }
    }

    /**
     * Increase zoom value
     */
    const incZoomValue = ()=>{
        let value = parseFloat(zoomInput);
        if(value>=0.5 && value<0.9 ){
            setZoomInput(parseFloat(zoomInput).toFixed(2)+0.1);
        }
    }

    return (
        <div id="editOverlayZoomControl">
            <Button variant="dark" onClick={decZoomValue}>-</Button>
            <input type="text" readOnly id="zoomInput" value={`${zoomInput*10}%`}></input>
            <Button variant="dark" onClick={incZoomValue}>+</Button>
        </div>
    )
}
