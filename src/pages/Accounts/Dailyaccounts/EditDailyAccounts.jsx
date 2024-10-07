import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';

function EditDailyAccounts() {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add employe  level category page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitdailyaccounts = () => {
        navigate(`/admin/adddailyaccounts`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    // Edit Daily Accounts Save

    const [date, setDate] = useState('');
    const [department, setDepartment] = useState('');
    const [userName, setUserName] = useState('');
    const [debit, setDebit] = useState('');
    const [credit, setCredit] = useState('');
    const [balanceCash, setBalanceCash] = useState('');
    const [expenses, setExpenses] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [formErrors, setFormErrors] = useState({});
    const [overallbalanceCash, setOverallBalanceCash] = useState('');

    const handleSave = (e) => {
        e.preventDefault();

        //Form validation
        const errors = {};
        if (!date) {
            errors.date = 'Date is required.';
        }

        if (!department) {
            errors.department = 'Department is required.';
        }

        if (!userName) {
            errors.userName = 'Name is required.';
        }

        if (!debit && !credit) {
            errors.debit = 'Either Debit or Credit is required.';
            errors.credit = 'Either Debit or Credit is required.';
        }

        if (debit > overallbalanceCash) {
            errors.debit = 'Insufficient balance.';
            if (balanceCash !== 0) {
                errors.debit = 'Insufficient balance.';
            }
        }

        if (!expenses) {
            errors.expenses = 'Nature of Expenses is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const requestData = {
            id: id,
            a_date: date,
            department: department,
            name: userName,
            natureof_expenses: expenses,
            debit: debit || '0',
            credit: credit || '0',
            balance_cash: balanceCash,
            updated_by: userempid
        };


        axios.post(`https://office3i.com/development/api/public/api/updatedailyaccounts`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Daily Accounts has been updated successfully!',
                    });
                    handleVisitdailyaccounts()

                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating the Daily Accounts. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };

    const handleCancel = () => {
        handleVisitdailyaccounts()
    };

    const handleKeyPress = (event) => {
        const invalidChars = ['e', 'E', '.', '-'];
        if (invalidChars.includes(event.key)) {
            event.preventDefault();
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    // ------------------------------------------------------------------------------------------------
    // edit daily accounts 

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/editview_dailyaccounts/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);
                    setDate(res.data.data.a_date);
                    setDepartment(res.data.data.department);
                    setUserName(res.data.data.name);
                    setDebit(res.data.data.debit);
                    setCredit(res.data.data.credit);
                    // setBalanceCash(res.data.data.balance_cash);
                    setExpenses(res.data.data.natureof_expenses);

                    // calculation
                    const data = Number(res.data.data.balance_cash);
                    const credits = Number(credit); // Ensure credit is a number too
                    const debits = Number(debit);

                    setBalanceCash(data)
                    setOverallBalanceCash(data)
                    console.log("data-->", data)

                    let newBalanceCash;

                    if (credits) {
                        newBalanceCash = data + credits;
                        setBalanceCash(newBalanceCash);
                        console.log("credits-->", newBalanceCash)
                    } else if (debits) {
                        newBalanceCash = data - debits;
                        setBalanceCash(newBalanceCash);
                        console.log("debits-->", newBalanceCash)
                    }
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    // ------------------------------------------------------------------------------------------------



    return (

        <>
            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6'
                }}>
                    <ScaleLoader color="rgb(20 166 249)" />
                </div>
            ) : (
                <Container fluid className='shift__container'>

                    {/* Goods & Services edit form */}
                    <h5 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Daily Accounts</h5>
                    <Form>
                        <Row className='mb-5 shift__row'>
                            <Row >
                                <Col>
                                    <Form.Group controlId="date">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={date}
                                            min={getCurrentDate()}
                                            max="9999-12-31"

                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                        {formErrors.date && <span className="text-danger">{formErrors.date}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="department">
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                        />
                                        {formErrors.department && <span className="text-danger">{formErrors.department}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="userName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                        {formErrors.userName && <span className="text-danger">{formErrors.userName}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row >
                                <Col>
                                    <Form.Group controlId="debit">
                                        <Form.Label>Debit</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={debit}
                                            onChange={(e) => setDebit(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        // disabled={!credit || credit}
                                        />
                                        {formErrors.debit && <span className="text-danger">{formErrors.debit}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="credit">
                                        <Form.Label>Credit</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={credit}
                                            onChange={(e) => setCredit(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        // disabled={!debit || debit}
                                        />
                                        {formErrors.credit && <span className="text-danger">{formErrors.credit}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="balanceCash">
                                        <Form.Label>Balance Cash</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={balanceCash}
                                            onChange={(e) => setBalanceCash(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            disabled
                                        />
                                        {formErrors.balanceCash && <span className="text-danger">{formErrors.balanceCash}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row >
                                <Col>
                                    <Form.Group controlId="expenses">
                                        <Form.Label>Nature Of Expenses</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={expenses}
                                            onChange={(e) => setExpenses(e.target.value)}
                                        />
                                        {formErrors.expenses && <span className="text-danger">{formErrors.expenses}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button variant="primary" type="submit" onClick={handleSave}>
                                        Submit
                                    </Button>
                                    <Button variant="secondary" type="button" onClick={handleCancel} className="ml-2">
                                        Cancel
                                    </Button>
                                </Col>

                            </Row>
                        </Row>
                    </Form>

                </Container>
            )}
        </>
    )
}

export default EditDailyAccounts