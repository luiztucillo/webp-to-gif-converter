import React, {Component} from 'react'
import './index.css'

class Progress extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
        <div className="ProgressBar">
          <div
              className={this.props.error ? 'Progress Error' : 'Progress'}
              style={{width: this.props.progress + '%'}}
          />
        </div>
    )
  }
}

export default Progress