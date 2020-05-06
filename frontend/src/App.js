import React, {Component} from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Upload from './components/upload/index';

class App extends Component {
  render() {
    return (
        <div className="App">
          <div className="Card">
            <Upload/>
          </div>
        </div>
    );
  }
}

export default App;
