import React, { Component } from 'react';
import isEmpty from '../../validation/is-empty';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from 'superagent';
import "./profileHeader.css"
import { updateProfilePic } from '../../actions/profileActions'
const CLOUDINARY_UPLOAD_PRESET = 'clixcvin';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dh7ooikgx/upload';
class ProfileHeader extends Component {
  change_profile_picture = (url) => {
    const { auth } = this.props
    const { user } = auth
    let user_obj = {
      id: user.id,
      url: url
    }
    this.props.updateProfilePic(user_obj)
    setTimeout(function(){
      window.location.reload()

    },2500)
  }
  fileSelectedHandler = (event) => {
    this.setState({
      uploadedFile: event.target.files[0]
    })
    let bt_this = this
    setTimeout(function () {
      bt_this.handleImageUpload(bt_this.state.uploadedFile);
    }, 1000)

  }
  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.change_profile_picture(response.body.secure_url)
      }
    });
  }

  render() {
    const { profile } = this.props;
    const { auth } = this.props
    const { user } = auth
    return (

      <div class="container">
      <div className="row">
        <div className="col-12">
        <div class="fb-profile">
          <img align="left" className="fb-image-lg" src="https://coverfiles.alphacoders.com/366/36684.png" alt="Profile image example" />
          {auth.isAuthenticated ? profile.user._id === user.id ? (
            <div className="fb-image-profile thumbnail">
              <label className="lbli" htmlFor="upl">
                <img align="left" className="image" src={profile.user.avatar} alt="Profile image example" />
                <div className="overlay">
                  <p className="icon" title="User Profile">
                    <i className="fa fa-user"></i>
                  </p>
                </div>
              </label>
              <input id="upl" type="file" onChange={this.fileSelectedHandler} style={{ "display": "none" }} />
            </div>
          ) : (
              <div className="fb-image-profile thumbnail">
                <img align="left" className="image" src={profile.user.avatar} alt="Profile image example" />
              </div>
            ) : (
              <div className="fb-image-profile thumbnail">
                <img align="left" className="image" src={profile.user.avatar} alt="Profile image example" />

              </div>

            )}
        </div>
        </div>
        <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
        <div className="fb-profile-text">
            <h1>{profile.user.name}</h1>
            <p className="lead">
              {profile.status}{' '}
              {isEmpty(profile.company) ? null : (
                <span>at {profile.company}</span>
              )}
            </p>
            {isEmpty(profile.location) ? null : <p>{profile.location}</p>}
            <p>
              {isEmpty(profile.website) ? null : (
                <a rel="noopener noreferrer"
                  className=" p-2"
                  href={profile.website}
                  target="_blank"
                >
                  <i className="fas fa-globe fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.twitter) ? null : (
                <a rel="noopener noreferrer"
                  className=" p-2"
                  href={profile.social.twitter}
                  target="_blank"
                >
                  <i className="fab fa-twitter fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.facebook) ? null : (
                <a rel="noopener noreferrer"
                  className=" p-2"
                  href={profile.social.facebook}
                  target="_blank"
                >
                  <i className="fab fa-facebook fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.linkedin) ? null : (
                <a rel="noopener noreferrer"
                  className=" p-2"
                  href={profile.social.linkedin}
                  target="_blank"
                >
                  <i className="fab fa-linkedin fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.youtube) ? null : (
                <a rel="noopener noreferrer"
                  className=" p-2"
                  href={profile.social.youtube}
                  target="_blank"
                >
                  <i className="fab fa-youtube fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.instagram) ? null : (
                <a rel="noopener noreferrer"
                  className=" p-2"
                  href={profile.social.instagram}
                  target="_blank"
                >
                  <i className="fab fa-instagram fa-2x" />
                </a>
              )}
            </p>
          </div>
        </div></div></div>
        
          


      </div>
    );
  }
}
ProfileHeader.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { updateProfilePic })(
  ProfileHeader
);

