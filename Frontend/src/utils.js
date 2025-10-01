


export const clearUserSession = () => {

  localStorage.removeItem('user');
  console.log('User session (user and token) cleared from local storage.');

};

export const storeData = [
  { id: 1, name: 'The Corner Bookstore', rating: 4.5, description: 'Cozy place with a great selection of classics.' },
  { id: 2, name: 'Quick Stop Groceries', rating: 3.8, description: 'Fast service and competitive prices.' },
  { id: 3, name: 'Tech Repair Hub', rating: 4.9, description: 'Expert technical support for all your gadgets.' },
  { id: 4, name: 'Global Cuisine Bistro', rating: 4.2, description: 'A fusion of flavors from around the world.' },
];