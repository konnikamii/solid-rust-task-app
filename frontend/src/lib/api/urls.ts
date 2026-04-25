const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

export const urls = {
  contact: {
    createContactRequest: `${baseUrl}/contact/`,
  },
  auth: {
    login: `${baseUrl}/login`,
    // register: `${baseUrl}/register`,
    logout: `${baseUrl}/logout`,
  },
  users: {
    getMe: `${baseUrl}/me`,
    getUserById: (id: string) => `${baseUrl}/users/${id}`,
    getPaginatedUsers: `${baseUrl}/users/list`,
    createUser: `${baseUrl}/users`,
    updateUser: (id: string) => `${baseUrl}/users/${id}`,
  },
  tasks: {
    getTaskById: (id: string) => `${baseUrl}/tasks/${id}`,
    getPaginatedTasks: `${baseUrl}/tasks/list`,
    createTask: `${baseUrl}/tasks/`,
    updateTask: (id: string) => `${baseUrl}/tasks/${id}`,
    deleteTask: (id: string) => `${baseUrl}/tasks/${id}`,
  },
}
