import React, { Component } from 'react';
import Navbar from '../components/common/Navbar';
import ModalError from '../components/modals/ModalError';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import './PersonDashboard.css';

class PersonDashboard extends Component {
  state = {
    person: {
      name: ''
    },
    data: [],
    isRequestLoading: false,
    isRequestError: false,
    isRequestMade: false,
    showModal: false
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  };

  handleChange = ({ target: input }) => {
    const person = { ...this.state.person };
    person[input.name] = input.value;
    this.setState({ person });
  };

  handleSearch() {
    this.setState({
      isRequestLoading: true
    });
    const url = process.env.REACT_APP_URL;
    const searchPerson = this.state.person.name;
    const q = '?q=' + searchPerson;
    const fullUrl = url + q;
    const customData =
      '&v=custom%3Auuid%2Cdisplay%2Cage%2Cgender%2CdateCreated';
    const fullUrlCustom = fullUrl + customData;

    fetch(fullUrlCustom, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            isRequestLoading: false
          });
          return response.json();
        } else {
          return Promise.reject({
            status: response.status,
            statusText: response.statusText
          });
        }
      })
      .then(data => {
        this.setState({ data: data.results, isRequestMade: true });
      })

      .catch(error =>
        this.setState(
          {
            isRequestLoading: false,
            isRequestError: true,
            showModal: true
          },
          () => console.error('Error:', error)
        )
      );
  }

  hideModal = () => {
    this.setState({
      showModal: false
    });
  };

  errorModalText = ["We're having technical problems.", 'Please try again.'];

  render() {
    const {
      person,
      isRequestMade,
      isRequestLoading,
      isRequestError,
      showModal,
      data
    } = this.state;
    const isEnabled = person.name.length > 0 && !isRequestLoading;

    let modal = null;
    if (isRequestError && showModal) {
      modal = (
        <ModalError onClose={this.hideModal} text={this.errorModalText} />
      );
    }

    return (
      <div onKeyPress={this.handleKeyPress}>
        <Navbar title=" " />
        <div className="searchForm">
          <legend>Search</legend>
          <div className="formGroup">
            <div className="flex-container-row">
              <div className="search-item">
                <span className="padding" />
                <Input
                  type={'text'}
                  title={'Name '}
                  name={'name'}
                  aria-label={'Name'}
                  aria-required="true"
                  onChange={this.handleChange}
                  value={this.state.name}
                  id="name"
                  required={true}
                />
              </div>
              <div className="search-button">
                <Button
                  disabled={isEnabled ? null : 'disabled'}
                  value="Search"
                  valueLoading="Searching"
                  isLoading={isRequestLoading}
                  searchPage={true}
                  onClick={e => this.handleSearch(e)}
                />
              </div>
            </div>
            {data.length !== 0 ? (
              <p className="numResults">
                <strong>{data.length}</strong> Person(s) found
              </p>
            ) : isRequestMade ? (
              <p className="numResults">No results found</p>
            ) : null}
          </div>
        </div>
        <div className="tableContainer">
          {data.length !== 0 ? <Table data={data} /> : null}
        </div>
        {modal}
      </div>
    );
  }
}

export default PersonDashboard;
