import React from 'react';
import { storiesOf } from '@storybook/react';
import Highlight from 'react-highlighter';
import '../src/index.css';
import '../src/components/SearchBox.css';
import '../src/components/SearchSuggestions.css';


const input = (<input
  className="m-search-box__input"
  type="text"
  name="q"
  placeholder="Zoeken"
  onKeyUp={this.handleKeyUp}
  ref={this.input}
/>);

const suggestions = (
  <div style={{position: 'relative'}}>
    <div className="m-search-suggestions" ref={this.container}>    
      <div className='m-search-suggestions__item'>
        <span className="m-search-suggestions__term"><Highlight search='trui'>Heren trui</Highlight></span>
        <span className="m-search-suggestions__count">(100)</span>
      </div>  
      <div className='m-search-suggestions__item'>
        <span className="m-search-suggestions__term"><Highlight search='trui'>Kinder trui</Highlight></span>
        <span className="m-search-suggestions__count">(100)</span>
      </div>  
      <div className='m-search-suggestions__item'>
        <span className="m-search-suggestions__term"><Highlight search='trui'>Vrouwen trui</Highlight></span>
        <span className="m-search-suggestions__count">(100)</span>
      </div>  
    </div>
  </div>
)

storiesOf('Search box', module)
  .add('Input', () => input)
  .add('Search results', () => suggestions)
