import React, { useEffect, useRef, useState } from "react";
import { Header, Issues, RepoInfo } from "./styles";
import { useRouteMatch } from "react-router-dom";
import { api } from "../../services/api";
import { Logo } from "../../components/Logo";
import { FiChevronLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";


interface RepositoryParams {
    repository: string;
}


interface GithubRepository {
    full_name: string;
    description: string;
    forks_count: number;
    open_issues_count: number;
    stargazers_count: number;
    owner: {
        login: string;
        avatar_url: string;
    }
}

interface GithubIssue {
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string;
    };
}


const Repo: React.FC = () => {

    const { params } = useRouteMatch<RepositoryParams>();
    const [repository, setRepository] = useState<GithubRepository | null>();
    const [issues, setIssues] = React.useState<GithubIssue[]>([]);


    useEffect(() => {

        api
            .get(`repos/${params.repository}`)
            .then(response => setRepository(response.data));

        api
            .get(`repos/${params.repository}/issues`)
            .then(response => setIssues(response.data));


    }, [params.repository]);

    return (
        <>
            <Header>
                <Logo />
                <Link to="/">
                    <FiChevronLeft />
                    Voltar
                </Link>
            </Header>

            {repository && (
                <RepoInfo>
                    <header>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                    </header>
                    <ul>
                        <li>
                            <strong>{repository.stargazers_count}</strong>
                            <span>Starts</span>
                        </li>
                        <li>
                            <strong>{repository.forks_count}</strong>
                            <span>Forks</span>
                        </li>
                        <li>
                            <strong>{repository.open_issues_count ? repository.open_issues_count : 0}</strong>
                            <span>Issues abertas</span>
                        </li>

                    </ul>

                </RepoInfo>
            )}

            <Issues>
                {issues.map(issue => (
                    <a href={issue.html_url} key={issue.id}>
                        <div>
                            <strong>{issue.title}</strong>
                            <p>{issue.user.login}</p>
                        </div>

                        <FiChevronRight size={20} />
                    </a>
                ))}
            </Issues>


        </>
    )
}

export default Repo;