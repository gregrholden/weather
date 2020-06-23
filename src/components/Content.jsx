import React from 'react';

const Content = (props) => {
  return(
    <div className={props.className}>{props.content}</div>
  );
}

Content.defaultProps = {
  className: null,
  content: null
}

export default Content;