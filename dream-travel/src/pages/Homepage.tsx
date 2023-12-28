import React from 'react';
import Navbar from '../components/Navbar';
import Jumbotron from '../components/Jumbotron';
import SearchComponent from '../components/SearchComponent';
import TabsAndContent from '../components/TabsAndContent';
import Footer from '../components/Footer';

const Homepage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Jumbotron />
      <SearchComponent />
      <TabsAndContent />
      <Footer />
    </div>
  );
};

export default Homepage;
