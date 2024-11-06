import React, { useRef, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './css/CreatePostModal.css';
import createpost from './Images/createpost.svg';
import createannouncement from './Images/createannouncement.svg';
import EmojiPicker from 'emoji-picker-react';
import { FaUpload, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreatePostModal = ({ show, setShow,postType  }) => {
    // const handleClose = () => setShow(false);

    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userimage = userData?.userimage || '';
    const username = userData?.username || '';
    const userrole = userData?.userrole || '';
    const userempid = userData?.userempid || '';
    const usertoken = userData?.token || '';
    const userdepartmentname = userData?.userdepartmentname || '';

    const [description, setDescription] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null); // Create a ref for the file input

    // Handle description change with emojis
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    // Handle emoji selection
    const onEmojiClick = (emojiObject) => {
        setDescription(description + emojiObject.emoji);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Create a URL for the image
        }
    };

    const removeImage = () => {
        setSelectedImage(null); // Clear the image preview
        fileInputRef.current.value = ''; // Reset file input value
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const formData = new FormData();
        // formData.append('title', 'Testing One1');
        formData.append('description', description);
        formData.append('image', fileInputRef.current.files[0]); 
        formData.append('post_type', postType);
        formData.append('created_by', userrole);
        formData.append('user_emp_id', userempid);

        try {
            const response = await axios.post('https://office3i.com/development/api/public/api/createPost', formData, {
                headers: {
                    Authorization: `Bearer ${usertoken}`,
                },
            });

            // Check the response status and show appropriate message
            if (response.data.status === "success") {
                Swal.fire("Success",
                    response.data.message,
                    "success");
                handleClose(); 
            } else {
                Swal.fire("Error", response.data.message.join(', '), "error");
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            const errorMessage = error.response?.data.message || "Failed to create post.";
            Swal.fire("Error", errorMessage, "error");
        }
    };

    const handleClose=()=>{
        setShow(false)
        setDescription('')
        setSelectedImage(null); 
        fileInputRef.current.value = '';
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <img
                    src={`https://office3i.com/development/api/storage/app/${userimage}`}
                    alt="Profile"
                    style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10, border: '1px solid #0A62F1' }}
                />
                <span>
                    <p className='createpost__List__name'>{username}</p>
                    <p className='createpost__List__department'>{userdepartmentname}</p>
                </span>
            </Modal.Header>

            <Modal.Body>
                <Button className={`Create_Post mb-3 ${postType === 'announcement' ? 'announcement' : ''}`}>
                    <img src={postType === 'post' ? createpost : createannouncement} alt='createpost' /> 
                    {postType === 'post' ? 'Create Post' : 'Create Announcement'}
                </Button>

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="postDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Write something..."
                            value={description}
                            onChange={handleDescriptionChange}
                            className='mb-3'
                        />
                        <div className='image__emoji'>
                            <div className="image-upload-container">
                                {selectedImage ? (
                                    <div>
                                        <img src={selectedImage} alt="Selected" className="image-preview" />
                                        <FaTimesCircle
                                            onClick={removeImage}
                                            size={24}
                                            className="cancel-icon"
                                        />
                                    </div>
                                ) : (
                                    <label htmlFor="file-input" className="upload-label">
                                        <FaUpload size={20} />
                                    </label>
                                )}
                                <input
                                    id="file-input"
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    style={{ display: 'none' }} // Hide the file input
                                    onChange={handleImageUpload}
                                />
                            </div>

                            <Button
                                variant="light"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="mt-2"
                            >
                                😀
                            </Button>

                            {/* Emoji Picker as an overlay */}
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                {showEmojiPicker && (
                                    <div style={{ position: 'absolute', zIndex: 1000 }}>
                                        <EmojiPicker onEmojiClick={onEmojiClick} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreatePostModal;
