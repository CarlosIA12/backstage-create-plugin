import React from 'react';
import { Table, TableColumn, Progress, ResponseErrorPanel } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';

import { Octokit } from '@octokit/rest';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';

// Type that defines what a commit looks like
export type commit = {
  url: string;
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message?: string;
  }
};

// Use commits instead of users
type DenseTableProps = {
  commits: commit[];
};

export const DenseTable = ({ commits }: DenseTableProps) => {

  // Columns that match those of the commit type
  const columns: TableColumn[] = [
    { title: 'URL', field: 'url' },
    { title: 'SHA', field: 'sha' },
    { title: 'Author', field: 'author' },
    { title: 'Email', field: 'email' },
    { title: 'Date', field: 'date' },
    { title: 'Message', field: 'message' },
  ];

  // Mapping to the relevant columns
  const data = commits.map(commit => {
    return {
      url: commit.url,
      sha: commit.sha,
      author: commit.commit.author.name,
      email: commit.commit.author.email,
      date: commit.commit.author.date,
      message: commit.commit.message,
    };
  });

  // Create the table using the data mapped before
  return (
    <Table
      title="Example Commit List"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};



export const ExampleFetchComponent = () => {
  // This allows you to interact with the GitHub auth
  const auth = useApi(githubAuthApiRef);
  const entity = useEntity();

  // Read the data directly from the metadata
  const projectSlug = entity.entity.metadata?.annotations?.['github.com/project-slug'] as string
  const owner = projectSlug.split('/')[0]
  const repo = projectSlug.split('/')[1]
  
  // Change the promise to use commit
  const { value, loading, error } = useAsync(async (): Promise<commit[]> => {

    // Request the GitHub token
    const token = await auth.getAccessToken(['repo']);
    // Client to interact with the API
    const octokit = new Octokit({ auth: token });
    // Request commits from the repo
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/commits',
      {
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      },
    );
    // Match the response to the type you care about
    const data = response.data as commit[];
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  // Return the table
  return <DenseTable commits={value || []} />;
};
