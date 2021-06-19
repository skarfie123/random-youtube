import "./App.css";
import React from "react";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Card from "react-bootstrap/Card";
import github from "./GitHub-Mark.svg";

const API_KEY = "AIzaSyBIdrDqHEmofVBwnGwkDkKO1NAshKWpGCs";
const url_stem = "https://www.youtube.com/channel/";
const example_url = url_stem + "UCqFzWxSCi39LnW1JKFR3efg";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: example_url,
      title: "Threw It On The Ground",
      channelTitle: "thelonelyisland",
      thumbnail: "https://i.ytimg.com/vi/gAYL5H46QnQ/maxresdefault.jpg",
      link: "https://www.youtube.com/watch?v=gAYL5H46QnQ",
      isLoading: false,
    };

    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.randomise = this.randomise.bind(this);
    this.list = [];
  }

  handleUrlChange(event) {
    this.setState({ url: event.target.value });
  }

  async handleSubmit(event) {
    this.setState({ isLoading: true });
    this.list = [];
    event.preventDefault();
    var split = this.state.url.split(url_stem);
    if (split.length !== 2) {
      alert("Please prove a channel url such as: " + example_url);
      return;
    }

    var channel_list_url = `https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&id=${split[1]}&key=${API_KEY}`;
    var channel = await fetch(channel_list_url).then((response) =>
      response.json()
    );

    // get id of the channel's upload playlist
    var cui = channel.items[0].contentDetails.relatedPlaylists.uploads;

    // get first page of playlist
    var uploads_list_url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${cui}&key=${API_KEY}`;
    var page = await fetch(uploads_list_url).then((response) =>
      response.json()
    );
    this.list = this.list.concat(page.items);

    // get further pages if they exist
    while (page.nextPageToken) {
      uploads_list_url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${cui}&key=${API_KEY}&pageToken=${page.nextPageToken}`;
      page = await fetch(uploads_list_url).then((response) => response.json());
      this.list = this.list.concat(page.items);
    }
    this.setState({ isLoading: false });
    console.log(`Total Videos: ${this.list.length}`);

    //generate first video
    this.randomise();
  }

  randomise() {
    if (this.list.length == 0) {
      alert("No videos have been loaded");
      return;
    }
    var number = Math.floor(Math.random() * this.list.length);
    console.log(`Random Video: ${number}`);
    var video = this.list[number];

    var thumbnail;
    if (video.snippet.thumbnails.maxres) {
      thumbnail = video.snippet.thumbnails.maxres.url;
    } else if (video.snippet.thumbnails.high) {
      thumbnail = video.snippet.thumbnails.high.url;
    } else {
      thumbnail = video.snippet.thumbnails.default.url;
    }

    this.setState({
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumbnail: thumbnail,
      link: `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
    });
  }

  render() {
    return (
      <div className="App">
        <h2>
          Random YouTube &nbsp;
          <a href="https://github.com/skarfie123/random-youtube">
            <img class="github" src={github} alt="GitHub Logo" />
          </a>
        </h2>
        <p>Generate random selections from specified YouTube channels</p>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="url-label">
              YouTube Channel URL
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder={example_url}
            defaultValue={example_url}
            aria-label="url"
            aria-describedby="url-label"
            onChange={this.handleUrlChange}
          />
          <InputGroup.Append>
            <Button
              type="submit"
              variant="primary"
              disabled={this.state.isLoading}
              onClick={!this.state.isLoading ? this.handleSubmit : null}
            >
              {this.state.isLoading ? "Loading…" : "Load"}
            </Button>
          </InputGroup.Append>
        </InputGroup>

        <div className="row">
          <Card className="column video">
            <Card.Img variant="top" src={this.state.thumbnail} />
            <Card.Body>
              <Card.Title>{this.state.title}</Card.Title>
              <Card.Text>{this.state.channelTitle}</Card.Text>
              <Button variant="primary" target="_blank" href={this.state.link}>
                Open
              </Button>
            </Card.Body>
          </Card>
          <div className="column">
            <Button variant="primary" onClick={this.randomise}>
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
