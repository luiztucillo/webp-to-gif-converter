import React, {Component} from 'react';
import './index.css';
import Dropzone from '../dropzone/index';
import Progress from "../progress/index";
import Config from '../../config';

const STATE_UPLOADING = 'uploading';
const STATE_ERROR = 'error';
const STATE_INITIAL = 'initial';
const STATE_DONE = 'done';
const STATE_CONVERTING = 'converting';

const BACKEND_URL = Config.url;

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploadProgress: {},
      generalState: 'initial'
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadButtonAction = this.uploadButtonAction.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files
    }));
  }

  renderActions() {
    if (this.state.generalState === STATE_UPLOADING) {
      return (<button disabled>Enviando</button>);
    }

    if (this.state.generalState === STATE_INITIAL) {
      return (
          <button
              disabled={this.state.files.length <= 0}
              onClick={this.uploadButtonAction}
          >
            Upload
          </button>
      );
    }

    if (this.state.generalState === STATE_ERROR || this.state.generalState === STATE_DONE) {
      return (
          <button
              onClick={() =>
                  this.setState({
                    files: [],
                    generalState: STATE_INITIAL,
                    uploadProgress: {}
                  })
              }
          >
            Clear
          </button>
      );
    }
  }

  renderFile(file) {

    const uploadProgress = this.state.uploadProgress[file.name];
    const state = uploadProgress ? uploadProgress.state : STATE_INITIAL;
    let result = '';
    let src = URL.createObjectURL(file);

    if (state === STATE_ERROR) {
      result = (<div className="Error">{uploadProgress.body}</div>);
    }

    if (state === STATE_DONE) {
      src = `${BACKEND_URL}${uploadProgress.body}`;
    }

    if (state === STATE_CONVERTING) {
      result = (<div className="Converting">Convertendo</div>);
    }

    return (
        <div key={file.name} className={`Row FileRow ${state === STATE_DONE ? 'Converted' : ''}`} data-file={file.name}>
          <div className="Preview">
            <div className="PreviewColumn">
              <img alt={file.name} src={src}/>
            </div>
            <div className="PreviewColumn">
              <div className="Filename">{`${file.name}`}</div>
              <button className="delete" onClick={() => {
                const files = [...this.state.files];
                const idx = files.indexOf(file);
                const copy = {...this.state.uploadProgress};
                delete copy[file.name];

                if (idx >= 0) {
                  files.splice(idx, 1);
                  this.setState({
                    files,
                    generalState: files.length <= 0 ? STATE_INITIAL : this.state.generalState,
                    uploadProgress: copy
                  });
                }

              }}>Remover</button>
              <div className="Result">
                {result}
              </div>
            </div>
          </div>
          <div className="Data">
            {this.renderProgress(uploadProgress)}
          </div>
        </div>
    );
  }

  renderProgress(uploadProgress) {
    return (
        <div className="ProgressWrapper">
          <Progress
              progress={uploadProgress ? uploadProgress.percentage : 0}
              error={uploadProgress && uploadProgress.state === STATE_ERROR}
          />
        </div>
    );
  }

  async uploadButtonAction() {
    this.setState({uploadProgress: {}, generalState: STATE_UPLOADING});
    const promises = [];
    this.state.files.forEach(file => {
      promises.push(this.sendRequest(file));
    });
    try {
      await Promise.all(promises);
      this.setState({generalState: STATE_DONE});
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({generalState: STATE_ERROR});
    }
  }

  sendRequest(file) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const copy = {...this.state.uploadProgress};
          copy[file.name] = {
            state: STATE_UPLOADING,
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({uploadProgress: copy});
        }
      });

      req.upload.addEventListener("load", event => {
        const copy = {...this.state.uploadProgress};
        copy[file.name] = {state: STATE_CONVERTING, percentage: 100};
        this.setState({uploadProgress: copy});
      });

      req.addEventListener("error", event => {
        const message = 'Error uploading file';
        this.fileError(file, message);
        reject(req.responseText);
      });

      req.addEventListener('load', event => {
        if (req.status !== 200) {
          this.fileError(file, req.response);
          reject(req.response);
          return;
        }

        const copy = {...this.state.uploadProgress};
        copy[file.name] = {
          state: STATE_DONE,
          percentage: 100,
          body: JSON.parse(req.response)
        };

        this.setState({uploadProgress: copy});

        resolve();
      });

      const formData = new FormData();
      formData.append("images", file, file.name);

      req.open("POST", `${BACKEND_URL}/images`);
      req.send(formData);
    });
  }

  fileError(file, message) {
    const copy = {...this.state.uploadProgress};
    copy[file.name] = {
      state: STATE_ERROR,
      percentage: 100,
      body: message
    };
    this.setState({uploadProgress: copy});
  }

  render() {
    return (
        <div className="Upload">
          <div className="Content">
            {this.state.generalState === STATE_INITIAL &&
            <Dropzone
                onFilesAdded={this.onFilesAdded}
                disabled={this.state.generalState !== STATE_INITIAL}
            />
            }
            {this.state.files.length > 0 &&
            <div className="Files">
              {this.state.files.map(file => this.renderFile(file))}
            </div>
            }
          </div>
          <div className="Actions">{this.renderActions()}</div>
        </div>
    );
  }
}
