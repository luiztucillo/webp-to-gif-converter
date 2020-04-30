import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import FilesUploadComponent from './components/files-upload-component';

class App extends Component {
  render() {
    return (
        <div className="App">
          <FilesUploadComponent />
        </div>
    );
  }
}

export default App;
