import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import './css/BasicDetailsStyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

const Documents = ({ formData, handleChangedoc, fileSets, setFileSets, handleSubmit, formErrors, prevStep, filePreviews, loading, setFilePreviews }) => {

    // ----------------------------------------------------------------------------------------------
    // ADD FILESETS

    const addFileSet = () => {
        setFileSets([...fileSets, { documentType: '', documentName: '', selectedFile: null }]);
    };

    // ----------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------
    // REMOVE SELECTED IMAGE CATCHE

    useEffect(() => {
        const newFilePreviews = fileSets.map(fileSet => {
            if (fileSet.selectedFile) {
                return URL.createObjectURL(fileSet.selectedFile);
            }
            return null;
        });
        setFilePreviews(newFilePreviews);
    }, [fileSets]);

    // ----------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------
    // REMOVE THE CLONE FILE SETS

    const removeFileSet = (index) => {
        const newFileSets = [...fileSets];
        newFileSets.splice(index, 1);
        setFileSets(newFileSets);
    };

    // ----------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------
    // FILTER THE DOCUMENT TYPE

    const getFilteredDocumentTypes = (currentIndex) => {
        const selectedDocumentTypes = fileSets
            .map((fileSet, index) => index !== currentIndex ? fileSet.selecteddocumentType : null)
            .filter(Boolean);

        return formData.documentType.filter(
            docType => !selectedDocumentTypes.includes(docType.id.toString())
        );
    };

    // ----------------------------------------------------------------------------------------------




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
                                {filePreviews[index] && <img src={filePreviews[index]} alt={`Preview ${fileSet.documentName}`} style={{ width: '100px', height: 'auto' }} />}
                            </Col>
                            <Col style={{ display: 'flex', alignItems: 'center', paddingTop: '30px' }}>
                                {index === fileSets.length - 1 && (
                                    <Button variant="primary" onClick={addFileSet}>
                                        ADD
                                    </Button>
                                )}
                                {index !== 0 && (
                                    <Button variant="danger" onClick={() => removeFileSet(index)}>
                                        Remove
                                    </Button>
                                )}
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

