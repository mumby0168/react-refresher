import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';

import './custom.css'
import { ListsPage } from './pages/ListsPage';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/lists' component={ListsPage} />
      </Layout>
    );
  }
}
