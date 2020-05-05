import React, {Component} from 'react';
import axios from 'axios';

export default class FilesUploadComponent extends Component {

  constructor(props) {
    super(props);

    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      images: '',
      sending: false,
      urls: []
    }
  }

  onFileChange(e) {
    this.setState({images: e.target.files});
  }

  async onSubmit(e) {
    e.preventDefault();

    this.setState({
      sending: true
    });

    const formData = new FormData();

    for (const key of Object.keys(this.state.images)) {
      formData.append('images', this.state.images[key]);
    }

    const result = await axios.post("http://localhost:8080/images", formData, {});

    const urls = [];
    result.data.forEach(path => {
      urls.push(`http://localhost:8080${path}`);
    });

    this.setState({
      sending: false,
      urls
    })
  }

  render() {
    if (this.state.sending) {
      return (<div>Enviando</div>);
    }

    return (
        <div className="container">
          <div className="row">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input type="file" name="images"
                       onChange={this.onFileChange} multiple/>
              </div>
              <div className="form-group">
                <button className="btn btn-primary" type="submit">Upload
                </button>
              </div>
            </form>
          </div>
          {this.state.urls.map(image => <div className="row"><img key={image} alt="converted_gif" src={image} /></div>)}
        </div>
    )
  }
}
