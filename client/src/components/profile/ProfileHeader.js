import React, { Component } from 'react';
import isEmpty from '../../validation/is-empty';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from 'superagent';
import "./profileHeader.css"
import uniqid from 'uniqid'
import { updateProfilePic, follow_developer, unfollow_developer, block_dev, getProfileByHandle } from '../../actions/profileActions'
const CLOUDINARY_UPLOAD_PRESET = 'clixcvin';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dh7ooikgx/upload';
let Myfollow = []
let Myfollowers = []
class ProfileHeader extends Component {
  
  followDev = (user, dev) => {
    this.props.follow_developer(user.id, dev._id)
    this.props.getProfileByHandle(this.props.profile.user._id)
  }
  unfollow = (user, dev) => {
    this.props.unfollow_developer(user.id, dev._id)
    this.props.getProfileByHandle(this.props.profile.user._id)
  }
  blockDev = (user, dev) => {
    this.props.block_dev(user.id, dev._id)
    this.props.getProfileByHandle(this.props.profile.user._id)
  }
  change_profile_picture = (url) => {
    const { auth } = this.props
    const { user } = auth
    let user_obj = {
      id: user.id,
      url: url
    }
    this.props.updateProfilePic(user_obj)
    setTimeout(function () {
      window.location.reload()

    }, 2500)
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
  getSkills = (profile) => {
    let skills = profile.skills.map(skill => (
      <p style={{ "color": "red" }} key={uniqid()}>{skill}</p>
    ))
    return skills
  }
  getUserInfo = (user) => {
    let follow = user.follow
    let followers = user.followers

    for (let i = 0; i < follow.length; i++) {
      Myfollow.push(follow[i].id)
    }
    for (let i = 0; i < followers.length; i++) {
      Myfollowers.push(followers[i].id)
    }
  }

   render() {
    const { profile } = this.props.profile;
    const { auth } = this.props
    const { user } = auth
    this.getUserInfo(profile.user)
    return (
      <div className="w3-third">

        <div className="w3-white w3-text-grey w3-card-4">
          <div className="w3-display-container">
            <img src={profile.user.avatar} style={{ "width": "100%" }} alt="Avatar" />
            <div className="w3-display-bottomleft w3-container w3-text-white">
              <h2>{profile.user.name}</h2>
            </div>
          </div>
          <div className="col-12 mb-2 mt-2">

            {
              !auth.isAuthenticated ? (
              <p className="text-center" style={{ "color": "blue" }}>Login to follow <strong>{profile.user.name}</strong></p>

            )
              : profile.user._id == user.id ? (
                <div>
                  <label className="btn btn-outline-primary ml-2" htmlFor="inp">
                    <i className="fas fa-camera"></i>
                  </label>
                  <input id="inp" type="file" onChange={this.fileSelectedHandler} style={{ "display": "none" }} />

                </div>
              )
                : Myfollow.includes(profile.user._id) ? (
                  <button className="btn btn-danger ml-2"
                    onClick={() => this.unfollow(user, profile.user)}
                  >Unfollow</button>
                ) : Myfollowers.includes(profile.user._id) ? (
                  <div className="col-12">
                    <button className="btn btn-primary ml-2"
                      onClick={() => this.followDev(user, profile.user)}
                    >Follow</button>
                    <button className="btn btn-danger ml-2"
                      onClick={() => this.blockDev(user, profile.user)}
                    >Remove</button>
                  </div>
                ) : (
                      <button className="btn btn-primary ml-2"
                        onClick={() => this.followDev(user, profile.user)}
                      >Follow</button>
                    )}
          </div>
          <div className="w3-container mt-3">
            <p><i className="fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-grey"></i>{profile.status}</p>
            <p><i className="fa fa-home fa-fw w3-margin-right w3-large w3-text-grey"></i>{isEmpty(profile.location) ? null : profile.location}</p>
            <p><i className="fa fa-envelope fa-fw w3-margin-right w3-large w3-text-grey"></i>{profile.user.email}</p>
            <p><i className="fa fa-phone fa-fw w3-margin-right w3-large w3-text-grey"></i>{profile.phone}</p>
            <p ><i className="fas fa-user-friends fa-fw w3-margin-right w3-large w3-text-grey"></i>Followers: <span style={{ "color": profile.user.followers.length > 1 ? "blue" : "red" }}>{profile.user.followers.length}</span></p>
            <p ><i className="fas fa-user-friends fa-fw w3-margin-right w3-large w3-text-grey"></i>Follow: <span style={{ "color": profile.user.follow.length > 1 ? "blue" : "red" }}>{profile.user.follow.length}</span></p>

            <hr></hr>

            <p className="w3-large"><b><i className="fa fa-asterisk fa-fw w3-margin-right w3-text-grey"></i>Skills</b></p>

            {this.getSkills(profile)}

            <hr></hr>
            <p className="w3-large"><b><i className="fa fa-asterisk fa-fw w3-margin-right w3-text-grey"></i>Social Networks</b></p>

            <p>
              {isEmpty(profile.website) ? null : (
                <a
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
                  onClick={() => this.openInNewTab(profile.social.twitter)}
                  href={profile.social.twitter}
                  target="_blank"
                >
                  <i className="fab fa-twitter fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.facebook) ? null : (
                <a rel="noopener noreferrer"
                  className=" p-2"
                  onClick={() => this.openInNewTab(profile.social.facebook)}
                  href={profile.social.facebook}
                  target="_blank"
                >
                  <i className="fab fa-facebook fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.linkedin) ? null : (
                <a rel="noopener noreferrer"
                  className=" p-2"
                  onClick={() => this.openInNewTab(profile.social.linkedin)}
                  href={profile.social.linkedin}
                  target="_blank"
                >
                  <i className="fab fa-linkedin fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.youtube) ? null : (
                <a rel="noopener noreferrer"
                  className=" p-2"
                  onClick={() => this.openInNewTab(profile.social.youtube)}
                  href={profile.social.youtube}
                  target="_blank"
                >
                  <i className="fab fa-youtube fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.instagram) ? null : (
                <a rel="noopener noreferrer"
                  className=" p-2"
                  onClick={() => this.openInNewTab(profile.social.instagram)}
                  href={profile.social.instagram}
                  target="_blank"
                >
                  <i className="fab fa-instagram fa-2x" />
                </a>
              )}
            </p>
          </div>
        </div><br></br>

      </div>

    );
  }
}
ProfileHeader.propTypes = {
  auth: PropTypes.object.isRequired,
  follow_developer: PropTypes.func.isRequired,
  unfollow_developer: PropTypes.func.isRequired,
  block_dev: PropTypes.func.isRequired,
  getProfileByHandle: PropTypes.func.isRequired,
  profile:PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile:state.profile
});

export default connect(mapStateToProps, { updateProfilePic, follow_developer, unfollow_developer, block_dev, getProfileByHandle })(
  ProfileHeader
);

