import React from 'react';
import SearchSuggestions from './SearchSuggestions';
import './SearchBox.css';

class SearchBox extends React.Component {
  constructor() {
    super();

    this.state = {
      query: '',
      data: [], 
      error: null,
      displaySuggestions: false,
      displayClearButton: false,
    }

    /**
     * Add class refs
     */
    this.input = React.createRef();
    this.form = React.createRef();
    /**
     * Add class functions
     */
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideSuggestions = this.hideSuggestions.bind(this);
  };

  /**
   * Handler for onchange event this.input
   */
  handleKeyUp(event) {
    const { key, target } = event;
    if (key === 'Escape') { return false };
    
    this.setState({
      query: target.value,
    });

    if (!target.value.length) {
      this.setState({
        displayClearButton: false,
      });
    } else {
      this.setState({
        displayClearButton: true,
      });
    }

    this.fetchResults();
  };

  handleSubmit(event) {
    const form = this.form.current;
    event.preventDefault();

    if (this.input.current.value < 3 ) {
      return false;
    }

    setTimeout(() => {
      form.submit();
    },300);
  }

  /**
   * Fetching results;
   */
  fetchResults() {
    const { query } = this.state;
    return fetch(`/search?q=${query}`, { method: 'get' })
      .then(res => res.json())
      .then(data => {
        const { suggestions } = data;

        if (!suggestions) { return false; }
        this.filterSuggestions(suggestions);
      })
      .catch(error => { throw Error(error);
      }, this);
  }

  filterSuggestions(suggestions) {
    const { query } = this.state;
    /**
     * Filter data that matches the search query
     */
    const data = suggestions.filter(suggestion => suggestion.searchterm.search(query) >= 0);
    
    /**
     * If data has length fill state
     */
    if (data.length && query.length) {
      this.setState({
        data,
        error: null,
        displaySuggestions: true,
      });

      return;
    };

    /**
     * Else return error
     */
    this.setState({
      data: [],
      error: 'Helaas uw zoekterm heeft niks opgeleverd',
      display: false,
    });
  }

  hideSuggestions() {
    this.setState({
      displaySuggestions: false,
    });
  }

  /**
   * Handler for onclick event clearButton
   */
  handleOnClick() {
    this.clearValue();
    this.hideSuggestions();
    this.setState({
      displayClearButton: false,
      error: '',
    });
  }

  /**
   * Resets input value
   */
  clearValue() {
    this.input.current.value = '';
  }

  render() {
    const {
      query,
      data,
      error,
      displaySuggestions,
      displayClearButton,
    } = this.state;
        
    return (
      <header className="m-header">
        <div className="m-container">
          <form
            type="post"
            className="m-search-box"
            action="/search"
            autoComplete="off"
            onSubmit={(event) => this.handleSubmit(event)}
            ref={this.form}
          >

          {displayClearButton ?
            <button
              type="button" 
              className="m-search-box__clear"
              onClick={this.handleOnClick}
            >
            </button>
          : ''}
          
          {displaySuggestions ? 
            <SearchSuggestions
              suggestions={data}
              query={query}
              input={this.input.current}
              hideSuggestions={this.hideSuggestions}
              handleSubmit={this.handleSubmit}
            />
          : ''}

          {error && query.length ? 
            <span className="m-search-box__warning">{error}</span> 
          : ''}

            <input
              className="m-search-box__input"
              type="text"
              spellCheck="false"
              name="q"
              placeholder="Zoeken"
              onKeyUp={this.handleKeyUp}
              ref={this.input}
            />
          </form>
        </div>
      </header>
    )
  };
};

export default SearchBox;
