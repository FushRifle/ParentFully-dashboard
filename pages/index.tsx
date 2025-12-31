import type { NextPage } from 'next';
import { Content } from '../components/home/content';
import { GoalBackground } from '../constants/GoalBackground';

const Home: NextPage = () => {
   return (
      <GoalBackground>
         <Content />
      </GoalBackground>
   );
};

export default Home;