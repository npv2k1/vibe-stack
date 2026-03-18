import React from "react";

const BlogDetail = async (props) => {
  console.log("props", props);

  const { id } = await props.params;

  return <div>BlogDetail {id}</div>;
};

export default BlogDetail;
