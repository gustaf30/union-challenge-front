import { useRouter } from 'next/router'; // Importando o roteador
import { getTasks, deleteTask, searchTasksByTitle } from './api';

export const fetchTasks = async (filter: any, page: any, limit: any, setTasks: any, router: any) => {
    
    // Atualizando a URL com os parâmetros de paginação
    router.push(`?page=${page}&limit=${limit}`);
    
    try {
      // Se o filtro estiver vazio, busca as tarefas sem o filtro (e sem a condição overdue)
      if (!filter) {
        const data = await getTasks('', page, limit,  undefined); // Corrigido para passar a paginação corretamente
        setTasks(data); // Atualiza as tarefas no estado
        return;
      }

      // Caso haja um filtro, realiza a busca com o filtro aplicado
      const data = await getTasks(filter, page, limit);
      setTasks(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
};


export const fetchTasksByTitle = async (search: any) => {
  try {
    if (search) {
      const data = await searchTasksByTitle(search);
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching tasks by title:', error);
    return [];
  }
};

export const fetchTasksOverdue = async (overdue: boolean, page: number, limit: number, setTasks: any) => {
    // Verificando se a variável overdue está disponível e é verdadeira
    if (!overdue) return; // Certifique-se de que 'overdue' está definida no contexto

    try {
        // Chamando a função getTasks com os parâmetros corretos
        const data = await getTasks('', page, limit, { overdue: true }); // Corrigido para passar os parâmetros de forma correta
        setTasks(data); // Atualiza as tarefas no estado
    } catch (error) {
        console.error('Erro ao buscar tarefas vencidas:', error);
    }
};

export const countTasks = async () => {
  try {
    const data = await getTasks(); // Considerando que sua API pode retornar um total de registros
    return data.length;
  } catch (error) {
    console.error('Error counting tasks:', error);
    return 0;
  }
};
