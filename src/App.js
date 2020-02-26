import React from 'react';
import './App.css';
import SpotifyPlayer from 'react-spotify-player';
//import axios from 'axios';

var createReactClass = require('create-react-class');
 
var Twitter = require('twitter');
var config = require('./config.js');
var songkick = require('./songkick.js');

// var artist = "chvrches"


var App = createReactClass({
  getInitialState : function() {
    return {
        artist : "kanye west"
      }

    },
    updateArtist : function(artist) {
     // set the state

     this.setState({ artist : artist });
    },
    render: function() {
      return (
        <div className="App">
          <header className="App-header">
            Museek
          </header>

          <ArtistForm artist={this.state.artist} updateArtist={this.updateArtist} />

          <div id="container" className="container-fluid" style={{marginTop:'50px'}}>
            <div id="left" className="col-sm d-flex flex-column bg-light rcorners">
              <h2><b>Artist Concerts</b></h2>
              <Concerts artist={this.state.artist} />
            </div>
            <div id="center" className="col-sm d-flex flex-column bg-light rcorners">
              <h2><b>Artist Albums</b></h2>
              <Songs artist={this.state.artist} />
            </div>
            <div id="right" className="col-sm d-flex flex-column bg-light rcorners">
              <h2><b>Artist News</b></h2>
              <a href='https://newsapi.org/'>from News API</a>
              <News artist={this.state.artist} />
            </div>
          </div>
        </div>
      );
     }
    });
     
class News extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      news : [],
      error: null
    }
  }

  componentDidMount() {
    var search = this.props.artist;
    search = search.replace(/\s+/g,"_");
    
    var url = 'https://newsapi.org/v2/everything?' + 
    'q=' + search + '&' +
    'apiKey=95d7ef28dd56490e8e778a2b1fb714ad';

    fetch(url).then(response => 
      response.json()
    ).then((data) => {
      if (data.status !== 'error') { 
        this.setState({news : data.articles})
      }
      else {
        this.setState({error : data.status})
      }
    }
    )
  }

  componentDidUpdate(prevProps) {
    if (this.props.artist !== prevProps.artist) {
      var search = this.props.artist;
      search = search.replace(/\s+/g,"_");
      
      var url = 'https://newsapi.org/v2/everything?' + 
      'q=' + search + '&' +
      'apiKey=95d7ef28dd56490e8e778a2b1fb714ad';

      fetch(url).then(response => 
        response.json()
      ).then((data) => {
        if (data.status !== 'error') { 
          this.setState({news : data.articles})
        }
        else {
          this.setState({error : data.status})
        }
      }
      )
    }
  }


  render() {
    if (!this.state.error) {
      return this.state.news.map((articles) =>
      <div className='rcorners bg-dark'>
        <p className='text-light'>Title: <b>{articles.title}</b></p>
        <p className='text-light'>Author: {articles.author}</p>
        <a href={articles.url} className='text-light'>LINK</a>
      </div>
      );
    }
    else if (this.state.error === 'error') {
      return <p>The free News API has hit the limit for requests. Please contact us so we can get a new API key.</p>
    }
    else {
      return <p>No news found!</p>
    }
  }
};

class Concerts extends React.Component{
  constructor(props) {
    super(props)
    this.state ={
      id : null,
      error : null,
      isLoaded : false,
      items : []
    }
  }

