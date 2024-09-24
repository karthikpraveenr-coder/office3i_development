import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './css/BlogPage.css';
import Rectangle from './images/BlogPage_image.png';

const BlogPage = () => {
  return (
    <Container className="mt-5 blogpage">
      <Row className='blogpage__row'>
        {/* Left Column for Text Content */}
        <Col md={8}>
          <div className='BlogPage-text'>
            <h1>Why Choose Us?</h1>
            <p className='mb-3'>
              We are committed to delivering software that not only meets but
              exceeds your expectations, providing you with the tools you need
              to succeed. With a deep understanding of HR processes and
              technological advancements, we are here to assist you
              every step of the way.
            </p>
            <p>
              Our intuitive design ensures a seamless user experience for both
              HR professionals and employees. Use data-driven insights to
              make informed decisions and optimize workforce management.
              Identify patterns in attendance, leave usage and payroll expenses
              to optimize workforce management.
            </p>
          </div>
        </Col>

        {/* Right Column for Images */}
        <Col md={4} className="d-flex align-items-end justify-content-end">
          <div className="right-aligned-images">
            <img
              src={Rectangle}
              alt="Placeholder 1"
              className="img-fluid mb-2 Rectangle"
            />
          
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogPage;
