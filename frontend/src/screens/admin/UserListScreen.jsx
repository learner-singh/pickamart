import React from "react";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Button, Table } from "react-bootstrap";
import { FaCheck, FaEye, FaPen, FaTimes, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDeleteUser }] =
    useDeleteUserMutation();

  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await deleteUser(userId);
        console.log("res", res);
        if (res?.error) {
          toast.error(res?.error?.data?.message);
        } else {
          refetch();
          toast.success("User deleted.");
        }
      } catch (err) {
        toast.error(err?.data?.message || err?.message || err?.error);
      }
    }
  };

  return (
    <>
      <h1>Users</h1>
      {loadingDeleteUser && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant={"danger"}>{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user?._id}>
                <td>{user?._id}</td>
                <td>{user?.name}</td>
                <td>
                  <a href={`mailto:${user?.email}`}>{user?.email}</a>
                </td>
                <td>
                  {user?.isAdmin ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>

                <td>
                  <Link to={`/admin/user/${user?._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-2">
                      <FaPen />
                    </Button>
                  </Link>
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() => deleteHandler(user?._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
