import React, { Component } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const DOUGS_CHANNEL_ID = "UCsqjHFMB_JYTaEnf_vmTNqg"

// TODO: store in localstorage and only fetch if day is a new day? prevents crazy # of requests

export default class IndexPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: [],
    }
    this.API_KEY = "AIzaSyBekU0Czc-u8H1uFVtmDuvPqbV6qPyxbWQ"
  }

  filterComments(comments) {
    return comments.filter(a =>
      a.snippet.topLevelComment.snippet.textDisplay.includes("type of")
    )
  }

  async getVideosFromChannelID(id) {
    const req = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${id}&part=snippet,id&order=date&maxResults=50`
    )
    return await req.json()
  }

  async getCommentsForVideoId(id) {
    const req = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?key=${this.API_KEY}&textFormat=plainText&part=snippet&videoId=${id}&maxResults=100`
    )
    return await req.json()
  }

  async componentDidMount() {
    let comments = []
    const channelData = await this.getVideosFromChannelID(DOUGS_CHANNEL_ID)
    const videoReqs = channelData.items.map(async video => {
      const data = await this.getCommentsForVideoId(video.id.videoId)
      comments.push(this.filterComments(data.items))
    })
    Promise.all(videoReqs).then(() => {
      this.setState({ comments: comments.filter(x => x.length > 1).flat() })
    })
  }
  render() {
    return (
      <Layout>
        <SEO title="Home" />
        <ul style={{ maxWidth: `500px`, margin: "0 auto" }}>
          {this.state.comments.map(comment => {
            return (
              <li key={comment.id}>
                {comment.snippet.topLevelComment.snippet.textDisplay}
              </li>
            )
          })}
        </ul>
      </Layout>
    )
  }
}
