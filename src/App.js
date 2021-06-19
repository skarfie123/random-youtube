import './App.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Card from 'react-bootstrap/Card'
import github from './GitHub-Mark.svg'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { url: '' };

    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUrlChange(event) {
    this.setState({ url: event.target.value });
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.url);
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <h2>Random YouTube
          &nbsp;
          <a href="https://github.com/skarfie123/ghp-react"><img class="github"
            src={github} alt="GitHub Logo" /></a>
        </h2>
        <p>Generate random selections from specific YouTube channels</p>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="url-label">YouTube Channel URL</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="https://www.youtube.com/snl"
            aria-label="url"
            aria-describedby="url-label"
            onChange={this.handleUrlChange}
          />
          <InputGroup.Append>
            <Button type="submit" variant="primary" onClick={this.handleSubmit}>Load</Button>
          </InputGroup.Append>
        </InputGroup>

        <div className="row">

          <Card className="column video">
            <Card.Img variant="top" src="https://img.youtube.com/vi/gAYL5H46QnQ/0.jpg" />
            <Card.Body>
              <Card.Title>Video Title</Card.Title>
              <Card.Text>
                Description
              </Card.Text>
              <Button variant="primary" target="_blank" href="https://www.youtube.com/watch?v=gAYL5H46QnQ">Open</Button>
            </Card.Body>
          </Card>
          <div className="column">
            <Button variant="primary">Next</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
