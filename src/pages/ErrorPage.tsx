import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { faArrowLeft, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <img src="../../assets/computer-guy.jpg" alt="404" style={{ width: "50%", float: "right" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "Comic Sans MS",
          textAlign: "right",
          padding: "20px"          
        }}
      >
          <h1 style={{ fontSize: "7rem", marginBottom: "20px", color: '#ED080B' }}>Oops!</h1>
          <p style={{ fontSize: "1.3rem", marginBottom: "20px" }}>
              Looks like you're lost. ꩜﹏꩜
          </p>
          <p style={{ fontSize: "1rem" }}>
              We can't seem to find the page you're looking for.
          </p>
          <p style={{ fontSize: "1rem", marginBottom: "40px", color: '#969696' }}>
              Error code: 404
          </p>
          <div>
            <Link
                to="/"
                style={{
                fontSize: "1rem",
                padding: "10px 20px",
                backgroundColor: "#7808ED",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "5px",
                marginRight: "10px",
                }}
            >
              <FontAwesomeIcon icon={faHouse} />&nbsp;
              Go back Home
            </Link>
            <button
                style={{
                fontSize: "1rem",
                padding: "10px 20px",
                backgroundColor: "#7808ED",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "5px",
                }}
              onClick={handleGoBack}
            >
                <FontAwesomeIcon icon={faArrowLeft} />&nbsp;
                Go back to the previous page
            </button>
          </div>
      </div>
    </>
  );
};

export default ErrorPage;
