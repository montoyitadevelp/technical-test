import { useQueryUser } from "../hooks/useUsers";

export const Results = () => {
  const { users } = useQueryUser();
  return <div>Results: {users.length}</div>;
};
