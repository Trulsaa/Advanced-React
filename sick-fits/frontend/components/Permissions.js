import { Query } from "react-apollo";
import React from "react";
import gql from "graphql-tag";

import ErrorMessage from "./ErrorMessage";
import SickButton from "./styles/SickButton";
import Table from "./styles/Table";

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <ErrorMessage error={error} />
        <h2>MAnage Permissions</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {possiblePermissions.map(permission => (
                <th key={permission}>{permission}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {data.users.map(user => (
              <User key={user.email} user={user} />
            ))}
          </tbody>
        </Table>
      </div>
    )}
  </Query>
);

class User extends React.Component {
  render() {
    const { name, email, id } = this.props.user;

    return (
      <tr>
        <td>{name}</td>
        <td>{email}</td>
        {possiblePermissions.map(permission => (
          <td key={permission}>
            <label htmlFor={`${id}-permission-${permission}`}>
              <input type="checkbox" />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}
export default Permissions;
