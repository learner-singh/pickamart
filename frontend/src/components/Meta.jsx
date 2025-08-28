import React from "react";
import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
    console.log("Meta component rendered with title:", title);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to PickaMart",
  description: "We sell the best product for cheap",
  keywords: "electronics, buy electronics, cheap electronics",
};

export default Meta;
