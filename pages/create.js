import React, { Component } from "react";
import Header from "../components/Header";
import Layout from "../layouts";
import axios from "axios";
import Router from "next/router";

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      error: null
    };
  }

  handleSubmit = async event => {
    event.preventDefault();
    const name = this.state.name.trim();
    if (name === "") {
      this.setState({ error: "Please enter name of conatiner" });
      return;
    }
    this.setState({ error: null });
    const container = { name };
    axios
      .post("http://localhost:3000/api/docker/create", container)
      .then(response => {
        Router.push("/");
      })
      .catch(error => {
        this.setState({ error: "container name already exist" });
      });
  };

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    return (
      <Layout>
        <Header />
        <div className="container">
          <p>Create your conatiner here</p>
          {this.state.error ? (
            <div className="alert alert-danger" role="alert">
              {this.state.error}
            </div>
          ) : null}

          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                aria-describedby="emailHelp"
                placeholder="Enter Conatiner Name"
                onChange={this.onChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </Layout>
    );
  }
}

export default Create;
