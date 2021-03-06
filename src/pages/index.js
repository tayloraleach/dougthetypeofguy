import React, { Component } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "../components/image"

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

  async load() {
    let comments = []
    const channelData = await this.getVideosFromChannelID(DOUGS_CHANNEL_ID)
    const videoReqs = channelData.items.map(async video => {
      const data = await this.getCommentsForVideoId(video.id.videoId)
      comments.push(this.filterComments(data.items))
    })
    Promise.all(videoReqs).then(() => {
      const filtered = comments.filter(x => x.length > 1).flat()
      const arr = []
      filtered.forEach(x => {
        arr.push(x.snippet.topLevelComment.snippet.textDisplay)
      })
      this.setState({ comments: arr })
      localStorage.setItem("comments", JSON.stringify(arr))
      localStorage.setItem("date", new Date().getDay())
    })
  }

  async componentDidMount() {
    const comments = localStorage.getItem("comments")
    const theDate = new Date(localStorage.getItem("date"))
    if ((theDate && theDate.getDay() === new Date().getDay()) || !comments) {
      await this.load()
    } else {
      this.setState({ comments: JSON.parse(comments) })
    }
  }

  render() {
    return (
      <>
        <div
          style={{
            opacity: 0.35,
            position: "fixed",
            left: 0,
            bottom: 0,
            top: 80,
            width: "100%",
            height: "auto",
          }}
        >
          <Image />
        </div>
        <Layout>
          <SEO title="Home" />
          <ul style={{ maxWidth: `960px`, margin: "0 auto", padding: 15 }}>
            {this.state.comments.map(comment => (
              <li key={comment}>{comment}</li>
            ))}
          </ul>
        </Layout>
      </>
    )
  }
}
