import * as React from 'react';

export interface INavMenuProps {
}

export default class NavMenu extends React.PureComponent<INavMenuProps> {
  public render() {
    return (
      <nav className='navbar' role='navigation' aria-label='main navigation'>
        <div className='navbar-brand'>
          <a className='navbar-item' href='/'>
            TodoApp
          </a>

          <a role='button' className='navbar-burger' aria-label='menu' aria-expanded='false' data-target='navbarBasicExample'>
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
          </a>
        </div>

        <div id='navbarBasicExample' className='navbar-menu'>
          <div className='navbar-start'>
            <a className='navbar-item' href='/lists'>
              Lists
            </a>
          </div>
        </div>
      </nav>
    );
  }
}
