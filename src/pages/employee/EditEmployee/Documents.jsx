import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import './css/BasicDetailsStyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Documents = ({ formData, handleChangedoc, fileSets, setFileSets, handleSubmit, formErrors, prevStep, filePreviews, setFilePreviews, loading, handleUpdateDocument }) => {

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // ADD FILESETS

    const addFileSet = () => {
        setFileSets([...fileSets, { documentType: '', documentName: '', selectedFile: null }]);
    };
    // ------------------------------------------------------------------------------------------------




    // const removeFileSet = (index) => {
    //     const newFileSets = [...fileSets];
    //     newFileSets.splice(index, 1);
    //     setFileSets(newFileSets);
    // };



    // ------------------------------------------------------------------------------------------------
    // REMOVE THE FILESETS

    const handleDeleteDocument = async (index) => {
        const documentId = fileSets[index].documentId;

        if (documentId === undefined) {
            // If no documentId (newly added file set), simply remove from fileSets
            const newFileSets = [...fileSets];
            newFileSets.splice(index, 1);
            setFileSets(newFileSets);

            // Clean up the associated previewURL if it exists
            const newFilePreviews = [...filePreviews];
            if (newFilePreviews[index]) {
                URL.revokeObjectURL(newFilePreviews[index]);
                newFilePreviews.splice(index, 1);
                setFilePreviews(newFilePreviews);
            }

            return;
        }

        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this document. This action cannot be reversed.',
                icon: 'warning',
                input: 'text',
                inputPlaceholder: 'Enter reason for deletion',
                inputAttributes: {
                    maxLength: 100, // Limit input to 100 characters
                },
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (value) => {
                    if (!value) {
                        Swal.showValidationMessage('Reason is required for deletion.');
                    }
                    return value;
                }
            });

            if (reason) {
                const response = await fetch('https://office3i.com/user/api/public/api/employee_single_docmentdelete', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${usertoken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: documentId,
                        updated_by: userempid,
                        reason: reason
                    })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: data.message
                    });

                    // Remove the deleted document from fileSets state
                    const newFileSets = [...fileSets];
                    newFileSets.splice(index, 1);
                    setFileSets(newFileSets);

                    // Clean up the associated previewURL if it exists
                    const newFilePreviews = [...filePreviews];
                    if (newFilePreviews[index]) {
                        URL.revokeObjectURL(newFilePreviews[index]);
                        newFilePreviews.splice(index, 1);
                        setFilePreviews(newFilePreviews);
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message || 'Failed to delete document'
                    });
                }
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to delete document'
            });
        }
    };

    // ------------------------------------------------------------------------------------------------
    // FILTER THE DOCUMENT TYPE

    // const getFilteredDocumentTypes = (currentIndex) => {
    //     const selectedDocumentTypes = fileSets
    //         .map((fileSet, index) => index !== currentIndex ? fileSet.selecteddocumentType : null)
    //         .filter(Boolean);

    //     return formData.documentType.filter(
    //         docType => !selectedDocumentTypes.includes(docType.id.toString())
    //     );
    // };

    const getFilteredDocumentTypes = (currentIndex) => {
        const selectedDocumentTypes = fileSets
            .filter((_, index) => index !== currentIndex)
            .map(fileSet => fileSet.selecteddocumentType);

        return formData.documentType.filter(
            docType => !selectedDocumentTypes.includes(docType.id.toString())
        );
    };

    // ------------------------------------------------------------------------------------------------



    return (
        <div>


            <Container className="documents__container mt-5">
                <h3>Documents</h3>
                <Form className='mt-5'>



                    {fileSets.map((fileSet, index) => (
                        <Row key={index} className="mb-3">

                            <Col>
                                <Form.Group controlId={`formGridDocumentType_${index}`}>
                                    <Form.Label>Document Type</Form.Label>
                                    <Form.Select
                                        name="selecteddocumentType"
                                        placeholder="Enter Document Type"
                                        value={fileSet.selecteddocumentType}
                                        onChange={(e) => handleChangedoc(index, e)}
                                    >
                                        <option value="">Select Document Type</option>
                                        {getFilteredDocumentTypes(index).map(docType => (
                                            <option key={docType.id} value={docType.id}>{docType.document_name}</option>
                                        ))}
                                    </Form.Select>
                                    {formErrors[`selecteddocumentType_${index}`] && (
                                        <span className="text-danger">{formErrors[`selecteddocumentType_${index}`]}</span>
                                    )}
                                </Form.Group>
                            </Col>


                            <Col>
                                <Form.Group controlId={`formGridDocumentName_${index}`}>
                                    <Form.Label>Document Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="documentName"
                                        placeholder="Enter Document Name"
                                        value={fileSet.documentName}
                                        onChange={(e) => handleChangedoc(index, e)}
                                    />
                                    {/* {formErrors.documentName && <span className="text-danger">{formErrors.documentName}</span>} */}

                                    {formErrors[`documentName_${index}`] && (
                                        <span className="text-danger">{formErrors[`documentName_${index}`]}</span>
                                    )}
                                </Form.Group>
                            </Col>


                            <Col>
                                <Form.Group controlId={`formGridSelectFile_${index}`}>
                                    <Form.Label>Select File</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="selectedFile"
                                        onChange={(e) => handleChangedoc(index, e)}
                                    />
                                    {formErrors[`selectedFile_${index}`] && (
                                        <span className="text-danger">{formErrors[`selectedFile_${index}`]}</span>
                                    )}
                                </Form.Group>
                                {console.log("filePreviews[index]---------->", filePreviews[index])}
                                {filePreviews[index] && <img src={filePreviews[index]} alt={`Preview ${fileSet.documentName}`} style={{ width: '100px', height: 'auto' }} />}
                            </Col>


                            <Col>
                                <Form.Label>Action</Form.Label>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {index === fileSets.length - 1 && (
                                        <Button variant="primary" onClick={addFileSet}>
                                            ADD
                                        </Button>
                                    )}
                                    {index !== 0 && (
                                        <Button variant="danger" onClick={() => handleDeleteDocument(index)}>
                                            Remove
                                        </Button>
                                    )}
                                    {fileSet.documentId !== undefined &&
                                        <Button variant="dark" onClick={() => handleUpdateDocument(index)}>
                                            Update
                                        </Button>
                                    }
                                </span>
                            </Col>

                        </Row>
                    ))}



                    <Row className="mb-3" style={{ display: 'flex', gap: '10px' }}>
                        <Col xs={6} md={2} lg={2} xl={2}>
                            <button className="btn btn-secondary previous" onClick={prevStep}><FontAwesomeIcon icon={faAngleLeft} /> Previous</button>
                        </Col>
                        <Col xs={6} md={2} lg={2} xl={2}>
                            {/* <button className="btn btn-success" onClick={handleSubmit}>Submit</button> */}

                            <button
                                type="button"
                                className="btn btn-success btn-loading"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Submit
                                    </span>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </Col>
                    </Row>
                </Form>
            </Container>
            {/* <button onClick={nextStep} className="btn btn-primary mt-3">Next</button> */}
        </div>
    );
};

export default Documents;