  // called when the component is first made
  componentDidMount() {
    var search = this.props.artist;
    search = search.replace(/\s+/g,"_");
    console.log("https://api.songkick.com/api/3.0/search/artists.json?apikey=" + "FGmLpLjD1UfLxh9y" + "&query="+ search)
    fetch("https://api.songkick.com/api/3.0/search/artists.json?apikey=" + "FGmLpLjD1UfLxh9y" + "&query="+ search)
      .then(res => res.json())
      .then(
        (data) => {
          if (data.resultsPage.results.artist != null) {
          console.log(data.resultsPage.results.artist[0].id)
          this.fetchConcertData(data.resultsPage.results.artist[0].id);
          this.setState({
            isLoaded: false,
            id : data.resultsPage.results.artist[0].id
          })
          }
          else {
            alert("There is no artist found!");
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error});
          }
        )
  }

  // called every time when we put something into the search field
  componentDidUpdate(prevProps) {
    if (this.props.artist !== prevProps.artist) {
    var search = this.props.artist;
    search = search.replace(/\s+/g,"_");
    console.log("https://api.songkick.com/api/3.0/search/artists.json?apikey=" + "FGmLpLjD1UfLxh9y" + "&query="+ search)
    fetch("https://api.songkick.com/api/3.0/search/artists.json?apikey=" + "FGmLpLjD1UfLxh9y" + "&query="+ search)
      .then(res => res.json())
      .then(
        (data) => {
        if (data.resultsPage.results.artist != null) {
          console.log(data.resultsPage.results.artist[0].id)
          this.fetchConcertData(data.resultsPage.results.artist[0].id);
          this.setState({
            isLoaded: false,
            id : data.resultsPage.results.artist[0].id
          },
          () => {
            // placeholder to run console.log after setState finishes for debugging
          });
        }
        else {
          alert("There is no artist found!")
        }
        },
        
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error});
          }
        )
    }
  }

  fetchConcertData(id) {
    var artistID = id;
    console.log(artistID);
    console.log("https://api.songkick.com/api/3.0/artists/"+ artistID + "/gigography.json?apikey=" + "FGmLpLjD1UfLxh9y");
    fetch("https://api.songkick.com/api/3.0/artists/"+ artistID + "/gigography.json?apikey=" + "FGmLpLjD1UfLxh9y")
      .then(res => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            items : data.resultsPage.results.event
            // this.state.items.concat([data.resultsPage.results.event])
          });
          //console.log(this.state.items)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error:</div>;
    } 
    else if (!isLoaded) {
      return <div>Loading...</div>;
    }
    else if (!this.state.id) {
      return (
        <div>No data!</div>
      )
    }
    // else if (!this.state.item) {
    //   return (
    //     <div>No data!</div>
    //   )
    // }
    else {
      
      return (
        <div>
          {items.map(item => 
          <div style={{paddingTop:'10px'}}>
          <li><a href={item.uri}>{item.displayName}</a></li>
          </div>  
          
          )};
        </div> 
      );
    }
  }
};

var ArtistForm = createReactClass({
  getInitialState: function(e) {
    return {artist: this.props.artist};
  },
  createArtist : function(e) {
    e.preventDefault();
    //get the artist object name from the form
    var artist = this.refs.artistName.value;
    //if we have a value
    //call the addArtist method of the App component
    //to change the state of the artist list by adding an new item
    if(typeof artist === 'string' && artist.length > 0) {
      this.props.updateArtist(this.refs.artistName.value)
      this.setState({artist : this.refs.artistName.value});
    }
    },
    render : function() {
    return(
      <div className="search">
        <form className="form-group" style={{ width:'50%', margin: 'auto'}} ref="artistForm" onSubmit={this.createArtist}>
              <label for="artistItem" className="text-white form-label float-left">Artist Name</label>
              <input type="text" id="artistItem" placeholder="Type the artist you would like more info on and press enter!" ref="artistName" className="form-control form-control-lg" />
        </form>
      </div>
    )
  }
});

class Songs extends React.Component{
  constructor(props) {
    super(props)
    this.state ={
      id : null,
      error : null,
      isLoaded : false,
      items : []
    }
  }

  // called when the component is first made
  componentDidMount() {
    var search = this.props.artist;
    search = search.replace(/\s+/g,"_");
    console.log("http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + search + "&autocorrect=1&limit=10&api_key=08d22b084a7a2d7c10999de569485ef9&format=json")
    fetch("http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + search + "&api_key=08d22b084a7a2d7c10999de569485ef9&format=json")
      .then(res => res.json())
      .then(
        (data) => {
          if (data.topalbums.album != null) {
            console.log(data.topalbums.album)
            this.setState({
              isLoaded: true,
              items : data.topalbums.album
            },
          () => {
            
          });
          }
          else {
            alert("There is no artist found!");
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error});
          }
        )
  }

  // called every time when we put something into the search field
  componentDidUpdate(prevProps) {
    if (this.props.artist != prevProps.artist) {
    var search = this.props.artist;
    search = search.replace(/\s+/g,"_");
    console.log("http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + search + "&autocorrect=1&limit=10&api_key=08d22b084a7a2d7c10999de569485ef9&format=json")
    fetch("http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + search + "&api_key=08d22b084a7a2d7c10999de569485ef9&format=json")
      .then(res => res.json())
      .then(
        (data) => {
        if (data.topalbums.album != null) {
          console.log(data.topalbums.album)
          this.setState({
            isLoaded: true,
            items : data.topalbums.album
          },
          () => {
            // placeholder to run console.log after setState finishes for debugging
          });
        }
        else {
          alert("There is no artist found!")
        }
        },
        
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error});
          }
        )
    }
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error:</div>;
    } 
    else if (!isLoaded) {
      return <div>Loading...</div>;
    }
    else if (!this.state.items) {
      return (
        <div>No data!</div>
      )
    }
    // else if (!this.state.item) {
    //   return (
    //     <div>No data!</div>
    //   )
    // }
    else {
      
      return (
        <div>
          {items.map(item => 
          <div style={{paddingTop:'10px'}}>
          <li ><a href = {item.url}>{item.name}</a></li>
          </div>  
          
          )};
        </div> 
      );
    }
  }
};

export default App;
