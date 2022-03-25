import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar"
import { db } from './config/firebase';
import { Button } from '@material-ui/core';
import firebase from 'firebase'

function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [likes, setLikes] = useState([]);
    const [whoLikes, setWhoLikes] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault();

        db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection("likes")
                .onSnapshot((snapshot) =>{
                    setLikes(snapshot.docs.map((doc) => doc.data()));
                    
                })
        }
        return () => {
            unsubscribe();
        }
    }, [postId])

    const postLike = (event) => {
        event.preventDefault();

        db
            .collection('posts')
            .doc(postId)
            .collection('likes')
            .doc(user.uid)
            .set({
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
    }

    return (
        <div className="post">
            
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt={username}
                    src=""/>
                
                <h3>{username}</h3>
            </div>
            
            <img    className="post__image"
                    src={imageUrl}
                    alt="img" />
            
            <div className="post__like">
                <div className="post__actions">
                    <button 
                        className="post__likebutton" 
                        onClick={postLike}>
                            <ion-icon 
                                size="large" name="heart-outline">
                            </ion-icon>
                    </button>
                    <button 
                        className="post__likebutton">
                            <ion-icon 
                                size="large" name="chatbubble-outline">
                            </ion-icon>
                    </button>
                </div>
                <div className="post__likescount">
                    <p>{likes.length > 0 && (`${likes.length} Likes`)}</p>
                    
                </div>
            </div>

            <p className="post__text"><strong>{username}</strong> {caption}</p>
            
            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            
            {user && (
                <form className="post__commentbox">
                    <input className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >Post</Button>

                </form>
            )}
            
        </div>
    )
}

export default Post
