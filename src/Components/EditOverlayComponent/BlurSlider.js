import React,{useState} from 'react'
import './EditOverlay.css'
import Loading from '../AdditionalComponents/Loading';
import Jimp from 'jimp';
import FLAGS from '../../Assets/Flags';
import {Container,Badge,Image,Row, Col} from 'react-bootstrap';

export default function BlurSlider({setParentBlur,backgroundAddimg,setAlertMsg}) {

    const [blur, setBlur] = useState(1);
    // loading spinner
    const [loading, setLoading] = useState(false);

    // image preview
    const [blurImgPreview, setBlurImgPreview] = useState("");

    /**
     * Handle blur
     * @param {*} e 
     */
    const handleBlur = async(e)=>{
        let val = parseInt(e.target.value);

        if(val && val>=1 && val<=10)
            setBlur(val);

            setLoading(true);
            // every time this page renders call this func
            // get data from local storage
            let src = null;
            if(backgroundAddimg!==""){
                setBlurImgPreview(backgroundAddimg);
                src = backgroundAddimg;
            }
            else{
                src = JSON.parse(localStorage.getItem(FLAGS.MYIMG));
                setBlurImgPreview(src);
            }
            // buffer read
            let base64 = src.indexOf(',');
            src = src.slice(base64+1,src.length-1);
    
            
            const buf = Buffer.from(src,'base64');
    
            let jimpImg = null;

            try {
                jimpImg = await Jimp.read(buf);

                let imgClone = jimpImg.clone();

                // blus is multiplied by 5
                imgClone
                .blur(blur*2)
                .getBase64('image/png', (err, data)=>{
                    if(err) throw err;
                    setBlurImgPreview(data);
                    setLoading(false);
                    setParentBlur(blur);
                })
                
                //setImgSrc(data);
            } catch (e) {
                setAlertMsg({variant:FLAGS.ERROR, msg:e, showAlert:true});
                setLoading(false);
            } 
    }

    return (
        <Container fluid id="blurContainer">
            <h3 style={{width:"100%", textAlign:"center"}}>
                <Badge bg="secondary">BLUR</Badge>
            </h3>
            <Row>
                <input type="range" min="1" max="10" className="slider" id="myRange" onChange={handleBlur} value={blur}></input>
            </Row>
            <Row>
                <Col xs={8} md={8}>
                    {
                        
                        loading ? (<Loading show={loading} />) : (
                            blurImgPreview ? (
                                <Image src={blurImgPreview} fluid />
                            ) : (<></>) 
                        )

                    }
                </Col>
            </Row>
        </Container>
    )
}
