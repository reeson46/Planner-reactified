import React from 'react'
import Account from "./Account";
import NewTask from "./NewTask";
import BoardSection from './BoardSection';
import CategorySection from './CategorySection';
import Misc from './Misc';

const Sidebar = () => {
  return (
    <ul className="sidebar-nav">
      <Account />
      <NewTask />
      <BoardSection />
      <CategorySection />
      <Misc />
    </ul>
  )
}

export default Sidebar