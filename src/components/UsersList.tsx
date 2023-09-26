import { SortBy, type User } from "../types.d";

interface Props {
  showColors: boolean;
  users: User[];
  deleteUsers: (email: string) => void;
  changeSorting: (sort: SortBy) => void;
}

export const UsersList = ({
  showColors,
  users,
  deleteUsers,
  changeSorting,
}: Props) => {
 
  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Photo</th>
          <th
           style={{cursor: "pointer"}}
            onClick={() => {
              changeSorting(SortBy.NAME);
            }}
          >
            Name
          </th>
          <th
          style={{cursor: "pointer"}}
            onClick={() => {
              changeSorting(SortBy.LAST);
            }}
          >
            Last name
          </th>
          <th
            style={{cursor: "pointer"}}
            onClick={() => {
              changeSorting(SortBy.COUNTRY);
            }}
          >
            Country
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      {/* Renderizar todos nuestros usuarios */}
      <tbody>
        {users.map((user, index) => {
          const backgroundColor = index % 2 === 0 ? "#333" : "#555"; //Si el indice es divisible entre 0 se aplica los styles
          const color = showColors ? backgroundColor : "transparent";

          return (
            <tr key={user.email} style={{ backgroundColor: color }}>
              {/* key unico  */}
              <td>
                <img src={user.picture.thumbnail} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => deleteUsers(user.email)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// table, thred, tbody <--- La clave
// tr -> row
// td -> celda
