import React, { PropsWithChildren } from "react";

const BlogLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-screen h-screen bg-amber-200">
      <h1>Blog layout</h1>
      {children}
    </div>
  );
};

export default BlogLayout;
