import './App.css';

import Nav from './components/Nav';
import Header from './components/Header';
import Product from './components/Product';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Nav />
      <section className='min-h-screen'>
        <Header />
        <Product />
      </section>
      <Footer />
    </>
  )
}

export default App
