import React from 'react';

const QueryItem = ({ query }) => {
  const { queryText, answer } = query;

  return (
    <div className="query-item">
      <p className="query-text">{queryText}</p>
      {answer && <p className="answer">Answer: {answer}</p>}
    </div>
  );
};

export default QueryItem;
