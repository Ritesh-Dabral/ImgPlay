// STYLE
import './Dashboard.css'

// COMPONENTS AND LIB
import React,{useState} from 'react'
import { Button,Badge,Alert } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Loading from '../AdditionalComponents/Loading';
import FLAGS from '../../Assets/Flags';


export default function Dashboard() {

    // loading spinner
    const [loading, setLoading] = useState(false);

    // alert msg
    const [alertMsg, setAlertMsg] = useState({
        variant: "",
        msg: "",
        showAlert: false
    });

    // uploadedImg
    const [uploadImg, setUploadImage] = useState({
        isValidForUpload: false,
        isValidForSubmit : false,
        imgData: ""
    });
    

    /**
     * handle choose btn
     * @param {*} e  
     * @returns 
     */
    const handleImageChoice = (e) => {
        try {
            const file = e.target.files[0];
        
            // mark invalid for upload
            setUploadImage({...uploadImg,isValidForUpload: false});
    
            if( !file ){
                setAlertMsg({variant:FLAGS.WARNING, msg:"Must select an image", showAlert:true});
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
                    imgData: reader.result
                });
            });
    
            reader.addEventListener('error', ()=>{
                setAlertMsg({variant:FLAGS.ERROR, msg:"An error occured reading file", showAlert:true});
            });
        } catch (e) {
            setAlertMsg({variant:FLAGS.ERROR, msg:e, showAlert:true});
        }

    }

    /**
     * Handle upload to loacl storgae
     * @returns 
     */
    const handleUpload = ()=>{
        try {
            setLoading(true);

            if( !uploadImg.imgData || !uploadImg.isValidForUpload ){
                setAlertMsg({variant:FLAGS.ERROR, msg:"Nothing to upload", showAlert:true});
                setLoading(false);
                return;
            }
            // save file locally in localstorage
    
            // reset alert
            setAlertMsg({variant: "", msg:"", showAlert:false});
    
            // store in local storage
            let storedLocally = new Promise((resolve, reject)=>{
                try {
                    localStorage.setItem(FLAGS.MYIMG,JSON.stringify(uploadImg.imgData));
                    resolve('Stored image locally. Click START EDITING');
                } catch (e) {
                    reject('Error storing image locally');
                }
            });
    
            storedLocally
                .then(res=>{
                    setAlertMsg({variant: FLAGS.SUCCESS, msg:res, showAlert:true});
                    setUploadImage({
                        ...uploadImg,
                        isValidForUpload: false,
                        isValidForSubmit: true
                    });
    
                    document.getElementById('chooseFileBtn').value="";
                })
                .catch(err=>{
                    setAlertMsg({variant: FLAGS.ERROR, msg:err, showAlert:true});
                });
    
            // set loading to false
            setLoading(false);
        } catch (e) {
            setAlertMsg({variant: FLAGS.ERROR, msg:e, showAlert:true});
            setLoading(false);
        }
    }

    return (
        <main>
            <section id="customDashboardContainer">

                <aside id="leftDashboardSide">
                    <Badge bg="dark" id="heading">
                        IMG PLAY
                    </Badge>
                </aside>

                <aside id="rightDashboardSide">

                    <div id="rightDashboardSideUploadForm">

                        {
                            alertMsg.showAlert ? (
                                <Alert variant={alertMsg.variant}>
                                    {alertMsg.msg}
                                </Alert>
                            ) : (<></>)
                        }

                        <form encType='multipart/form-data'>
                            <input type="file" name="myFiles" id="chooseFileBtn" onChange={handleImageChoice} accept="image/*"/>
                        </form>
                    </div>

                    <div id="rightDashboardSideBtns">
                        <Button variant="dark" onClick={handleUpload}>
                            {
                                loading ? (
                                    <Loading show={loading} />
                                ) : (
                                    <span>UPLOAD</span>
                                )
                            }
                        </Button>

                        <Button disabled={ !uploadImg.isValidForSubmit || loading } variant="dark"><Link to="/edit" style={{textDecoration:"none"}}>START EDITING </Link></Button>

                    </div>

                   
                </aside>
            </section>
        </main>
    )
}
