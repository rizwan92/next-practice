import React, { Component } from "react";
import Header from "../components/Header";
import Layout from "../layouts";
import fetch from "isomorphic-unfetch";
import moment from "moment";
import axios from "axios";

class Home extends Component {
  state = { error: null };
  handleStop = containerId => {
    axios
      .post("http://localhost:3000/api/docker/stop", { id: containerId })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        this.setState({ error: "Something went wrong" });
      });
  };
  render() {
    console.log(this.props.containers);
    return (
      <Layout>
        <Header />
        <div className="container-fluid">
          <h1>Conatiners </h1>
          {this.state.error ? (
            <div className="alert alert-danger" role="alert">
              {this.state.error}
            </div>
          ) : null}
          <ul className="list-group">
            {this.props.containers.map((cnt, i) => {
              const isPort = cnt.ports === "" ? false : true;
              if (isPort) {
                var one = cnt.ports.split(":");
                var two = one[1].split("->");
                var port = two[0];
              }
              const status = cnt.status.indexOf("Up") === -1 ? false : true;
              console.log(status);
              const containerId = cnt["container id"];
              return (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {isPort ? (
                    <a target="_blank" href={`http://localhost:${port}`}>
                      {cnt.names}
                    </a>
                  ) : (
                    `${cnt.names}`
                  )}
                  <span className="badge badge-primary badge-pill">
                    {cnt.created}
                  </span>
                  <span className="badge badge-primary badge-pill">
                    {isPort ? `${cnt.ports}` : "No ports"}
                  </span>
                  <span className="badge badge-primary badge-pill">
                    {cnt.status}
                  </span>
                  <span className="badge badge-primary badge-pill">
                    {cnt.image}
                  </span>
                  <span
                    className="badge badge-primary badge-pill"
                    onClick={() => this.handleStop(containerId)}
                  >
                    {status ? "stop" : "start"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Layout>
    );
  }
}

Home.getInitialProps = async function() {
  const res = await fetch("http://localhost:3000/api/docker");
  const data = await res.json();
  console.log(`Show data fetched. Count: ${data}`);
  return {
    containers: data.containerList
  };
};

export default Home;
