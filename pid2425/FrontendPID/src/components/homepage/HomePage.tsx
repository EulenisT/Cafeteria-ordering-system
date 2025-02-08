import {Link} from "react-router-dom";

function HomePage() {
    return <>
        <nav>
            <Link to="/">HomePage</Link>{' | '}
            <Link to="/menu">Menu</Link>{' | '}
            <Link to="/compte">Compte</Link>{' | '}
            <Link to="/historique">Historique</Link>{' | '}
            <Link to="/personnaliser">Personnaliser</Link>{' | '}
            <Link to="/panier">Panier</Link>
            <h3>Welcome</h3>
        </nav>
    </>
}

export default HomePage;