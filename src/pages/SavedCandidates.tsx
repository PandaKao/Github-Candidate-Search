import { useState, useEffect } from 'react';
import type Candidate from '../interfaces/Candidate.interface.tsx';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  // Load saved candidates from localStorage on page load
  useEffect(() => {
    const saved = localStorage.getItem('savedCandidates');
    if (saved) {
      setSavedCandidates(JSON.parse(saved));
    }
  }, []);

  // Save the updated candidates to localStorage
  const updateLocalStorage = (updatedCandidates: Candidate[]) => {
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };

  // Handle candidate removal (reject)
  const handleRejectCandidate = (login: string) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.login !== login);
    setSavedCandidates(updatedCandidates);
    updateLocalStorage(updatedCandidates);
  };

  // Display message when there are no candidates
  if (savedCandidates.length === 0) {
    return <p>No potential candidates have been accepted yet.</p>;
  }

  return (
    <>
      <h1>Potential Candidates</h1>
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Location</th>
            <th>Email</th>
            <th>Company</th>
            <th>Bio</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {savedCandidates.map((candidate) => (
            <tr key={candidate.login}>
              <td>
                <img
                  src={candidate.avatar_url}
                  alt={`${candidate.login}'s avatar`}
                  width="50"
                  height="50"
                />
              </td>
              <td>
                {candidate.name || candidate.login} ({candidate.login})
              </td>
              <td>{candidate.location || 'No location provided'}</td>
              <td>
                {candidate.email ? <a href={`mailto:${candidate.email}`}>{candidate.email}</a> : 'No email provided'}
              </td>
              <td>{candidate.company || 'No company provided'}</td>
              <td>{candidate.bio || 'No bio provided'}</td>
              <td>
                <button className="reject-button" onClick={() => handleRejectCandidate(candidate.login)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default SavedCandidates;
