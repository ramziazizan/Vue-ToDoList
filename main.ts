// main.ts (Kode TypeScript untuk Vue 3 Composition API)

// Definisikan interface untuk objek Todo
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

const { createApp, ref, computed, watch } = Vue; // Mengambil fungsi-fungsi dari global Vue object

createApp({
    setup() {
        // State reaktif
        const newTodoText = ref<string>(''); // Tipe data string
        const todos = ref<Todo[]>([]); // Array dengan objek Todo
        const filter = ref<'all' | 'active' | 'completed'>('all'); // Tipe data spesifik

        // --- LOAD DAN SAVE KE LOCAL STORAGE ---
        const loadTodos = () => {
            const storedTodos = localStorage.getItem('todos');
            if (storedTodos) {
                todos.value = JSON.parse(storedTodos);
            }
        };

        const saveTodos = () => {
            localStorage.setItem('todos', JSON.stringify(todos.value));
        };

        // Muat todos saat aplikasi pertama kali dibuat
        loadTodos();

        // Watcher: setiap kali todos.value berubah, simpan ke Local Storage
        watch(todos, saveTodos, { deep: true });

        // --- FUNGSI UNTUK MENAMBAH TUGAS ---
        const addTodo = () => {
            if (newTodoText.value.trim() === '') {
                return; // Jangan tambahkan jika teks kosong
            }
            const newTodo: Todo = { // Menetapkan tipe Todo
                id: Date.now(), // ID unik
                text: newTodoText.value.trim(),
                completed: false
            };
            todos.value.push(newTodo);
            newTodoText.value = ''; // Kosongkan input
        };

        // --- FUNGSI UNTUK MENGHAPUS TUGAS ---
        const removeTodo = (id: number) => { // Parameter id bertipe number
            todos.value = todos.value.filter(todo => todo.id !== id);
        };

        // --- COMPUTED PROPERTY UNTUK FILTER TUGAS ---
        const filteredTodos = computed(() => {
            switch (filter.value) {
                case 'active':
                    return todos.value.filter(todo => !todo.completed);
                case 'completed':
                    return todos.value.filter(todo => todo.completed);
                case 'all':
                default:
                    return todos.value;
            }
        });

        // --- COMPUTED PROPERTY UNTUK MENGHITUNG TUGAS TERSISA ---
        const remainingTodosCount = computed(() => {
            return todos.value.filter(todo => !todo.completed).length;
        });

        // Mengembalikan data dan fungsi agar bisa digunakan di template HTML
        return {
            newTodoText,
            todos,
            filter,
            addTodo,
            removeTodo,
            filteredTodos,
            remainingTodosCount
        };
    }
}).mount('#app');
