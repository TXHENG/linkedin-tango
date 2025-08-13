import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

const store = new Store<{ count: number }>({ count: 0 });

const useCounterStore = () => {
  const { count } = useStore(store);

  const increment = () => {
    store.setState(() => ({ count: count + 1 }));
  };

  const decrement = () => {
    store.setState(() => ({ count: count - 1 }));
  };

  return {
    count,
    increment,
    decrement,
  };
};

export default useCounterStore;
