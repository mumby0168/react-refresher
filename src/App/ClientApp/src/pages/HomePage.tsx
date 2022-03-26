import React, { Component } from 'react';

export class HomePage extends Component {
  static displayName = HomePage.name;

  render() {
    return (
      <section className='hero is-fullheight-with-navbar'>
        <div className='hero-body'>
          <div>
            <p className='title'>
              Todo React Application
            </p>
            <p className='subtitle'>
              A simple todo application written in react
            </p>
          </div>
        </div>
      </section>
    );
  }
}
