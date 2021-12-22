import './App.css';
import 'tachyons';
import { Component } from 'react';
import Navigation from './components/navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from "react-tsparticles";
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const initialSate = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = initialSate;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    /*kapott valtozot megkapja az ures box a constructorbol*/
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    const { input } = this.state;

    this.setState({ imageUrl: input })

    fetch('https://sheltered-eyrie-59226.herokuapp.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: input
      })
    })
      .then(response => response.json())

      .then(response => {
        console.log('hi', response)
        if (response) {
          fetch('https://sheltered-eyrie-59226.herokuapp.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialSate)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route }); /* elso route az a valtozo a constructorbol a masodik pedig az onRouteChange nek a parametere */
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App" >

        <Particles className="particles"
          options={{ "interactivity": { "events": { "onClick": { "enable": true, "mode": "push" }, "onHover": { "mode": "repulse" } }, "modes": { "bubble": { "distance": 400, "duration": 2, "opacity": 0.8, "size": 40 }, "grab": { "distance": 400 }, "push": { "groups": ["z5000", "z7500", "z2500", "z1000"] } } }, "particles": { "color": { "animation": { "h": { "speed": 20 } } }, "groups": { "z5000": { "number": { "value": 70 }, "zIndex": { "value": 50 } }, "z7500": { "number": { "value": 30 }, "zIndex": { "value": 75 } }, "z2500": { "number": { "value": 50 }, "zIndex": { "value": 25 } }, "z1000": { "number": { "value": 40 }, "zIndex": { "value": 10 } } }, "links": { "color": { "value": "#ffffff" }, "opacity": 0.4 }, "move": { "angle": { "value": 10 }, "attract": { "rotate": { "x": 600, "y": 1200 } }, "direction": "right", "enable": true, "outModes": { "bottom": "out", "left": "out", "right": "out", "top": "out" }, "speed": 5 }, "number": { "value": 200 }, "opacity": { "animation": { "speed": 3, "minimumValue": 0.1 } }, "zIndex": { "value": 5, "opacityRate": 0.5 } }, "emitters": { "autoPlay": true, "fill": true, "life": { "wait": false }, "rate": { "quantity": 1, "delay": 7 }, "shape": "square", "startCount": 0, "size": { "mode": "percent", "height": 0, "width": 0 }, "particles": { "shape": { "type": "images", "options": { "images": { "src": "https://particles.js.org/images/cyan_amongus.png", "width": 500, "height": 634 } } }, "size": { "value": 40 }, "move": { "speed": 10, "outModes": { "default": "none", "right": "destroy" }, "straight": true }, "zIndex": { "value": 0 }, "rotate": { "value": { "min": 0, "max": 360 }, "animation": { "enable": true, "speed": 10, "sync": true } } }, "position": { "x": -5, "y": 55 } } }}
        />

        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {
          route === 'home' /* if statement*/
            ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition
                box={box}
                imageUrl={imageUrl} />
            </div>
            : (
              route === 'signin'
                ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
