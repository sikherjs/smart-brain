import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import 'tachyons';
import Rank from './components/Rank/Rank';
import Particles from 'react-tsparticles';
import {loadFull} from 'tsparticles';
import './App.css';





const particlesInit = async (main) => {
  console.log(main);
  await loadFull(main);
};
const particlesLoaded = (container) => {
  console.log(container);
};

const initialState = {
        input: '' ,
        imageUrl: '',
        box: {},
        route: 'signin',
        isSignedIn: false,
        user:{
          id:'',
          name:'',
          email:'',
          entries:0,
          joined: ''
        }         
}


class App extends Component {
    constructor(){
      super();
      this.state = initialState;
    
    }

    loadUser = (data)=>{
      this.setState({user:{
          id:data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
      }})
    }
    

    calculateFaceLocation = (data) =>{
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.width);
      return {
        leftCol: clarifaiFace.left_col * width, // leftCol is the percentage of the width of the image i.e the image width
        topRow:clarifaiFace.top_row * height,
        rightCol: (width)-(clarifaiFace.right_col* width),
        bottomRow:(height)-(clarifaiFace.bottom_row * height),
      }
    }


    displayFaceBox = (box) => {
      this.setState({box: box}) 
    }

    onInputChange = (event)=>{
      this.setState({input: event.target.value});
    }
    
   onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('https://face-detector-api.onrender.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://face-detector-api.onrender.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

    onRouteChange = (route)=>{
      if(route =='signout'){
        this.setState(initialState);
      }else if(route ==='home'){
        this.setState({isSignedIn:true})
      }
      this.setState({route : route });
    }

    render() {
      const {isSignedIn,imageUrl,route,box} = this.state;
      return (
        <div className="App">
          <Particles
            className="particles"
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              background: {
                color: {
                  value: "linear-gradient(89deg, #ff5edf 0%, #04c8d3 100%)",
                },
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: "#ffffff",
                },
                links: {
                  color: "#ffffff",
                  distance: 150,
                  enable: true,
                  opacity: 0.5,
                  width: 1,
                },
                collisions: {
                  enable: true,
                },
                move: {
                  direction: "left",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 6,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 50,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 5 },
                },
              },
              detectRetina: true,
            }}
          />   
          <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange} />
          {route === 'home'
            ? <div>
                  <Logo />
                  <Rank
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                   />
                  
                  
                  <ImageLinkForm 
                    onInputChange={this.onInputChange} 
                    onButtonSubmit = {this.onButtonSubmit}
                  />
                  <FaceRecognition box={box} imageUrl={imageUrl} />
              </div>
            : (this.state.route ==='signin' 
              ? <Signin 
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange}/>
              : <Register 
                onRouteChange={this.onRouteChange}
                loadUser={this.loadUser}
                />
              )
          }
        </div>
      );
    }
}

export default App;
