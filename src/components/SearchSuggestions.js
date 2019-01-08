import React from 'react';
import Highlight from 'react-highlighter';
import './SearchSuggestions.css'

/**
 * Using react-highlighter to highlight matching substring
 */
class SearchSuggestions extends React.Component {
  constructor() {
    super();
    
    this.state = {
      currentIndex: 0,
    }
    
    /**
     * Add class functions
     */
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDocumentKeyup = this.handleDocumentKeyup.bind(this);
  };

  componentDidMount() {
    document.addEventListener('keyup', this.handleDocumentKeyup);
  }

  handleMouseEnter(event) {
    const { target } = event;
    
    this.setState({
      currentIndex: parseInt(target.dataset.index, 10),
    });
  };

  handleOnClick(event) {
    const { target } = event;
    this.props.input.value = this.props.suggestions[target.dataset.index].searchterm;
    this.props.hideSuggestions();
    this.props.handleSubmit(event);
  }

  handleMouseLeave(event) {
    const { target } = event;
    target.classList.remove('hovered');
  }

  handleDocumentKeyup(event) {
    const { currentIndex } = this.state;
    const { suggestions, hideSuggestions } = this.props;
    const { key } = event;
    
    /**
     * Handle arrow up event
     */
    if (key === 'ArrowDown') {
      this.setState(prevState => {
        return { currentIndex: prevState.currentIndex + 1 };  
      });

      if (!suggestions[currentIndex]) {
        this.setState({
          currentIndex: 0,
        });
      };
    };

    /**
     * Handle arrow down event
     */
    if (key === 'ArrowUp') {
      this.setState(prevState => {
        return { currentIndex: prevState.currentIndex - 1 };  
      });

      if (currentIndex === 0) {
        this.setState({
          currentIndex: suggestions.length - 1,
        });
      };
    };

    /**
     * Hide suggestions on Esc click
     */
    if (key === 'Escape') {
      hideSuggestions();
    }

    /**
     * Handle enter event
     */
    if (key === 'Enter') {
      const selectedResult = suggestions[currentIndex].searchterm;
      const { input } = this.props;
      if (!selectedResult) { return };
      input.value = selectedResult;
    }
  }
 
  render() {
    const { suggestions, query } = this.props;
    const { currentIndex } = this.state;
    
    return (
      <div className="m-search-suggestions" ref={this.container}>
        {suggestions.map((suggestion, i) => {
          let classNames = 'm-search-suggestions__item';

          /**
           * Handle classname logic
           */
          if (currentIndex === i) {
            classNames = `${classNames} hovered`;
          }

          return (
            <div
              className={classNames}
              key={suggestion.nrResults}
              data-index={i}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onClick={this.handleOnClick}
            >
              <span className="m-search-suggestions__term">
                <Highlight search={query}>
                  {suggestion.searchterm}
                </Highlight>
              </span>
              <span className="m-search-suggestions__count">({suggestion.nrResults})</span>
            </div>  
          )
        })}
      </div>
    );
  };
};

export default SearchSuggestions;
