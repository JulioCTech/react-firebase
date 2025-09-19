import { db, auth } from './firebaseConnection';
import { doc, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './App.css';

function App() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [posts, setPosts] = useState([]);
    const [idPost, setIdPost] = useState('');

    async function novoUsuario() {
        try {
            await createUserWithEmailAndPassword(auth, email, senha);
            console.log('Usuário criado com sucesso');
            setEmail('');
            setSenha('');
        } catch (error) {
            console.log('Erro ao criar usuário:', error);
        }
    }

    async function logarUsuario() {
        try {
            await signInWithEmailAndPassword(auth, email, senha);
            alert('Usuário logado com sucesso!');
            setEmail('');
            setSenha('');
        } catch (error) {
            console.log('Erro ao fazer login:', error);
        }
    }

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
            let listaPost = [];
            snapshot.forEach((doc) => {
                listaPost.push({
                    id: doc.id,
                    titulo: doc.data().titulo,
                    autor: doc.data().autor,
                });
            });
            setPosts(listaPost);
        });

        return () => unsub();
    }, []);

    async function handleAdd() {
        try {
            await addDoc(collection(db, 'posts'), { titulo, autor });
            setAutor('');
            setTitulo('');
        } catch (error) {
            console.log('Erro ao adicionar:', error);
        }
    }

    async function buscarPost() {
        try {
            const postRef = collection(db, 'posts');
            const snapshot = await getDocs(postRef);

            let lista = [];
            snapshot.forEach((doc) => {
                lista.push({ id: doc.id, titulo: doc.data().titulo, autor: doc.data().autor });
            });

            setPosts(lista);
        } catch (error) {
            console.log('Erro ao buscar:', error);
        }
    }

    async function editarPost() {
        try {
            const docRef = doc(db, 'posts', idPost);
            await updateDoc(docRef, { titulo, autor });
            setIdPost('');
            setTitulo('');
            setAutor('');
        } catch (error) {
            console.log('Erro ao atualizar:', error);
        }
    }

    async function excluirPost(id) {
        try {
            const docRef = doc(db, 'posts', id);
            await deleteDoc(docRef);
            alert('Post deletado com sucesso!');
        } catch (error) {
            console.log('Erro ao excluir:', error);
        }
    }

    return (
        <div className="app">
            <h1>📌 ReactJS + Firebase</h1>

            {/* Login */}
            <div className="card">
                <h2>👤 Autenticação</h2>
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Senha</label>
                <input
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <div className="buttons">
                    <button onClick={novoUsuario}>Cadastrar</button>
                    <button className="secondary" onClick={logarUsuario}>
                        Fazer Login
                    </button>
                </div>
            </div>

            {/* Posts */}
            <div className="card">
                <h2>📝 Gerenciar Posts</h2>
                <label>ID do Post</label>
                <input
                    type="text"
                    placeholder="Digite o ID do post"
                    value={idPost}
                    onChange={(e) => setIdPost(e.target.value)}
                />

                <label>Título</label>
                <textarea
                    placeholder="Digite o título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <label>Autor</label>
                <input
                    type="text"
                    placeholder="Autor do post"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                />

                <div className="buttons">
                    <button onClick={handleAdd}>Cadastrar</button>
                    <button className="secondary" onClick={buscarPost}>
                        Buscar
                    </button>
                    <button className="update" onClick={editarPost}>
                        Atualizar Post
                    </button>
                </div>
            </div>

            {/* Lista de posts */}
            <ul className="post-list">
                {posts.map((post) => (
                    <li key={post.id}>
                        <p><strong>ID:</strong> {post.id}</p>
                        <p><strong>Título:</strong> {post.titulo}</p>
                        <p><strong>Autor:</strong> {post.autor}</p>
                        <button className="delete" onClick={() => excluirPost(post.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
