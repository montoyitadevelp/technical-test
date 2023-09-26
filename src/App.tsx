import { useMemo, useState } from "react";
import { SortBy, type User } from "./types.d";
import { UsersList } from "./components/UsersList";
import { useQueryUser } from "./hooks/useUsers";
import { Results } from "./components/Results";
import "./App.css";

function App() {
  const { isLoading, isError, users, refetch, fetchNextPage, hasNextPage } =
    useQueryUser();
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const [deleteUsers, setDeleteUsers] = useState<User[]>();

  const toggleColors = () => {
    setShowColors(!showColors); //Inviertiendo el estado que tenemos
  };

  const toggleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue); //Callback que recupera el valor anterior y actualizarlo
  };

  const handleReset = async () => {
    await refetch();
  };

  //El que tenga el mismo index se eliminan
  const handleDelete = (email: string) => {
    const newDeleteUsers = users.filter((user) => user.email !== email)
    setDeleteUsers(newDeleteUsers)
    console.log(deleteUsers)
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  /************************ Filtramos primero ************************/
  //Solo quiero que tengamos en este nuevo array todos los usuarios que incluyan la palabra del filtro que me ha puesto el usuario
  const inputUsers = useMemo(() => {
    console.log("calculate inputUsers");
    return filterCountry != null && filterCountry.length > 0 //Puede ser string y mayor que 0, por si no se coloca nada
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users; //Sino devolvemos todos los usuarios
  }, [users, filterCountry]); //Solo lo tengo que ejecutar cuando halla cambiado el users o el filter

  /************************ Ordenamos despues ************************/
  //Hacer calculos con el estado, solo tener 1
  //Si tenemos que ordenar por pais hacemos el sort, sino devolvemos los users
  const sortedUsers = useMemo(() => {
    console.log("calculates sortedUsers");

    if (sorting === SortBy.NONE) return inputUsers;

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
      [SortBy.COUNTRY]: (user) => user.location.country,
    };

    return inputUsers.sort((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [inputUsers, sorting]);

  return (
    <>
      <div>
        <h1>Tecnhical test</h1>
        <header>
          <Results />
          <button onClick={toggleColors}>Coloring cells</button>
          <button onClick={toggleSortByCountry}>
            {sorting === SortBy.COUNTRY
              ? "Dont sort by country"
              : "Sort by country"}
          </button>
          <button onClick={handleReset}>Reset users</button>
          <input
            placeholder="Filter by country"
            onChange={(e) => setFilterCountry(e.target.value)} //Cada vez que escriba en el input,
            //vamos a cambiar el estado de set y el value el string que esta escribiendo el usuario
          />
        </header>
        <main>
          {/*Y tenemos usuario */}
          {users.length > 0 && (
            <UsersList
              deleteUsers={handleDelete}
              showColors={showColors}
              users={sortedUsers}
              changeSorting={handleChangeSort}
            />
          )}
          {isLoading && <p>Loading...</p>}
          {/* Si esta cargando mostramos el cargando */}
          {isError && <p>An ocurred error</p>}
          {/* si no tienes un error pero no hay usuarios */}
          {!isLoading && !isError && users.length === 0 && (
            <p>No users found</p>
          )}
          {/* Si no tenemos usuarios */}

          {!isLoading && !isError && hasNextPage === true && (
            <button onClick={() => void fetchNextPage()}>
              Show more results
            </button>
          )}

          {!isLoading && !isError && hasNextPage === false && (
            <p>Its doesnt have more results</p>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
