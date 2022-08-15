import React, { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Title, Form, Repos, Error } from "./styles";
import { Logo } from "../../components/Logo";
import { api } from "../../services/api";
import { FiChevronRight } from "react-icons/fi";

interface GithubRepository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}
const Dashboard: React.FC = () => {

    const [repos, setRepos] = React.useState<GithubRepository[]>(() => {
        const storageRepos = localStorage.getItem('@gitrepos:repositories');

        if (storageRepos) {
            return JSON.parse(storageRepos);
        }
        return [];
    });
    const [inputError, setInputError] = useState('');
    const [newRepo, setNewRepo] = useState('');
    const formEl = useRef<HTMLFormElement | null>(null);


    useEffect(() => {
        localStorage.setItem('@gitrepos:repositories', JSON.stringify(repos));

    }, [repos]);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
        setNewRepo(event.target.value);
    }

    async function handleAddRepo(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (!newRepo) {
            setInputError('Informe o username/repositório');
            return;
        }

        try {
            const response = await api.get<GithubRepository>(`repos/${newRepo}`);
            const repository = response.data;
            setRepos([...repos, repository]);
            formEl.current
            setNewRepo('');
            // setInputError('');

        } catch {
            setInputError('Repositorio nao encontrado no Github');
        }
    }
    return (
        <>
            <Logo />
            <Title>Catálogo de repositórios do Github</Title>

            <Form
                ref={formEl}  
                hasError={Boolean(inputError)} 
                onSubmit={handleAddRepo}
                
            >
                <input

                    placeholder="username/repository_name"
                    onChange={handleInputChange}
                />
                <button type="submit">Buscar</button>
            </Form>
            {inputError && <Error>{inputError}</Error>}
            <Repos>

                {repos.map((repository) => {
                    return (
                        <Link to={`/repositories/${repository.full_name}`} key={repository.full_name}>

                            <img src={repository.owner.avatar_url} alt={repository.description} />
                            <div>
                                <strong>{repository.description}</strong>
                            </div>
                            <FiChevronRight size={20} />
                        </Link>
                    );
                })}

            </Repos>

        </>
    )
}

export default Dashboard;