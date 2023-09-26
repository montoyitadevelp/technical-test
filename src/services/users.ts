export const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
  return await fetch(
    `https://randomuser.me/api?results=10&seed=simonmontoya&page=${pageParam}`
  )
    .then(async (res) => {
      if (!res.ok) throw new Error("Error in the fetch"); //Buscar si hay un error verdaderamente
      return await res.json();
    })
    .then((res) => {
      const currentPage = Number(res.info.page);
      const nextPage = currentPage > 3 ? undefined : currentPage + 1; //Maximo 10, sino incrementa de 1 en 1

      return {
        users: res.results, //La API nos informa con un objeto
        nextPage, //Cual es la siguiente pagina
      };
    });
};
