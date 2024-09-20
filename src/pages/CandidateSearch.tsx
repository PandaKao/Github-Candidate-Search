import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import type Candidate from '../interfaces/Candidate.interface.tsx';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isListExhausted, setIsListExhausted] = useState(false);

  // Fetch candidates and saved candidates on component mount
  useEffect(() => {
    const fetchCandidates = async () => {
      setError(null);
      setIsListExhausted(false);

      try {
        // Load saved candidates from local storage
        const storedCandidates = localStorage.getItem('savedCandidates');
        const saved = storedCandidates ? JSON.parse(storedCandidates) : [];
        setSavedCandidates(saved);

        // Initial search to get a list of candidates
        const initialCandidates = await searchGithub();
        if (initialCandidates.length === 0) {
          setError('No candidates available');
          return;
        }

        // Fetch detailed information for each candidate
        const detailedCandidates: Candidate[] = await Promise.all(
          initialCandidates.map(async (candidate: Candidate) => {
            // Check if the candidate is already saved (by login)
            const isAlreadySaved = saved.some((savedCandidate: Candidate) => savedCandidate.login === candidate.login);

            if (!isAlreadySaved) {
              try {
                const details = await searchGithubUser(candidate.login);
                if (details.login) {
                  return {
                    login: details.login,
                    avatar_url: details.avatar_url,
                    name: details.name || null,
                    email: details.email || null,
                    location: details.location || null,
                    company: details.company || null,
                    bio: details.bio || null,
                  };
                }
              } catch {
                return null; // Return null if fetch fails
              }
            }
            return null; // Exclude already saved candidates
          })
        );

        // Filter out null values from failed fetches
        const validCandidates = detailedCandidates.filter(
          (candidate): candidate is Candidate => candidate !== null && candidate !== undefined
        );

        setCandidates(validCandidates); // Updates with only valid candidates
        if (validCandidates.length > 0) {
          setCurrentCandidate(validCandidates[0]);
        } else {
          setError('No candidates available');
        }
      } catch (err) {
        setError('Failed to fetch candidates');
      }
    };

    fetchCandidates();
  }, []);

  // Update localStorage whenever savedCandidates changes
  useEffect(() => {
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
  }, [savedCandidates]);

  const showNextCandidate = () => {
    if (candidates.length === 0 || !currentCandidate) return;

    const currentIndex = candidates.indexOf(currentCandidate);
    const nextIndex = currentIndex + 1;

    // Checks if there are more candidates available or not
    if (nextIndex < candidates.length) {
      setCurrentCandidate(candidates[nextIndex]);
      setIsListExhausted(false);
    } else {
      setCurrentCandidate(null);
      setIsListExhausted(true);
    }
  };

  const handleSaveCandidate = () => {
    if (currentCandidate) {
      setSavedCandidates((prev) => {
        // Adds current candidate to saved list if not already saved
        if (!prev.find((candidate) => candidate.login === currentCandidate.login)) {
          return [...prev, currentCandidate];
        }
        return prev;
      });

      showNextCandidate();
    }
  };

  const handleNextCandidate = () => {
    showNextCandidate();
  };

  return (
    <main>
      <h1>Candidate Search</h1>
      {error && <p>{error}</p>}
      {currentCandidate ? (
        <div className="container">
          <div className="candidate-card">
            <div>
              <img
                src={currentCandidate.avatar_url}
                alt={`${currentCandidate.login}'s avatar`}
                width="100%"
                height="auto"
              />
            </div>
            <div className="candidate-card__lower">
              <h2>{currentCandidate.name || currentCandidate.login} ({currentCandidate.login})</h2>
              <p>Location: {currentCandidate.location || 'No location provided'}</p>
              <p>
                Email: {currentCandidate.email ? <a href={`mailto:${currentCandidate.email}`}>{currentCandidate.email}</a> : 'No email provided'}
              </p>
              <p>Company: {currentCandidate.company || 'No company provided'}</p>
              <p>Bio: {currentCandidate.bio || 'No bio provided'}</p>
            </div>
          </div>
          <div className="button-group">
            <button onClick={handleNextCandidate}>-</button>
            <button onClick={handleSaveCandidate}>+</button>
          </div>
        </div>
      ) : (
        isListExhausted && <p>No more candidates available</p>
      )}
    </main>
  );
};

export default CandidateSearch;