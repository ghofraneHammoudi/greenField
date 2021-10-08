import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import SignUp from './components/SignUp.jsx';
import SignIn from './components/SignIn.jsx';
import HomePage from './components/HomePage.jsx';
import Details from './components/Details.jsx';
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      view: 'homepage',
      currentTrailer: null,
      user: false,
      data: [],
      trailers:[],
      populars:[],
      video:{
        countries: null,
        description: "",
        directors: [""],
        genres: null,
        imdb_rating: "",
        language: [],
        release_date: "",
        poster: "",
        stars: [],
        title: "",
        year: "",
        youtube_trailer_key: "",
        comments: [""]
      },
      comment:'',
      trailer:{
        countries: null,
        description: "",
        directors:[""],
        genres: null,
        imdb_rating: "",
        language: [],
        release_date: "",
        poster: "",
        stars: [],
        title: "",
        year: "",
        youtube_trailer_key: "",
      }
    }

    this.changeView = this.changeView.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.signUpsubmit = this.signUpsubmit.bind(this);
    this.signInsubmit = this.signInsubmit.bind(this);
    this.getOne= this.getOne.bind(this)
    this.getTrailer= this.getTrailer.bind(this)
    this.getPop=this.getPop.bind(this)
    // this.postComment= this.postComment.bind(this)
    this.putComments= this.putComments.bind(this)
  }


  //// from dhafer 
  handleSearch(event) {
    let datafiltred = this.state.data.filter((element) => {
      return element.title === event || event.slice(0, 2);
    });
    this.setState({
      view: event,
      data: datafiltred
    });

  }

  changeView(option) {
    this.setState({
      view: option
    });
  }
  signUpsubmit() {
    if (this.state.password !== '' && this.state.username !== '') {
      axios.post('/signup', { username: this.state.username, password: this.state.password })
        .then(() => {
          this.setState({
            username: '',
            password: '',
            user: true
          })
        })

        .catch(() => { alert('username already existed') })

    }
    else { alert('fill all the fields ') }
  }

getData(){
  axios.get("http://localhost:3000/api/videos")
  .then((response)=>{ 
    this.setState({   
      trailers: response.data
    })
  })
}


  signInsubmit() {
    if (this.state.password !== '' && this.state.username !== '') {
      axios.post('/signin', { username: this.state.username, password: this.state.password })
        .then((data) => {console.log('here',data)
          if (data.data===true) {
            this.setState({
              user: true,
              username: '',
              password: ''
            })
          }
        })
        .catch((err) => { alert('Verify username or Password') })
    }
  }




  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
getPop(){
  axios.get("/api/pop")
  .then((response)=>{ 
    this.setState({   
      populars: response.data
    })
    console.log("ghof" , this.state.populars)
  })
}
componentDidMount(){
  this.getData()
  this.getPop()
}
getOne(videoId){
  axios.get(`http://localhost:3000/api/videos/${videoId}`)
  .then((response)=>{ 
    this.setState({
      video: response.data
    })
    // console.log(this.state.video.directors)
  })
}

getTrailer(videoId){
  axios.get(`http://localhost:3000/api/pop/${videoId}`)
  .then((response)=>{  
    this.setState({
      trailer: response.data
    })
  })
}

// postComment(){
//   axios.post("http://localhost:3000/api/videos",{comments:this.state.video.comments})
//   .then((response)=>{
//       console.log(response)
//   })
//   .then (()=>{
//     alert("posted!")
//   })
//   .catch ((err)=>{
//     console.log(err)
//   })
// }

putComments(videoId,newComment){
  axios.put(`http://localhost:3000/api/videos/${videoId}`,{comment:newComment})
  .then((response)=>{
    console.log(response)
  })
}

  renderView() {
    const view = this.state.view;
    const user = this.state.user;
    if (view === 'signin') {
      return <SignIn username={this.state.username} password={this.state.password} submit={this.signInsubmit} handleChange={this.handleChange} handleClick={() => this.changeView('login')} />
    }
    else if (view === 'signup') {
      return <SignUp username={this.state.username} password={this.state.password} submit={this.signUpsubmit} handleChange={this.handleChange} />
    }
    else if(view==='homepage'){
      return <HomePage trailers={this.state.trailers} trailer={this.state.trailer}
      handleTrailerItems={this.handleTrailerItems} handleClick={() => this.changeView('fff')}
      getOne={this.getOne} getPop={this.getPop}  getTrailer={this.getTrailer} populars={this.state.populars}/>
    }
    else  {
      return <Details video={this.state.video} handleChange={this.handleChange} putComments={this.putComments}  />
    }

  }
  render() {
    
    return (
      <div>
        <div className="nav">

          <span className={this.state.view === 'homepage' ,'logo'}
            
          onClick={() => this.changeView('homepage')} >
              ЯMDb
          </span>

          <span className={this.state.view === 'rmdb'
            ? 'nav-selected'
            : 'nav-unselected'}
            onClick={() => this.changeView('towatch')}>
            WatchList
          </span>

          <span className="nav-unselected" onClick={() => this.changeView('signin')}>
            Sign In
          </span>
          <span className="nav-unselected" onClick={() => this.changeView('signup')}>
            Sign Up
          </span>
        </div>

        <div className="main">
          {this.renderView()}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('RMDb'));
