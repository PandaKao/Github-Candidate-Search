import { Link } from 'react-router-dom';

const Nav = () => {
  // TODO: Add necessary code to display the navigation bar and link between the pages
  return (
    <nav>
      <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'row' }}>
        <li style={{ marginRight: '20px' }}>
          <Link className= 'nav-link' to="/SavedCandidates">Home</Link>
        </li>
        <li>
          <Link className= 'nav-link' to="/">Candidate Search</Link>
        </li>

      </ul>
    </nav>
  );
};

export default Nav;
