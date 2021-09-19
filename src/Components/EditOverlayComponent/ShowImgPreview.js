import React from 'react'
import {Image} from 'react-bootstrap';

export default function ShowImgPreview({imgSrc}) {


    return (
        <>
            {
                imgSrc ? (
                    <Image src={imgSrc} fluid />
                ) : (<span style={{color:"red"}}>Nothing found, try uploading again</span>)
            }
        </>
    )
}
