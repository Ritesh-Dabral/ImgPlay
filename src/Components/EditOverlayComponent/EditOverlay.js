// STYLE
import './EditOverlay.css'

// COMPONENTS AND LIB
import React,{useState,useEffect} from 'react'
import { CloseButton,Alert,Button } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import ZoomControl from './ZoomControl';
import RotateControl from './RotateControl';
import BlurSlider from './BlurSlider';
import ShowImgPreview from './ShowImgPreview';
import FLAGS from '../../Assets/Flags';
import {Download,ArrowRepeat} from 'react-bootstrap-icons';
import Jimp from 'jimp';
import {Buffer} from 'buffer'; 
import Loading from '../AdditionalComponents/Loading';
import Background from './Background';

export default function EditOverlay() {

    // img with background attached
    const [backgroundAddimg, setBackgroundAddImage] = useState("");
    // due to size limitation, stored here
    const [originalImgData, setOriginalImgData] = useState("");
    // loading spinner
    const [loading, setLoading] = useState(false);
    // zoom 
    const [zoom, setZoom] = useState(1);
    // rotate
    const [rotate, setRotate] = useState(true);
    // blur
    const [blur, setBlur] = useState(1);
    // alertMsg
    const [alertMsg, setAlertMsg] = useState({
        variant: "",
        msg: "",
        showAlert: false
    });
    // actual img preview
    const [imgSrc, setImgSrc] = useState("");
    // zoom and rotate prev state
    const [preZoomAndRotate, setPreZoomAndRotate] = useState({
        preZoom: 1,
        preRotate: true
    })

    useEffect(()=>{

        async function loadImg(){
            try {
                setLoading(true);
                // every time this page renders call this func
                // get data from local storage
                let src = JSON.parse(localStorage.getItem(FLAGS.MYIMG));
                setImgSrc(src);

                // due to size limitation, stored here
                if(originalImgData==="")
                    setOriginalImgData(src);
        
                // buffer read
                let base64 = src.indexOf(',');
                src = src.slice(base64+1,src.length-1);
        
                
                const buf = Buffer.from(src,'base64');
        
                let jimpImg = null;
    
            
                jimpImg = await Jimp.read(buf);
    
                // zoom if change found in zoom , not rotate
                if(preZoomAndRotate.zoom !== zoom){
                    jimpImg.scale(zoom);
                    preZoomAndRotate.zoom = zoom;
                }
                // rotate if change found in rotate , not zoom
                if(preZoomAndRotate.rotate !== rotate){
                    jimpImg.rotate(90);
                    preZoomAndRotate.rotate = rotate;
                }
               
                // common
                jimpImg
                .getBase64('image/png', (err, data)=>{
                    if(err) throw err;
                    setImgSrc(data);
                    localStorage.setItem(FLAGS.MYIMG,JSON.stringify(data));
                    setLoading(false);
                })
                
                //setImgSrc(data);
            } catch (e) {
                setAlertMsg({
                    variant: FLAGS.ERROR,
                    msg: e,
                    showAlert: true
                })
                setLoading(false);
            }
        }

        loadImg();

        
    },[zoom,rotate]);


    /**
     * Add the new src to storage
     * @param {*} data 
     */
    const addToLocalStorage = (data)=>{
        setLoading(true);
        try {
            localStorage.setItem(FLAGS.MYIMG,JSON.stringify(data));
        } catch (e) {
            setAlertMsg({variant:FLAGS.ERROR, msg:e, showAlert: true});
        }
        setLoading(false);
    }

    /**
     * Handle download
     */
    const handleDownload = async()=>{
        try {
            setAlertMsg({variant:"",msg:"",showAlert: false});
            setLoading(true);
            // every time this page renders call this func
            // get data from local storage
            let src = null;
    
            if(backgroundAddimg!==""){
                src = backgroundAddimg;
            }else{
                src=JSON.parse(localStorage.getItem(FLAGS.MYIMG));
            }
            setImgSrc(src);
    
            let base64 = src.indexOf(',');
            src = src.slice(base64+1,src.length-1);
    
            
            const buf = Buffer.from(src,'base64');
    
            Jimp.read(buf)
                .then(async img=>{
    
                    // set blur before downloading only if more than 1, multiplied by factor 5
                    if(blur>1)
                        img.blur(blur*2);
    
                    const data = await img.getBufferAsync('image/png');
                    var blob = new Blob([data], {type: 'image/png'});
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    let newName = 'asldaslasdasd';
    
                    link.setAttribute('download', `${newName}`);
                    document.body.appendChild(link);
                    link.click();
    
                    setLoading(false);
    
                })
                .catch(err=>{
                    setAlertMsg({
                        variant: FLAGS.ERROR,
                        msg: err,
                        showAlert: true
                    });
    
                    setLoading(false);
                })
        } catch (e) {
            setAlertMsg({
                variant: FLAGS.ERROR,
                msg: e,
                showAlert: true
            });
        }

        setLoading(false);
    }


    /**
     * reset details
     */
    const handleReset = ()=>{
        setLoading(true);
        try {
            if(originalImgData==="" )
                throw new Error('Please upload a new image and try again');

            setImgSrc(originalImgData);
            addToLocalStorage(originalImgData);
            setBackgroundAddImage("");
            setZoom(1);
            setRotate(true);
            setBlur(1);
            
        } catch (e) {
            setAlertMsg({variant:FLAGS.ERROR, msg:e, showAlert: true});
        }

        setLoading(false);
    }

    return (
        <main id='editOverlayContainer'>
           <div id="editOverlayInnerContainer">


                <section id="editOverlayLeftSide">

                    <div id="editOverlayLeftSideNavbar">
                        <Link to="/dashboard">
                            <CloseButton id="editOverlayCloseBtn"/>
                        </Link>

                        <ZoomControl zoomInput={zoom} setZoomInput={setZoom} />

                        <RotateControl rotate={rotate} setRotate={setRotate}/>
                    </div>

                    <div id="editOverlayLeftSideImg">
                        {
                            alertMsg.showAlert ? (
                                <Alert variant={alertMsg.variant}>
                                    {alertMsg.msg}
                                </Alert>
                            ) :  (loading ? (<Loading show={loading} />) : (
                                <ShowImgPreview imgSrc={imgSrc}/>
                            ))
                        }
                    </div>

                    <div id="editOverlayLeftSideDwnBtn">
                        <Button variant="dark" onClick={handleDownload}><Download /></Button>
                        <Button variant="dark" onClick={handleReset}><ArrowRepeat /></Button>
                    </div>
                    

                </section>



                <section id="editOverlayRightSide">
                    <div id="editOverlayRightSideAdjustBlur">
                        <BlurSlider blur={blur} setParentBlur={setBlur} setAlertMsg={setAlertMsg} backgroundAddimg={backgroundAddimg}/>
                    </div>
                    <hr/>
                    <div id="editOverlayRightSideAddBackground">
                        <Background 
                            setImgSrc={setImgSrc} 
                            setParentLoading={setLoading} 
                            setBackgroundAddImage={setBackgroundAddImage} 
                            setAlertMsg={setAlertMsg}
                        />
                    </div>
                </section>
           </div>
        </main>
    )
}
