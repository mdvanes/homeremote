import React from 'react';
import logger from '../logger';
import {Card, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import './GetMusic.scss';

class GetMusic extends React.Component {
    constructor(props) {
        super(props);
        const year = (new Date()).getFullYear();
        this.state = {url: '', title: '', artist: '', album: `Songs from ${year}`};
        this.handleChange = this.handleChange.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.getMusic = this.getMusic.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    getInfo(event) {
        logger.log('Get Info: ' + this.state.url);
        event.preventDefault();

        fetch('/getMusic/info', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: this.state.url
            })
        })
        .then(data => data.json())
        .then(data => {
            if(data.status === 'ok') {
                logger.log('info ok');
                this.setState({title: data.title, artist: data.artist});
            } else {
                throw new Error('getMusic info failed');
            }
        })
        .catch(error => logger.error('error on getMusic/info: ' + error));
    }

    getMusic(event) {
        logger.log('Get Music: ' + this.state.url);
        event.preventDefault();

        fetch('/getMusic/music', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: this.state.url,
                title: this.state.title,
                artist: this.state.artist,
                album: this.state.album
            })
        })
        .then(data => data.json())
        .then(data => {
            if(data.status === 'ok') {
                logger.log(`Get music completed to: ${data.fileName}`);
            } else {
                throw new Error('getMusic music failed');
            }
        })
        .catch(error => logger.error('error on getMusic/music: ' + error));
    }

    render() {
        return (
            <Card>
                <CardText>
                    <form className="form-horizontal well well-sm">
                        <fieldset>
                            <TextField
                                floatingLabelText="URL"
                                name="url"
                                fullWidth={true}
                                value={this.state.url}
                                onChange={this.handleChange} />
                            <FlatButton label="Get Info" primary={true} fullWidth={true} onTouchTap={this.getInfo} />
                            <TextField
                                floatingLabelText="Y'all suckas put tha title up in heya!"
                                name="title"
                                fullWidth={true}
                                value={this.state.title}
                                onChange={this.handleChange} />
                            <TextField
                                floatingLabelText="Artist"
                                name="artist"
                                fullWidth={true}
                                value={this.state.artist}
                                onChange={this.handleChange} />
                            <TextField
                                floatingLabelText="Album"
                                name="album"
                                fullWidth={true}
                                value={this.state.album}
                                onChange={this.handleChange} />
                            <FlatButton label="Get Music" primary={true} fullWidth={true} onTouchTap={this.getMusic} />
                        </fieldset>
                    </form>
                </CardText>
            </Card>
        );
    }
}
export default GetMusic;