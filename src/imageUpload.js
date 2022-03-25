import React, { useState} from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from './config/firebase';
import firebase from 'firebase';
import './imageUpload.css'

function  ImageUpload({username}) {
    const [image, setImage] = useState("");
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //Error function...
                console.log(error);
                alert(error.message);
            },
            () => {
                //Complete function...
                storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post image url into database
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username

                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }
        )
    }

    return (
        <div className="imageUpload">
            
            <textarea type="text" rows="5" placeholder="Enter a caption..."
                value={caption} onChange={event => setCaption(event.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
            <progress className="imageupload_progress" value={progress} max="100" />
        </div>
    )
}

export default ImageUpload
