import React from "react";
import NewsPresenter from "./NewsPresenter";

export default class NewsContainer extends React.Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: { title, poster, author, description, url },
        },
      },
    } = props;

    this.state = {
      title,
      poster,
      author,
      description,
      url,
    };
  }

  render() {
    const { title, poster, author, description, url } = this.state;
    return (
      <NewsPresenter
        title={title}
        author={author}
        poster={poster}
        description={description}
        url={url}
      />
    );
  }
}
