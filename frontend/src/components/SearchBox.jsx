import React, { useState } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword?.trim()) {
        setKeyword("")
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };
  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <FormControl
        type="text"
        name="q"
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"
        value={keyword}
        onChange={(e) => setKeyword(e?.target?.value)}
      />
      <Button type="submit" variant="outline-light" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
