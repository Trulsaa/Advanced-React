import { Query, Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import React from 'react';
import gql from 'graphql-tag';

import ErrorMessage from './ErrorMessage';
import SickButton from './styles/SickButton';
import Table from './styles/Table';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

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
              <UserPermisssions key={user.email} user={user} />
            ))}
          </tbody>
        </Table>
      </div>
    )}
  </Query>
);

class UserPermisssions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };

  state = {
    permissions: this.props.user.permissions,
  };
  handlePermissionChange = e => {
    const checkbox = e.target;
    let updatedPermissions = [...this.state.permissions];
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }
    this.setState({ permissions: updatedPermissions });
  };
  render() {
    const { name, email, id } = this.props.user;

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id,
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colSpan='8'>
                  <ErrorMessage error={error} />
                </td>
              </tr>
            )}
            <tr>
              <td>{name}</td>
              <td>{email}</td>
              {possiblePermissions.map(permission => (
                <td key={permission}>
                  <label htmlFor={`${id}-permission-${permission}`}>
                    <input
                      id={`${id}-permission-${permission}`}
                      type='checkbox'
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  type='button'
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat{loading ? 'ing' : 'e'}
                </SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}
export default Permissions;
