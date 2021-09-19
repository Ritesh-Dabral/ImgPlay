import React from 'react'
import {Button} from 'react-bootstrap';
import { ArrowClockwise } from 'react-bootstrap-icons';

export default function RotateControl({rotate, setRotate}) {

    const handleClockwiseRotate = ()=>{
        setRotate(!rotate);
    }


    return (
        <div id="editOverlayRotateControl">
            <Button variant="dark" onClick={handleClockwiseRotate}><ArrowClockwise /></Button>
        </div>
    )
}
