import React, { useState } from "react";
import Header from "./header";
import { MDBInput, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import {Form} from 'react-bootstrap';
import Footer from "./fotter";
import axios from 'axios';
import Cookies from "js-cookie";
import { saveLogs } from './logs';

export default function Login() {
  const [submit,setSubmit]=useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await axios.post('http://localhost:4000/login', formData, {
            headers: {
                "Content-Type": "application/json", 
                "api-key": process.env.REACT_APP_API_KEY,
            },
        });

        setSubmit(false);
        const responseData = response.data;
        if(responseData.message=="success"){
          Cookies.set('email', responseData.email, { expires: 2 });
          Cookies.set('token', responseData.token, { expires: 2 });
          Cookies.set('userId', responseData.userid, { expires: 2 });
          window.location.href = process.env.REACT_APP_URL;
        }
        else if(responseData.message=="invalid"){
          document.getElementById("message").innerHTML="INVALID USERNAME OR PASSWORD";
          document.getElementById("message").style.color="red";
          document.getElementById("message").style.display="block";
        }
    } catch (error) {
        console.error('Error:', error.message);
        setSubmit(false);
        saveLogs(error.message,'/login',"User");
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row" style={{ marginTop: "7%" }}>
          <div className="col-md-6">
            <img
              src="./Assets/login.png"
              alt="Registration"
              className="img-fluid"
            />
          </div>

          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <MDBInput
                type="email"
                label="Email address"
                v-model="email"
                wrapperClass="mb-4"
                id="email"
                name="email"
                required
              />
              <MDBInput
                type="password"
                label="Password"
                v-model="password"
                id="password"
                name="password"
                wrapperClass="mb-4"
                required
              />
              <span id="message"></span>
              <MDBBtn
                style={{ backgroundColor: "#786141" }}
                block
                className="my-4"
              >
                {submit?(
                  <MDBSpinner style={{color:"white"}}></MDBSpinner>
                ):(
                  <span>Login</span>
                )}
              </MDBBtn>
              Don't have an account? <Link to="/register">Register</Link>
            </form>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "5%" }}>
        <Footer />
      </div>
    </div>
  );
}
