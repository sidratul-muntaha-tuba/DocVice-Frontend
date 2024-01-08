import React from 'react';
import QueryItem from './QueryItem';

const QueryList = ({ queries }) => {
  return (
    <div className="query-list">
      {queries.map(query => (
        <QueryItem key={query.id} query={query} />
      ))}
    </div>
  );
};

export default QueryList;
