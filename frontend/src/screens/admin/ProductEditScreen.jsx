import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { toast } from "react-toastify";

const ProductEditScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [countInStock, setCountInStock] = useState(0);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUploadImage }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product?.name);
      setPrice(product?.price);
      setImage(product?.image);
      setBrand(product?.brand);
      setCategory(product?.category);
      setDescription(product?.description);
      setCountInStock(product?.countInStock);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      description,
      countInStock,
    };
    const result = await updateProduct(updatedProduct);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Product updated.");
      navigate("/admin/productlist");
    }
  };

  const uploadFileHandler = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("image", e?.target?.files[0]);
    try {
      const res = await uploadProductImage(formdata).unwrap();
      toast.success(res?.message);
      setImage(res?.image);
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant={"danget"}>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <FormGroup controlId="name" className="my-2">
              <FormLabel>Name</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e?.target?.value)}
              />
            </FormGroup>
            <FormGroup controlId="price" className="my-2">
              <FormLabel>Price</FormLabel>
              <FormControl
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e?.target?.value)}
              />
            </FormGroup>

            <FormGroup controlId="image">
              <FormLabel>Image</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e?.target?.value)}
              />
              <FormControl
                type="file"
                label="Choose file"
                onChange={uploadFileHandler}
              />
            </FormGroup>

            <FormGroup controlId="brand" className="my-2">
              <FormLabel>Brand</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e?.target?.value)}
              />
            </FormGroup>
            <FormGroup controlId="countInStock" className="my-2">
              <FormLabel>Count In Stock</FormLabel>
              <FormControl
                type="number"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e?.target?.value)}
              />
            </FormGroup>
            <FormGroup controlId="category" className="my-2">
              <FormLabel>Category</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e?.target?.value)}
              />
            </FormGroup>
            <FormGroup controlId="description" className="my-2">
              <FormLabel>Description</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e?.target?.value)}
              />
            </FormGroup>

            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
