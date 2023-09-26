import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/users";
import { User } from "../types";

export const useQueryUser = () => {
  //data es users que lo que devolvemos en el fetch
  //useQuery nos devuelve mucha información
  //Espera dos argumentos la key y la funcion que le indica como tiene que recuperar la informacion
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage, } =
    useInfiniteQuery<{ nextPage?: number; users: User[] }>(
      ["users"],
      fetchUsers,
      //Para extrar el fetchNext y hasNext hay que indicarle el objeto que pasamos en fetch de nextPage
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, //5 minutos
      }
    );

  return {
    isLoading,
    isError,
    users: data?.pages.flatMap((page) => page.users) ?? [], //Aqui hay array con un subarray, por lo que lo simplifica en 1
    refetch,
    fetchNextPage,
    hasNextPage,
    
  };
};
