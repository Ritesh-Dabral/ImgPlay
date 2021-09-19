import React,{useState} from 'react'
import {Container, Row, Col, Image, Badge} from 'react-bootstrap';
import './EditOverlay.css';
import BG_IMAGES from '../../Assets/ImageBackgroundData';
import FLAGS from '../../Assets/Flags';
import Jimp from 'jimp';

export default function Background({setImgSrc,setParentLoading,setBackgroundAddImage,setAlertMsg}) {

    // custom bg img
    const [uploadImg, setUploadImage] = useState({
        isValidForUpload: false,
        key : "",
        imgData: ""
    });

    /**
     * Handle preview
     * @param {*} e 
     */
    const handlePreview = (e)=>{
        try {
            let key = e.target.alt;

            setParentLoading(true);
            // every time this page renders call this func
            // get data from local storage
            let src = JSON.parse(localStorage.getItem(FLAGS.MYIMG));
    
            let base64 = src.indexOf(',');
            src = src.slice(base64+1,src.length-1);
            const oriBuf = Buffer.from(src,'base64');
    
    
            let tempSrc = null;
            BG_IMAGES.forEach((Element)=>{
                if(Element.key===key){
                    tempSrc = Element.data;
                }
            });
    
            // condition for custom bg
            if(tempSrc===null && key===FLAGS.CUSTOM_BG){
                tempSrc = uploadImg.imgData;
            }

            let tempBase64 = tempSrc.indexOf(',');
            tempSrc = tempSrc.slice(tempBase64+1,tempSrc.length-1);
            const tempBuf = Buffer.from(tempSrc,'base64');
    
            Jimp.read(oriBuf)
                .then(async img=>{
                    
                    let srcJimpImg = await Jimp.read(tempBuf);
    
                    const srcJimpImgWidth = srcJimpImg.bitmap.width;
                    const srcJimpImgHeight = srcJimpImg.bitmap.height;
    
                    // resize original image as per the above width and height and cover almost 80%
    
                    const originalImgNewWidth = Math.abs( (srcJimpImgWidth*80)/100 );
                    const originalImgNewHeight = Math.abs( (srcJimpImgHeight*80)/100 );
    
                    // new size based on bkground
                    img.resize(originalImgNewWidth,originalImgNewHeight);
    
                    // now set position 10% from up and sown and same for left and right
                    const newPositionOnCompsiteX = Math.abs( (srcJimpImgWidth-originalImgNewWidth)/2 );
                    const newPositionOnCompsiteY = Math.abs( (srcJimpImgHeight-originalImgNewHeight)/2 );
    
    
                    srcJimpImg.composite(img, newPositionOnCompsiteX ,newPositionOnCompsiteY)
                    .getBase64('image/png', (err, data)=>{
                        if(err) {
                            
                            throw err;
    
                        }
                        setImgSrc(data);
                        setBackgroundAddImage(data);
                        setParentLoading(false);
                    })
    
    
    
                })
                .catch(err=>{
                    setAlertMsg({variant:FLAGS.ERROR, msg:e, showAlert:true});
                    setParentLoading(false);
                })
        } catch (e) {
            setAlertMsg({variant:FLAGS.ERROR, msg:e, showAlert:true});
            setParentLoading(false);
        }
    }

    /**
     * handle img choice
     * @param {*} e 
     * @returns 
     */
     const handleImageChoice = (e) => {
        try {
            const file = e.target.files[0];
        
            // mark invalid for upload
            setUploadImage({...uploadImg,isValidForUpload: false});
    
            if( !file || file.type!=='image/png'){
                setAlertMsg({variant:FLAGS.WARNING, msg:"Must select a PNG image for custom bg", showAlert:true});
                return;
            }
    
            // reset alert
            setAlertMsg({variant: "", msg:"", showAlert:false});
    
            // reader to read file
            let reader = new FileReader();
            reader.readAsDataURL(file);
    
            reader.addEventListener('load', ()=>{
    
                setUploadImage({
                    ...uploadImg,
                    isValidForUpload: true,
                    key: FLAGS.CUSTOM_BG,
                    imgData: reader.result
                });

                BG_IMAGES.push(uploadImg);
            });
    
            reader.addEventListener('error', ()=>{
                setAlertMsg({variant:FLAGS.ERROR, msg:"An error occured reading file", showAlert:true});
            });
        } catch (e) {
            setAlertMsg({variant:FLAGS.ERROR, msg:e, showAlert:true});
        }

    }

    return (
        <Container fluid id="backgroundContainer">
            <h3 style={{width:"100%", textAlign:"center"}}>
                <Badge bg="secondary">Background</Badge>
            </h3>
            <form encType='multipart/form-data'>
                <input type="file" name="myFiles" id="chooseFileBtn" onChange={handleImageChoice} accept="image/*"/>
            </form>
            <hr/>
            <Row>
                {
                    BG_IMAGES.length ? (
                        BG_IMAGES.map(staticBgImg=>
                            <Col xs={6} key={staticBgImg.key}>
                                <Image src={staticBgImg.data} fluid className="backgroundContainerImg" onClick={handlePreview} alt={staticBgImg.key}/>
                            </Col>
                        )
                    ): (
                        <></>
                    )
                }
            </Row>

            {/* custome bg */}

            <Row>
                {
                    (uploadImg.imgData!=="" && uploadImg.key===FLAGS.CUSTOM_BG) ? (
                        <Col xs={6} key={uploadImg.key}>
                            <Image src={uploadImg.imgData} fluid className="backgroundContainerImg" onClick={handlePreview} alt={uploadImg.key}/>
                        </Col>
                    ) : (<span>Add custom png background</span>)
                }

            </Row>


           
        </Container>
    )
}
