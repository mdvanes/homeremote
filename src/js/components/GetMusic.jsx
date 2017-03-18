import React from 'react';
import logger from '../logger';

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
            <div className="row">
                <div className="col-lg-6">
                    <form className="form-horizontal">
                        <fieldset>
                            <div className="form-group">
                                <label htmlFor="getMusicUrl" className="col-lg-2 control-label">url</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" id="getMusicUrl" name="url" placeholder="url" value={this.state.url} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <button onClick={this.getInfo} className="btn btn-default">Get Info</button>
                            <div className="form-group">
                                <label htmlFor="getMusicTitle" className="col-lg-2 control-label">Title</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" id="getMusicTitle" name="title" placeholder="Title" value={this.state.title} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="getMusicArtist" className="col-lg-2 control-label">Artist</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" id="getMusicArtist" name="artist" placeholder="Artist" value={this.state.artist} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="getMusicAlbum" className="col-lg-2 control-label">Album</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" id="getMusicAlbum" name="album" placeholder="Album" value={this.state.album} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <button onClick={this.getMusic} className="btn btn-default">Get Music</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}
export default GetMusic;